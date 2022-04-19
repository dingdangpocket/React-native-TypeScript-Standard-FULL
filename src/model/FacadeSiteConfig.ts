/**
 * @file: FacadeSiteConfig.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { array2map } from '@euler/utils/array';

export interface FacadeSiteConfig {
  code: string;
  name: string;
  overlay: any;
  coords: [number, number, number, number];
}

// prettier-ignore
export const FacdeSiteConfigurations: FacadeSiteConfig[] = [
  { code: 'QBXG', name: '前保险杠', overlay: require('@euler/assets/img/facade-site-overlays/qbxg.png'), coords: [360, 47, 376.58, 91.92] },
  { code: 'QDBL', name: '前挡玻璃', overlay: require('@euler/assets/img/facade-site-overlays/qdbl.png'), coords: [380.36, 305.16, 335.07, 171.98] },

  { code: 'YCHSJ', name: '右侧后视镜', overlay: require('@euler/assets/img/facade-site-overlays/ychsj.png'), coords: [701.44, 378.56, 75.11, 54.96] },
  { code: 'YCDD', name: '右侧大灯', overlay: require('@euler/assets/img/facade-site-overlays/ycdd.png'), coords: [905.84, 80.31, 36.79, 67.91] },
  { code: 'YCWD', name: '右侧尾灯', overlay: require('@euler/assets/img/facade-site-overlays/ycwd.png'), coords: [883.8, 883.8, 41.93, 45.58] },
  { code: 'YCMK', name: '右侧门槛', overlay: require('@euler/assets/img/facade-site-overlays/ycmk.png'), coords: [1014.98, 325.07, 20.59, 424.85] },
  { code: 'YQYZB', name: '右前翼子板', overlay: require('@euler/assets/img/facade-site-overlays/yqyzb.png'), coords: [883.07, 127.44, 134.4, 228.12] },
  { code: 'YHYZB', name: '右后翼子板', overlay: require('@euler/assets/img/facade-site-overlays/yhyzb.png'), coords: [878.19, 705.82, 142.04, 293.19] },
  { code: 'YQCM', name: '右前车门', overlay: require('@euler/assets/img/facade-site-overlays/yqcm.png'), coords: [875.07, 352.89, 142.39, 228.6] },
  { code: 'YHCM', name: '右后车门', overlay: require('@euler/assets/img/facade-site-overlays/yhcm.png'), coords: [876.47, 569.03, 143.11, 230.07] },
  { code: 'yqcl', name: '右前车轮', overlay: require('@euler/assets/img/facade-site-overlays/yqcl.png'), coords: [930.01, 173.44, 141.86, 141.86] },
  { code: 'yhcl', name: '右后车轮', overlay: require('@euler/assets/img/facade-site-overlays/yhcl.png'), coords: [943.89, 761.54, 141.6, 141.6] },

  { code: 'HBAOXG', name: '后保险杠', overlay: require('@euler/assets/img/facade-site-overlays/hbaoxg.png'), coords: [363.55, 986.73, 362.77, 69.69] },
  { code: 'HBXG', name: '后备箱盖', overlay: require('@euler/assets/img/facade-site-overlays/hbxg.png'), coords: [392.22, 913.02, 308.38, 121.57] },
  { code: 'HDBL', name: '后挡玻璃', overlay: require('@euler/assets/img/facade-site-overlays/hdbl.png'), coords: [401.12, 779.59, 287.63, 157.16] },

  { code: 'ZCHSJ', name: '左侧后视镜', overlay: require('@euler/assets/img/facade-site-overlays/zchsj.png'), coords: [316.35, 377.7, 76.3, 55.83] },
  { code: 'ZCDD', name: '左侧大灯', overlay: require('@euler/assets/img/facade-site-overlays/zcdd.png'), coords: [159.22, 79.8, 38.28, 70.67] },
  { code: 'ZCWD', name: '左侧尾灯', overlay: require('@euler/assets/img/facade-site-overlays/zcwd.png'), coords: [176.87, 986.93, 39.75, 43.2] },
  { code: 'ZCMK', name: '左侧门槛', overlay: require('@euler/assets/img/facade-site-overlays/zcmk.png'), coords: [67.47, 323.48, 20.1, 425.68] },
  { code: 'ZQYZB', name: '左前翼子板', overlay: require('@euler/assets/img/facade-site-overlays/zqyzb.png'), coords: [87.43, 127.94, 133.07, 227.62] },
  { code: 'ZHYZB', name: '左后翼子板', overlay: require('@euler/assets/img/facade-site-overlays/zhyzb.png'), coords: [84.58, 710.75, 137.16, 283.11] },
  { code: 'ZQCM', name: '左前车门', overlay: require('@euler/assets/img/facade-site-overlays/zqcm.png'), coords: [87.43, 354.09, 134.34, 229.8] },
  { code: 'ZHCM', name: '左后车门', overlay: require('@euler/assets/img/facade-site-overlays/zhcm.png'), coords: [87.43, 573.38, 137.33, 223.2] },
  { code: 'zqcl', name: '左前车轮', overlay: require('@euler/assets/img/facade-site-overlays/zqcl.png'), coords: [32.24, 174.14, 141.42, 141.42] },
  { code: 'zhcl', name: '左后车轮', overlay: require('@euler/assets/img/facade-site-overlays/zhcl.png'), coords: [14.51, 758.73, 143.68, 143.68] },

  { code: 'YQG', name: '引擎盖', overlay: require('@euler/assets/img/facade-site-overlays/yqg.png'), coords: [362.57, 76.84, 367.69, 269.83] },
  { code: 'CD', name: '车顶', overlay: require('@euler/assets/img/facade-site-overlays/cd.png'), coords: [415.95, 468.24, 257.97, 326.17] },
];

export const FacdeSiteConfigurationMapByName = array2map(
  FacdeSiteConfigurations,
  x => x.name,
);
