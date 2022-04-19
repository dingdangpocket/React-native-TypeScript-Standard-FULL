/**
 * @file: arr2group.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2015-2018 Shanghai mingyou information technology center (limited partnership)
 */

const idempotentFn = (x: any) => x;
type ValueFn<T> = (x: T) => any;

type PropFn<T> = (x: T) => string;

interface Options<T> {
  valuesProp: string;
  groupKeyName: string;
  valueFunc: ValueFn<T>;
  keyAlias: string;
}

/**
 * function that groups a given array
 * @param {Object[]} arr the arr to group
 * @param {String[]|String|Function} props the props by which to group
 *   the given array
 * @param {Object} [options] options
 * @param {String} [options.valuesProp='list'] the property name for the
 *   list in each group, default to 'list'
 * @param {String} [options.groupKeyName='key'] the group key name.
 * @param {Function} [options.valueFunc=x => x] the function that convert
 *   the item of the array.
 * @returns {Array} returns the created groups.
 */
export function arr2group<T extends { [name: string]: any }>(
  arr: T[],
  props: PropFn<T> | string | string[],
  options?: Partial<Options<T>>,
): any[] {
  if (!options) options = {};

  const valuesProp = options.valuesProp ?? 'items';
  const groupKeyName = options.groupKeyName ?? 'key';
  const valueFunc = options.valueFunc ?? idempotentFn;
  const groups: any[] = [];
  const map: { [key: string]: any } = {};

  arr.forEach(item => {
    // calculate the group key.
    let key = '';
    if (typeof props === 'function') {
      key = props(item);
    } else if (typeof props === 'string') {
      key = item[props];
    } else if (Array.isArray(props)) {
      // must be array.
      key = props
        .map(x => item[x])
        .join('_')
        .replace(/_+$/i, '');
    }

    // find the target group.
    let group = map[key];

    // create a new group if not exists.
    if (!group) {
      group = {};
      group[groupKeyName] = key;
      group[valuesProp] = [];

      // save the value of key component
      if (typeof props === 'string') {
        group[props] = item[props];
      } else if (Array.isArray(props)) {
        props.forEach(prop => {
          if (prop === groupKeyName || prop === valuesProp) {
            throw new Error('object property shadows key group props. ');
          }
          group[prop] = item[prop];
        });
      } else if (typeof props === 'function') {
        if (options!.keyAlias) {
          group[options!.keyAlias!] = key;
        }
      }

      map[key] = group;
      groups.push(group);
    }

    group[valuesProp].push(valueFunc(item));
  });

  return groups;
}

export function arr2groupmap<T, TKey>(
  items: T[],
  keyFn: (item: T) => TKey,
): Map<TKey, T[]> {
  const map = new Map<TKey, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}
