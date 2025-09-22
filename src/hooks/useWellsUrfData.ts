import apiRoot from "@/config/apiRoot";
import { getRegionParams } from "@/logic/ExploreModelWells/getRegionParams";
import { RootState } from "@/store";
import { Region } from "@/types/region/Region";
import { AuthState } from "@/types/user/User";
import { ResponseUrfDataDetail, ResponseWell, UrfData, Well, WellExplorerRequestDetail } from "@/types/well/WellExplorer";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export interface UseWellsProps {
  regions: Region[];
  requestDetail: WellExplorerRequestDetail; 
}

export default function useWells({ regions, requestDetail }: UseWellsProps) {
  const flow = requestDetail.flow === "C2VSim" ? 0 : 1;
  const scen = requestDetail.scen === "Pump adjusted" ? 0 : 1;
  const wType = requestDetail.wType === "Irrigation" ? 0 : 1;
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
          });
        });
    }, 
    [regions, requestDetail]
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
      setAllWells(tempWells);
      setLoading(false);
    }

    if (regions && regions[0]) getWells()
  }, [regions, getWellsParams])

  const getWellsByAgeThres = async (agethres: number, por: number) => {
    let tempWells : Well[] = [];
    for (const queryParams of getWellsParams) {
      console.time("fetch");
      const res = await fetch(
        `${apiRoot}/api/well_explorer/get_wells_by_age_thres/`, 
        {
          method:"POST",
          body:JSON.stringify({...queryParams, por: por, agethres: agethres}),
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

    console.log("Wells fetched ", tempWells.length)

    return tempWells;
  }

  return { allWells, loading, getWellsByAgeThres }
}

export interface Props {
  eid: number | null;
  requestDetail: WellExplorerRequestDetail; 
}

export function useWellsUrfData({ eid, requestDetail } : Props) {
  const flow = requestDetail.flow === "C2VSim" ? 0 : 1;
  const scen = requestDetail.scen === "Pump adjusted" ? 0 : 1;
  const wType = requestDetail.wType === "Irrigation" ? 0 : 1;
  const [urfData, setData] = useState<UrfData[]>([])
  const [loading, setLoading] = useState(true)
  const auth = useSelector<RootState, AuthState>((state) => {
    return state.auth;
  });

  useEffect(() => {
    if (!eid) return
    const controller = new AbortController();

    fetch(
      `${apiRoot}/api/well_explorer/well_urf_data/`,
      {
        signal: controller.signal,
        method: "POST",
        body: JSON.stringify({ eid: eid, flow: flow, scen: scen, wtype: wType }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${auth.token}`,
        }
      }
    )
      .then(res => res.json())
      .then(data => {
          let tempUrfData : UrfData[] = data.map((item: ResponseUrfDataDetail) => {
            return {
              sid: item.Sid,
              lat: item.Lat,
              lon: item.Lon,
              len: item.Len,
              wt2d: item.WT2D,
              ageA: item.Age_a,
              ageB: item.Age_b,
            }
          });
          setData(tempUrfData);
          setLoading(false);
        }
      )
      .catch(err => {
        console.log("API error:", err);
        setLoading(false);
      })

      return () => controller.abort();
    }, 
    [eid]
  )

  return { urfData, loading }
}