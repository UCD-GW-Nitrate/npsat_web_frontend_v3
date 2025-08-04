import { Region } from "@/types/region/Region";
import { bmaps } from "./bmaps.js";

const MANTIS_REGION_TYPES: number[] = [
  0, // CV
  1, // basin
  5, // subreg
  3, // b118
  2, // county
  4, // tship
  5, // subreg
];

export function getRegionParams (region: Region) {
  const bmapIndex = MANTIS_REGION_TYPES[region.region_type];
  let idmapIndex = 0
  if (bmapIndex == 1) { // basin
    if (region.id == 47) idmapIndex=2
    else if (region.id == 48) idmapIndex=1
    else idmapIndex=3
  }
  else if (bmapIndex == 5) { // subreg
    idmapIndex = Number(region.external_id)
  }
  else if (bmapIndex == 3) { // b118
    bmaps[3].properties.features.forEach((row: any) => {
      if (row.properties.Basin_Subb == region.external_id) {
        idmapIndex = row.properties.ID
      }
      }
    );
      
    region.external_id
  }
  else if (bmapIndex == 2) { // county
    idmapIndex = region.id
  }
  else if (bmapIndex == 4) { // township
    idmapIndex = region.id - 49
  }

  
  return ({
    bmap: bmapIndex, 
    idmap: idmapIndex
  });
}
