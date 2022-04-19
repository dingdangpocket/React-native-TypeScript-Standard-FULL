/**
 * @file: useVehicleYears.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';

export const useVehicleYears = () => {
  const { detail } = useTaskContext();
  const vehicleYearsMap: Map<string, number> | any = new Map([
    ['1', 2001],
    ['2', 2002],
    ['3', 2003],
    ['4', 2004],
    ['5', 2005],
    ['6', 2006],
    ['7', 2007],
    ['8', 2008],
    ['9', 2009],
    ['A', 2010],
    ['B', 2011],
    ['C', 2012],
    ['D', 2013],
    ['E', 2014],
    ['F', 2015],
    ['G', 2016],
    ['H', 2017],
    ['J', 2018],
    ['K', 2019],
    ['L', 2020],
    ['M', 2021],
    ['N', 2022],
    ['P', 2023],
    ['R', 2024],
    ['S', 2025],
    ['T', 2026],
    ['V', 2027],
    ['W', 2028],
    ['X', 2029],
    ['Y', 2030],
  ]);
  let years = 0;
  if (vehicleYearsMap.get(detail.basicInfo.vin.split('')[9])) {
    const date = new Date();
    const currentYear = date.getFullYear();
    years =
      currentYear -
      vehicleYearsMap?.get(`${detail?.basicInfo.vin?.split('')[9]}`);
  }
  return {
    years,
  };
};
