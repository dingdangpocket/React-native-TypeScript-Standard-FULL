/**
 * @file: linking.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { config } from '@euler/config';
import {
  getPathFromState,
  getStateFromPath,
  LinkingOptions,
  NavigationState,
  PartialRoute,
  PartialState,
  Route,
} from '@react-navigation/native';
import { findLastIndex, update } from 'ramda';

export const isLinkingLogEnabled = true;

const fixPath = (path: string) => {
  return path.replace(/^\/Root/, '').replace(/^\/Drawer/, '');
};

// refer to the following documentation on react-navigation for how to enable
// deep linking and universal links and how to configure links:
// - https://reactnavigation.org/docs/deep-linking/
// - https://reactnavigation.org/docs/configuring-links
export function linkingFactory<T>(
  configuration: LinkingOptions<T>['config'],
): LinkingOptions<T> {
  return {
    prefixes: [config.linking.url, `${config.linking.scheme}://`],
    getPathFromState(state, options) {
      const cleanedState = navigationStateCleanedUp(state);
      const path = cleanedState ? getPathFromState(cleanedState, options) : '/';
      const segments = path.split('/');
      const invalidIndex = segments.findIndex(c => c === 'undefined');
      if (invalidIndex >= 0) {
        return fixPath(segments.slice(0, invalidIndex).join('/'));
      } else {
        return fixPath(path);
      }
    },
    getStateFromPath(path, options) {
      if (path.includes('/wechat/')) return undefined;

      // you can add any rewrites of the path here.
      const state = getStateFromPath(path, options);
      isLinkingLogEnabled &&
        console.log(
          '[linking] state for path: ',
          path,
          ': ',
          JSON.stringify(state, null, 2),
          ', url: ',
          config.linking.url,
        );
      return state;
    },
    config: configuration,
  };
}

/**
 * A helper function that clean the given navigation state by removing all
 * transient (temporary or private) routes whose keys start with "_".
 * @param state the navigation state to cleanup
 * @returns the transformed/cleaned navigation state
 */
function navigationStateCleanedUp(
  state: NavigationState | Omit<PartialState<NavigationState>, 'stale'>,
): typeof state | null {
  const lastViewableRouteIdx = findLastIndex(
    route => !route.name.startsWith('_'),
    state.routes.slice(0, (state.index ?? 0) + 1) as PartialRoute<
      Route<string, object | undefined>
    >[],
  );

  if (lastViewableRouteIdx < 0) return null;

  const lastViewableRoute = state.routes[lastViewableRouteIdx];
  let newState = lastViewableRoute.state;

  if (newState) {
    newState = navigationStateCleanedUp(newState) ?? undefined;
  }

  return {
    ...state,
    routes: update(
      lastViewableRouteIdx,
      {
        ...lastViewableRoute,
        state: newState,
      },
      state.routes as any,
    ) as any,
    index: lastViewableRouteIdx,
  };
}
