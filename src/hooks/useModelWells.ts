import { getRegionParams } from "@/logic/ExploreModelWells/getRegionParams";
import { ModelRun } from "@/types/model/ModelRun";
import { Region } from "@/types/region/Region";
import { ResponseWell, Well } from "@/types/well/WellExplorer";
import { useEffect, useMemo, useState } from "react";

export interface Props {
  regions: Region[];
  customModelDetail: ModelRun;
}

export default function useModelWells({ regions, customModelDetail }: Props) {
  const flow = customModelDetail.flow_scenario.name.includes("C2VSIM") ? 0 : 1;
  const scen = customModelDetail.flow_scenario.name.includes("Pumping") ? 0 : 1;
  const wType = customModelDetail.welltype_scenario.name.includes("Irrigation") ? 0 : 1;
  const por = customModelDetail.porosity;
  const [allWells, setAllWells] = useState<Well[]>([]);
  const [loading, setLoading] = useState(true);

  const getWellsParams = useMemo(
    () => {
      if (!(regions && regions[0]?.region_type)) return []
      if (regions[0].region_type == 0) {
        return Array(3).fill(0).map((_, idx) => ({
            flow: flow,
            scen: scen,
            wType: wType, 
            bmap: 1, 
            idmap: idx,
            por: por
          })
        ); 
      }
      return regions.map(region => {
          const {bmap, idmap} = getRegionParams(region);
          return ({
            flow: flow,
            scen: scen,
            wType: wType, 
            bmap: bmap, 
            idmap: idmap,
            por: por
          });
        });
    }, 
    [regions]
  );

  useEffect(()=>{
    async function getWells() {
      let tempWells : Well[] = [];
      for (const queryParams of getWellsParams) {
        console.time("fetch");
        const res = await fetch(
          "https://subsurface.gr/data/index.php", 
          {
            method:"POST",
            body:JSON.stringify({...queryParams, qType: 1}),
            headers:{
                "Content-type":"applcation/json"
            }
          }
        );
        console.timeEnd("fetch");
        const respdata = await res.json();
        const { data, error, message } = respdata;
        if (error) { 
          console.log(message);
          setLoading(false);
          return;
        }
        const { welldata } = data;

        tempWells.push(...
          (
            welldata.map(
              (well: ResponseWell) => {
                return {
                  eid: well.Eid,
                  lat: well.Lat,
                  lon: well.Lon,
                  unsat: well.UNSATcond,
                  wt2t: well.WT2T,
                  slmod: well.SLmod,
                  depth: well.UNSATcond + well.WT2T + well.SLmod
                }
              }
            )
          )
        );
      }
      tempWells = tempWells.filter((well) => {
        if (customModelDetail.depth_range_min && well.depth < customModelDetail.depth_range_min) return false
        if (customModelDetail.depth_range_max && well.depth > customModelDetail.depth_range_max) return false
        if (customModelDetail.unsat_range_min && well.depth < customModelDetail.unsat_range_min) return false
        if (customModelDetail.unsat_range_max && well.depth > customModelDetail.unsat_range_max) return false
        return true
      })
      setAllWells(tempWells);
      setLoading(false);
    }

    if (regions && regions[0]?.region_type) getWells()
  }, [regions])

  const getWellsByAgeThres = async (agethres: number) => {
    let tempWells : Well[] = [];
    for (const queryParams of getWellsParams) {
      console.time("fetch");
      const res = await fetch(
        "https://subsurface.gr/data/index.php", 
        {
          method:"POST",
          body:JSON.stringify({...queryParams, qType: 3, agethres: agethres}),
          headers:{
              "Content-type":"applcation/json"
          }
        }
      );
      console.timeEnd("fetch");
      const respdata = await res.json();
      const { data, error, message } = respdata;
      if (error) { 
        console.log(message);
        continue;
      }

      tempWells.push(...
        (
          data.map(
            (well: ResponseWell) => {
              return {
                eid: well.Eid,
                lat: well.Lat,
                lon: well.Lon,
                unsat: well.UNSATcond,
                wt2t: well.WT2T,
                slmod: well.SLmod,
                depth: well.UNSATcond + well.WT2T + well.SLmod
              }
            }
          )
        )
      );
    }

    tempWells = tempWells.filter((well) => {
      if (customModelDetail.depth_range_min && well.depth < customModelDetail.depth_range_min) return false
      if (customModelDetail.depth_range_max && well.depth > customModelDetail.depth_range_max) return false
      if (customModelDetail.unsat_range_min && well.depth < customModelDetail.unsat_range_min) return false
      if (customModelDetail.unsat_range_max && well.depth > customModelDetail.unsat_range_max) return false
      return true
    })

    console.log("Wells fetched ", tempWells.length)

    return tempWells;
  }

  return { allWells, loading, getWellsByAgeThres }
}