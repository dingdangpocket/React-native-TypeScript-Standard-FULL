/**
 * @file: react-native-user-agent.d.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

declare module 'react-native-user-agent' {
  const factory: {
    getUserAgent: () => string;
  };
  export default factory;
}
