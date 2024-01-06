import GNLMcropAreas from './CropAreasData/GNLM_AreaPerCrop';

interface CropAreaInfo {
  CropId: number;
  Area: number;
}

interface CropAreaMap {
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
  // crops: allOtherArea(null) is inteantionally left out for selected crops
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
  if (load_scenario === 1) {
    if (mapType === 0) {
      cropsData = GNLMcropAreas[0]!.Regions[0]!.CropList;
      totalAreas = GNLMcropAreas[0]!.Regions[0]!.TotArea;
    } else if (mapType && mapType in regionMacros) {
      GNLMcropAreas.forEach((maps) => {
        if (maps.Code === regionMacros[mapType])
          maps.Regions.forEach((region) => {
            if (regions.includes(region.Name)) {
              cropsData = cropsData.concat(region.CropList);
              totalAreas += region.TotArea;
            }
          });
      });
    }
  }

  // calculate total area for each selected crops
  cropsData.forEach((crop) => {
    if (crops.includes(crop.CropId)) {
      if (!(crop.CropId in cropAreaMap)) {
        cropAreaMap[crop.CropId] = crop.Area;
        selectedCropAreas += crop.Area;
      } else {
        cropAreaMap[crop.CropId] += crop.Area;
        selectedCropAreas += crop.Area;
      }
    }
  });

  cropAreaMap[0] = totalAreas - selectedCropAreas;

  return cropAreaMap;
};

export default areaPerCrop;
