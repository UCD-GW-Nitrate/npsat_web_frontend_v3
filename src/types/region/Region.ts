import { ModelRegion } from "../model/ModelRegion";

export interface Region extends ModelRegion {
  geometry: Geometry;
}

export interface Geometry {
  type:
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
    | 'GeometryCollection'
    | 'Feature'
    | 'FeatureCollection';
  properties: Property;
  geometry: RegionGeometry;
}

export interface Property {
  DWR_: string;
  SUBBSN: string;
  BAS_SBBSN: string;
  GWBASIN: string;
  SUBNAME: string;
  ACRES: number;
  BUDGET_TYP: string;
  Regional_0: number;
  Shape_Area: number;
  id: number;
  name: string;
}

export interface RegionGeometry {
  type: string;
  coordinates: [[number[]]];
}
