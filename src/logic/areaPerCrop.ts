import GNLMcropAreas from './CropAreasData/GNLM_AreaPerCrop_OCT24';
import SWATcropAreas from './CropAreasData/SWAT_AreaPerCrop_OCT24';

interface CropAreaInfo {
  CropId: number;
  Area: number;
}

export interface CropAreaMap {
  [cropId: string]: number;
}

interface RegionMacros {
  [regionId: number]: string;
}

const areaPerCrop = (
  mapType: number | undefined,
  load_scenario: number | undefined,
  crops: number[] = [],
  regions: string[] = [],
): CropAreaMap => {
  let areaData = GNLMcropAreas;
  if (load_scenario !== 1) {
    // load scenario is not GNLM
    areaData = SWATcropAreas;
  }

  crops.shift();

  let cropsData: CropAreaInfo[] = [];
  const regionMacros: RegionMacros = {
    0: 'CentralValley',
    1: 'Basins',
    4: 'Counties',
    3: 'B118',
    2: 'Subregions',
    5: 'Townships',
  };
  const cropAreaMap: CropAreaMap = {};
  let selectedCropAreas = 0;
  let totalAreas = 0;

  // load data of selected regions
  if (mapType === 0) {
    // Central Valley
    cropsData = areaData[0]!.Regions[0]!.CropList;
    totalAreas = areaData[0]!.Regions[0]!.TotArea;
  } else if (mapType && mapType in regionMacros) {
    areaData.forEach((maps: any) => {
      if (maps.Code === regionMacros[mapType]) {
        maps.Regions.forEach((region: any) => {
          if (regions.includes(region.Name)) {
            cropsData = cropsData.concat(region.CropList);
            totalAreas += region.TotArea;
          }
        });
      }
    });
  }

  // calculate total area for each selected crops
  cropsData.forEach((crop) => {
    if (crops.includes(crop.CropId)) {
      if (!(crop.CropId in cropAreaMap)) {
        cropAreaMap[crop.CropId] = crop.Area;
        selectedCropAreas += crop.Area;
      } else {
        cropAreaMap[crop.CropId]! += crop.Area;
        selectedCropAreas += crop.Area;
      }
    }
  });

  cropAreaMap[1] = totalAreas - selectedCropAreas;

  return cropAreaMap;
};

export default areaPerCrop;
