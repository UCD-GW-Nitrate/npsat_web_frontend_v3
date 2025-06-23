import type { GeoJsonObject } from 'geojson';
import type { Layer } from 'leaflet';
import { useEffect, useState } from 'react';
import { CircleMarker, GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import * as math from './math';

import type { Geometry, Region } from '@/types/region/Region';
import Histogram from '../charts/Histogram/Histogram';
import { Scenario } from '@/types/model/Scenario';
import { useGetWellsQuery } from '@/store';

export interface MapProps {
  path: Geometry[];
  onEachFeature?: (feature: any, layer: Layer) => void;
  selected?: number[];
  regions?: Region[];
  flow?: Scenario,
  wType?: Scenario,
  por?: number,
}

// qtype>0 and bmpa!=0
let varQueryData = {
  qType: 1,
  flow: 0,
  scen: 0,
  wType: 0,
  por: 0.2,
  bmap: 2,
  idmap: 1,
  agethres: 50.0,
};

{/* <div id="map" style={{ position: 'relative', height: '600px', width: '600px', margin: 0 }}>
            <WellsMap
              path={regions.map((region: Region) => region.geometry)}
              regions={regions}
              flow={customModelDetail.flow_scenario}
              wType={customModelDetail.welltype_scenario}
              por={customModelDetail.porosity}
            />
          </div> */}

let urfQueryData = {"qType": 2, "flow":1, "scen":1, "wType":1, "eid":2}

// eslint-disable-next-line no-empty-pattern
const WellsMap2 = ({ path, onEachFeature, selected, regions, flow, wType, por }: MapProps) => {
  const [wells, setWells] = useState([]);
  const [eid, setEid] = useState(2);
  const [chartDepthPerc, setDepthPerc] = useState([])
  const [chartUnsatPerc, setUnsatPerc] = useState([])
  const [updateIndex, setUpdateIndex] = useState(0)
  const [mapUpdate, setMapUpdate] = useState(0)
  const [minDepth, setMinDepth] = useState(null)
  const [maxDepth, setMaxDepth] = useState(null)
  const [selectedWellId, setSelectedWellId] = useState(null);
  const params = {
        county: ['Shasta']
  }
  const { data, error, isLoading } = useGetWellsQuery(params);

  useEffect(() => {
    async function getWells() {
      if (isLoading) {
        return
      }
      console.log(" HERE ", data)
          // const {welldata, urfdata} = data
          const welldata = data.results;
          // console.log('welldata', welldata, '  urf', urfdata)
          console.log(welldata);
          setWells(welldata);
          const allDepths = welldata.map(well => well.depth);
          setMinDepth(Math.min(...allDepths))
          setMaxDepth(Math.max(...allDepths))
      setMapUpdate(mapUpdate+1)
    }
    getWells();
  }, [data]);

  useEffect(() => {

    async function getURFData() {
      urfQueryData.eid = eid
      const params = {
        method: 'POST',
        body: JSON.stringify(urfQueryData),
        headers: {
          'Content-type': 'applcation/json',
        },
      };
      const response = await fetch('https://subsurface.gr/data/index.php', params);
      const respdata = await response.json();
      const { data, error, message } = respdata;
      const { urfdata } = data;
      return urfdata;
    }

    function ade(t, v, x, D){
    
      var x_vt = x - v*t;
      var sqrDtx2 = 2*Math.sqrt(D*t);
      var p1 = 0.5*erfc(x_vt/sqrDtx2);
      var p2 = Math.sqrt(t*v*v/(Math.PI*D));
      var p3 = Math.exp(-1.0*(x_vt*x_vt)/(4*D*t));
      var p4 = 0.5 * (1+ v*x/D + t*v*v/D);
      var p5 = Math.exp(v*x/D);
      var p6 = erfc((x + v*t )/sqrDtx2)
      return  0.5*erfc(x_vt/sqrDtx2) + 
              Math.sqrt(t*v*v/(Math.PI*D)) * 
              Math.exp(-1.0*(x_vt*x_vt)/(4*D*t)) -
              0.5 * (1+ v*x/D + t*v*v/D) *
              Math.exp(v*x/D)*
              erfc((x + v*t )/sqrDtx2);
    }

    function erfc(x) {
        return 1-math.erf(x);
    }

    function ADEurf(l, a, T){
      let out = new Array();
      out.push([0, 0]);
      var v = l/(a*365);
      var aL = 0.32 * Math.pow(l, 0.83);
      var D = aL*v + 1e-7;
      var c_prev = 0;
      var cc;
      for (let ii = 1; ii < T; ++ii){
        let c = ade(ii*365, v, l, D);
        cc = c - c_prev;
        if (cc < 0.000000001){
          cc = 0;
        }
        out.push([ii, cc]);
        c_prev = c;
        if (c > 0.98){
          break;
        }
      }
      return out;
    }

    function integrateURF(urfData) {
      let total = 0;
      for (let i = 1; i < urfData.length; i++) {
        const dt = urfData[i][0] - urfData[i - 1][0];
        const avgVal = (urfData[i][1] + urfData[i - 1][1]) / 2;
        total += dt * avgVal;
      }
      return total;
    }


    function updateCharts(urfData) {
      if (!urfData) {
        return
      }

      const numBins = 10;
      let minDepth = urfData[0].WT2D;
      let maxDepth = urfData[0].WT2D;

      for (let i = 1; i < urfData.length; i++) {
        const depth = urfData[i].WT2D;
        if (depth < minDepth) {
          minDepth = depth
        }
        else if (depth > maxDepth) {
          maxDepth = depth
        }
      }

      console.log("min ", minDepth)
      console.log("max ", maxDepth)
      const binSize = (maxDepth - minDepth) / numBins;
      
      const depthBins = new Array(numBins+1).fill(0); // stores summed contributions

      for (let i = 0; i < urfData.length; i++) {
        const s = urfData[i];
        const age = s.Age_a * varQueryData.por + s.Age_b;
        const urf = ADEurf(s.Len, age, 500);
        const contribution = integrateURF(urf);

        const depth = s.WT2D; // OR (topDepth - s.WT2D) for unsaturated depth
        const binIndex = Math.floor((depth - minDepth) / binSize);

        if (binIndex >= 0 && binIndex < numBins+1) {
          depthBins[binIndex] = contribution;
          console.log(binIndex, " ", contribution)
        }
      }

      const depthVsPctData = [];
      for (let i = 0; i < numBins+1; i++) {
        const binCenter = minDepth + i * binSize + binSize / 2;
        depthVsPctData.push({x: binCenter, y: depthBins[i]});
      }
      setDepthPerc([
        {
          name: "Concentration - Depth",
          data: depthVsPctData
        }
      ])
    }

    async function update() {
      const urfData = await getURFData();
      console.log("urfData ", urfData)
      updateCharts(urfData)
      setUpdateIndex(updateIndex+1)
    }
    
    update()
  }, [eid]);

  function handleClick(well) {
    console.log(well);
    setSelectedWellId(well.eid);
    setEid(well.eid)
  }

  function getColorForDepth(depth) {
    const t = (depth - minDepth) / (maxDepth - minDepth); // normalize to [0,1]

    // Orange: rgb(255, 165, 0)
    // Green:  rgb(0, 128, 0)
    const r = Math.round(255 * (1 - t));         // 255 → 0
    const g = Math.round(165 * (1 - t) + 128 * t); // 165 → 128
    const b = 0; // stays constant

    return `rgb(${r}, ${g}, ${b})`;
  }


  return (
    <>
      <MapContainer key={"Map"+mapUpdate} center={[37.58, -119.4179]} zoom={6}>
        <GeoJSON
          key={path.length + (selected?.length ?? 0)}
          data={path as unknown as GeoJsonObject}
          onEachFeature={onEachFeature}
          style={(feature) =>
            // eslint-disable-next-line no-nested-ternary
            selected !== undefined
              ? selected?.indexOf(feature?.properties.id) !== -1
                ? {
                    color: 'red',
                  }
                : {
                    color: 'blue',
                  }
              : { color: 'blue' }
          }
        />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {wells &&
          wells.map((well, index) => (
            <CircleMarker
              key={`well${index}`}
              center={[well.lat, well.lon]}
              pathOptions={{
                color: selectedWellId === well.eid ? 'red' : getColorForDepth(well.depth),
                fillColor: selectedWellId === well.eid ? 'red' : getColorForDepth(well.depth),
                fillOpacity: 1,
              }}
              radius={5}
              eventHandlers={{
                click: () => handleClick(well)
              }}
            />
          ))}
      </MapContainer>

      <div style={{position: 'absolute', width: '600px', height: '600px', top: 50, left: 600}}>
        <Histogram key={"Histogram"+updateIndex} data={chartDepthPerc} title="Depth vs %" xTitle="Depth (m)" yTitle="nitrate contribution" />
      </div>
    </>
  );
};

export default WellsMap2;
