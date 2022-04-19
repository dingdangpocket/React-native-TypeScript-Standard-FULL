import { useWindowDimensions } from 'react-native';
export const useVehicleSiteArr = () => {
  const { width } = useWindowDimensions();
  const vehicleSiteArr = [
    {
      site: '前保险杠',
      styles: { left: width * 0.47, top: 10 },
    },
    {
      site: '前挡玻璃',
      styles: { left: width * 0.47, top: 120 },
    },
    {
      site: '右侧后视镜',
      styles: { left: width * 0.65, top: 126 },
    },
    {
      site: '右侧大灯',
      styles: { left: width * 0.81, top: 19 },
    },
    {
      site: '右侧尾灯',
      styles: { left: width * 0.78, top: 330 },
    },
    {
      site: '右侧门槛',
      styles: { left: width * 0.9, top: 165 },
    },
    {
      site: '右前翼子板',
      styles: { left: width * 0.79, top: 80 },
    },
    {
      site: '右后翼子板',
      styles: { left: width * 0.82, top: 300 },
    },
    {
      site: '右前车门',
      styles: { left: width * 0.83, top: 130 },
    },
    {
      site: '右后车门',
      styles: { left: width * 0.83, top: 210 },
    },
    {
      site: '右前车轮',
      styles: { left: width * 0.88, top: 70 },
    },
    {
      site: '右后车轮',
      styles: { left: width * 0.89, top: 268 },
    },
    {
      site: '后保险杠',
      styles: { left: width * 0.47, top: 345 },
    },
    {
      site: '后备箱盖',
      styles: { left: width * 0.47, top: 314 },
    },
    {
      site: '后挡玻璃',
      styles: { left: width * 0.47, top: 275 },
    },
    {
      site: '左侧后视镜',
      styles: { left: width * 0.27, top: 125 },
    },
    {
      site: '左侧大灯',
      styles: { left: width * 0.13, top: 17 },
    },
    {
      site: '左侧尾灯',
      styles: { left: width * 0.15, top: 330 },
    },
    {
      site: '左侧门槛',
      styles: { left: width * 0.035, top: 165 },
    },
    {
      site: '左前翼子板',
      styles: { left: width * 0.15, top: 80 },
    },
    {
      site: '左后翼子板',
      styles: { left: width * 0.12, top: 297 },
    },
    {
      site: '左前车门',
      styles: { left: width * 0.11, top: 125 },
    },
    {
      site: '左后车门',
      styles: { left: width * 0.11, top: 210 },
    },
    {
      site: '左前车轮',
      styles: { left: width * 0.06, top: 69 },
    },
    {
      site: '左后车轮',
      styles: { left: width * 0.05, top: 267 },
    },
    {
      site: '引擎盖',
      styles: { left: width * 0.47, top: 60 },
    },
    {
      site: '车顶',
      styles: { left: width * 0.47, top: 205 },
    },
  ];
  return { vehicleSiteArr };
};
