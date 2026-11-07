import { fromArrayBuffer } from 'geotiff';
import proj4 from 'proj4';

import { DENIT_COLORS } from './constants';

// NAD83 / Conus Albers, the projection the denitrification rasters come in
const EPSG_5070 =
  '+proj=aea +lat_0=23 +lon_0=-96 +lat_1=29.5 +lat_2=45.5 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs';
const albers = proj4('EPSG:4326', EPSG_5070);

const EARTH_RADIUS = 6378137; // sphere used by Web Mercator
// output pixels per raster pixel, keeps the cell edges sharp after reprojection
const OUTPUT_SCALE = 2;

type RGB = [number, number, number];

// raster resampled onto a Web Mercator grid, so Leaflet can show it as an image
export interface DenitRaster {
  width: number;
  height: number;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  values: Float32Array; // map value of each output pixel, NaN where there is no data
}

const toMercator = (lng: number, lat: number): [number, number] => [
  (EARTH_RADIUS * lng * Math.PI) / 180,
  EARTH_RADIUS * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)),
];

const mercatorToLng = (x: number) => (x / EARTH_RADIUS) * (180 / Math.PI);

const mercatorToLat = (y: number) =>
  (2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2) * (180 / Math.PI);

const loadRaster = async (url: string): Promise<DenitRaster> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url} (${response.status})`);
  }
  const image = await (
    await fromArrayBuffer(await response.arrayBuffer())
  ).getImage();
  const epsg = image.getGeoKeys()?.ProjectedCSTypeGeoKey;
  if (epsg !== 5070) {
    throw new Error(`${url} must be in EPSG:5070, found ${epsg}`);
  }

  const source = (await image.readRasters())[0] as ArrayLike<number>;
  const srcWidth = image.getWidth();
  const srcHeight = image.getHeight();
  const [originX, originY] = image.getOrigin() as [number, number];
  const [resX, resY] = image.getResolution() as [number, number]; // resY is negative
  const noData = image.getGDALNoData();

  // Web Mercator bounding box, from points along the raster edges
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const addEdgePoint = (col: number, row: number) => {
    const [lng, lat] = albers.inverse([
      originX + col * resX,
      originY + row * resY,
    ]);
    const [x, y] = toMercator(lng, lat);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  };
  for (let col = 0; col <= srcWidth; col += 1) {
    addEdgePoint(col, 0);
    addEdgePoint(col, srcHeight);
  }
  for (let row = 0; row <= srcHeight; row += 1) {
    addEdgePoint(0, row);
    addEdgePoint(srcWidth, row);
  }

  // for each output pixel, look up the raster cell under its centre
  const width = srcWidth * OUTPUT_SCALE;
  const height = Math.round((width * (maxY - minY)) / (maxX - minX));
  const pixelX = (maxX - minX) / width;
  const pixelY = (maxY - minY) / height;
  const values = new Float32Array(width * height).fill(NaN);
  for (let j = 0; j < height; j += 1) {
    const lat = mercatorToLat(maxY - (j + 0.5) * pixelY);
    for (let i = 0; i < width; i += 1) {
      const lng = mercatorToLng(minX + (i + 0.5) * pixelX);
      const [x, y] = albers.forward([lng, lat]);
      const col = Math.floor((x - originX) / resX);
      const row = Math.floor((y - originY) / resY);
      if (col >= 0 && col < srcWidth && row >= 0 && row < srcHeight) {
        const value = source[row * srcWidth + col]!;
        if (value !== noData && Number.isFinite(value)) {
          values[j * width + i] = value;
        }
      }
    }
  }

  return {
    width,
    height,
    bounds: [
      [mercatorToLat(minY), mercatorToLng(minX)],
      [mercatorToLat(maxY), mercatorToLng(maxX)],
    ],
    values,
  };
};

// each file is downloaded and reprojected once, then reused
const rasters = new Map<string, Promise<DenitRaster>>();

export const getDenitRaster = (url: string): Promise<DenitRaster> => {
  if (!rasters.has(url)) {
    rasters.set(
      url,
      loadRaster(url).catch((error) => {
        rasters.delete(url); // allow a retry next time
        throw error;
      }),
    );
  }
  return rasters.get(url)!;
};

// draws the raster as a PNG data URL, pixels without a colour stay transparent
const paint = (
  raster: DenitRaster,
  colorOf: (value: number) => RGB | null,
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = raster.width;
  canvas.height = raster.height;
  const context = canvas.getContext('2d')!;
  const image = context.createImageData(raster.width, raster.height);
  raster.values.forEach((value, k) => {
    if (Number.isNaN(value)) return;
    const color = colorOf(value);
    if (color) image.data.set([...color, 255], k * 4);
  });
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
};

const rampColor = (value: number): RGB => {
  const ramp = DENIT_COLORS.RAMP;
  const t = Math.min(Math.max(value, 0), 1) * (ramp.length - 1);
  const i = Math.min(Math.floor(t), ramp.length - 2);
  const low = ramp[i]!;
  const high = ramp[i + 1]!;
  return low.map((c, k) => Math.round(c + (high[k]! - c) * (t - i))) as RGB;
};

export const renderFullMap = (raster: DenitRaster) => paint(raster, rampColor);

// same rule as Mantis: only values strictly above the threshold count
export const renderAboveThreshold = (raster: DenitRaster, threshold: number) =>
  paint(raster, (value) =>
    value > threshold ? DENIT_COLORS.ABOVE_THRESHOLD : null,
  );
