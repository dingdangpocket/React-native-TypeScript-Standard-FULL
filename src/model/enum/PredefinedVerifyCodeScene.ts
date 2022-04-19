/**
 * @file: PredefinedVerifyCodeScene.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export enum PredefinedVerifyCodeScene {
  Identity = 'identity',
  Login = 'login',
  Signup = 'signup',
  ChangePassword = 'changePassword',
}

export const SupportedVerifyCodeSceneSet = new Set<PredefinedVerifyCodeScene>([
  PredefinedVerifyCodeScene.Identity,
  PredefinedVerifyCodeScene.Login,
  PredefinedVerifyCodeScene.Signup,
  PredefinedVerifyCodeScene.ChangePassword,
]);
