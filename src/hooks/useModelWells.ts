import apiRoot from "@/config/apiRoot";
import { getRegionParams } from "@/logic/ExploreModelWells/getRegionParams";
import { RootState } from "@/store";
import { ModelRun } from "@/types/model/ModelRun";
import { Region } from "@/types/region/Region";
import { AuthState } from "@/types/user/User";
import { ResponseWell, Well } from "@/types/well/WellExplorer";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export interface Props {
  regions: Region[];
  customModelDetail: ModelRun;
}

export default function useModelWells({ regions, customModelDetail }: Props) {
  const flow = customModelDetail.flow_scenario.name.includes("C2VSIM") ? 0 : 1;
  const scen = customModelDetail.flow_scenario.name.includes("Pumping") ? 0 : 1;
  const wType = customModelDetail.welltype_scenario.name.includes("Irrigation") ? 0 : 1;
  const por = customModelDetail.porosity / 100;
  const [allWells, setAllWells] = useState<Well[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  const getWellsParams = useMemo(
    () => {
      if (!regions || !regions[0]) return []
      if (regions[0].region_type == 0) {
        return Array(3).fill(0).map((_, idx) => ({
            flow: flow,
            scen: scen,
            wtype: wType, 
            bmap: 1, 
            idmap: idx+1,
            por: por
          })
        ); 
      }
      return regions.map(region => {
          const {bmap, idmap} = getRegionParams(region);
          return ({
            flow: flow,
            scen: scen,
            wtype: wType, 
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
          `${apiRoot}/api/well_explorer/region_wells/`, 
          {
            method:"POST",
            body:JSON.stringify(queryParams),
            headers:{
              'Content-Type': 'application/json',
              Authorization: `Token ${auth.token}`,
            }
          }
        );
        console.timeEnd("fetch");
        if (!res.ok) {
          console.error("API error:", res.status);
          return;
        }
        const data = await res.json();

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
      setAllWells(tempWells);
      setLoading(false);
    }

    if (regions && regions[0]) getWells()
  }, [regions])

  const getWellsByAgeThres = async (agethres: number) => {
    let tempWells : Well[] = [];
    for (const queryParams of getWellsParams) {
      console.time("fetch");
      const res = await fetch(
        `${apiRoot}/api/well_explorer/get_wells_by_age_thres/`, 
        {
          method:"POST",
          body:JSON.stringify({...queryParams, agethres: agethres}),
          headers:{
            'Content-Type': 'application/json',
            Authorization: `Token ${auth.token}`,
          }
        }
      );
      console.timeEnd("fetch");
      if (!res.ok) {
        console.error("API error:", res.status);
        return;
      }
      const data = await res.json();

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