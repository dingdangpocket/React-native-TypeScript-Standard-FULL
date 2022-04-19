/**
 * @file: useInventory.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useCurrentUser } from '@euler/app/flows/auth';
import { asyncStorageSubjectForKey$ } from '@euler/functions';
import { sentry } from '@euler/lib/integration/sentry';
import {
  VehicleInspectionSite,
  VehicleInspectionSiteCheckItem,
  VehicleInspectionSiteCheckItemOption,
} from '@euler/model/entity';
import { InventoryService } from '@euler/services';
import { useServiceFactory } from '@euler/services/factory';
import { makeDebug } from '@euler/utils';
import { useObservable } from '@euler/utils/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { filter, firstValueFrom, Observable, Subject } from 'rxjs';

const debug = makeDebug('inventory');

type VersionInfo = { system: number; org: number; store: number };

export type InspectionItemInfo = Omit<
  VehicleInspectionSiteCheckItem,
  'options'
> & {
  options: VehicleInspectionSiteCheckItemOption[];
};

export type InspectionSiteInfo = Omit<VehicleInspectionSite, 'checkItems'> & {
  checkItems: InspectionItemInfo[];
};

const kDefaultExpiry = 30 * 24 * 3600 * 1000; // 30 days

export type Inventory = {
  sites: InspectionSiteInfo[];
  version: string;
  expireAt: number;
};

export const useInventoryStorageKey = () => {
  const user = useCurrentUser()!;

  // the inventory storage is associated
  return `inventory:${user.org.id}:${user.store?.id ?? 0}`;
};

const versionInfoToString = (versionInfo: VersionInfo) =>
  [
    versionInfo?.system ?? 0,
    versionInfo?.org ?? 0,
    versionInfo?.store ?? 0,
  ].join('.');

const isValid = (inventory: Inventory, version: string) => {
  return inventory.expireAt > Date.now() && inventory.version === version;
};

const isNotUndefined = <T>(value: T | null | undefined): value is T | null => {
  return value !== undefined;
};

class InventoryManager {
  static instance: InventoryManager | undefined;

  private started = false;
  private readonly inventory$ = new Subject<Inventory>();
  private localVersion: string | undefined;
  private localCache: Inventory | undefined;

  constructor(
    private readonly inventoryService: InventoryService,
    public readonly key: string,
  ) {}

  get version$() {
    return asyncStorageSubjectForKey$<string>(this.key + '.version');
  }

  get cached$() {
    return asyncStorageSubjectForKey$<Inventory>(this.key);
  }

  static forKey(
    inventoryService: InventoryService,
    key: string,
  ): InventoryManager {
    if (!this.instance || this.instance.key !== key) {
      this.instance = new InventoryManager(inventoryService, key);
    }
    return this.instance;
  }

  subscribe(): Observable<Inventory> {
    if (!this.started) {
      void this.proc();
      this.started = true;
    }

    return this.inventory$;
  }

  async proc() {
    try {
      debug('loading local cached inventory information');
      const [version, cached] = await Promise.all([
        firstValueFrom(this.version$.pipe(filter(isNotUndefined))),
        firstValueFrom(this.cached$.pipe(filter(isNotUndefined))),
      ]);

      let willRefresh = true;

      if (version && cached) {
        const valid = isValid(cached, version);
        debug(
          'local inventory data found, version:',
          version,
          ', expiry:',
          cached.expireAt,
          ', valid:',
          valid,
        );
        if (valid) {
          willRefresh = false;
          this.inventory$.next(cached);
          this.localVersion = version;
          this.localCache = cached;
        }
      } else {
        debug('no local cached inventory data');
      }

      if (willRefresh) {
        await this.refresh();
      }
    } catch (e) {
      sentry.captureException(e);
      this.inventory$.error(e);
      debug(e);
    }
  }

  async refresh(force?: boolean) {
    try {
      debug('refreshing inventory data... ');
      const { sites, versionInfo } = await this.inventoryService.load();
      const inventory: Inventory = {
        sites: sites as InspectionSiteInfo[],
        version: versionInfoToString(versionInfo),
        expireAt: Date.now() + kDefaultExpiry,
      };
      if (inventory.version !== this.localVersion || force) {
        this.version$.next(inventory.version);
        this.cached$.next(inventory);
        this.localVersion = inventory.version;
        this.localCache = inventory;
        this.inventory$.next(inventory);
        debug('updated to latest version: ', inventory.version);
      } else {
        debug('no changes found');
      }
    } catch (e) {
      sentry.captureException(e);
      if (!this.localCache) {
        this.inventory$.error(e);
      }
      debug(e);
    }
  }

  async check() {
    try {
      debug('checking server for inventory version changes... ');
      const versionInfo = await this.inventoryService.getVersions();
      const version = versionInfoToString(versionInfo);
      debug('server version:', version, ', local version:', this.localVersion);
      if (this.localVersion !== version) {
        debug('inventory version updated, will refresh inventory... ');
        await this.refresh();
      }
    } catch (e) {
      sentry.captureException(e);
      debug(e);
    }
  }
}

export const useInventory = () => {
  const key = useInventoryStorageKey();
  const { inventoryService } = useServiceFactory();

  const manager = InventoryManager.forKey(inventoryService, key);
  manager.subscribe();

  const inventory = useObservable(() => manager.subscribe(), key);

  useEffect(() => {
    void manager.check();
  }, [manager]);

  const refresh = useCallback(
    (force?: boolean) => {
      void manager.refresh(force);
    },
    [manager],
  );

  return [inventory, refresh] as const;
};

export type InventoryQuery = {
  getSiteById(siteId: number): InspectionSiteInfo | undefined;
  getSiteByCode(code: string): InspectionSiteInfo | undefined;
};

export const useInventoryLookup = (inventory: Inventory): InventoryQuery => {
  const [siteIdMap, siteCodeMap] = useMemo(() => {
    const [a, b] = [
      new Map<number, InspectionSiteInfo>(),
      new Map<string, InspectionSiteInfo>(),
    ];
    inventory.sites.forEach(site => {
      a.set(site.id, site);
      b.set(site.code, site);
    });
    return [a, b] as const;
  }, [inventory]);

  const getSiteById = useCallback(siteId => siteIdMap.get(siteId), [siteIdMap]);
  const getSiteByCode = useCallback(
    code => siteCodeMap.get(code),
    [siteCodeMap],
  );

  return {
    getSiteById,
    getSiteByCode,
  };
};
