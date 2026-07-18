import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import type { PolygonsDict } from '@/store/slices/polygonSlice';

export function DrawControl({
  onCreated,
  onEdited,
  onDeleted,
  initialPolygons,
}: {
  onCreated: (e: any) => void;
  onEdited: (e: any) => void;
  onDeleted: (e: any) => void;
  initialPolygons: PolygonsDict;
}) {
  const map = useMap();
  const drawnItemsRef = useRef(new L.FeatureGroup());

  // setup controls and handlers on-mount
  useEffect(() => {
    if (!map) return;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    const pane = drawnItems.getPane();
    if (pane) {
      pane.style.zIndex = '1000';
    }

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        marker: false,
        circle: false,
        rectangle: false,
        polyline: false,
        circlemarker: false,
        polygon: {
          showArea: true,
          allowIntersection: false,
          snapPoint: true,
        },
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const { layer } = event;
      drawnItems.addLayer(layer);
      onCreated?.(event, layer);
    });

    map.on(L.Draw.Event.EDITED, (event) => {
      onEdited?.(event);
    });

    map.on(L.Draw.Event.DELETED, (event) => {
      onDeleted?.(event);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map]);

  // draw the polygons passed in by parent, allowing them to be controllable by DrawControl.
  // polygons created directly using drawControl may be reinstated / repeated by initialPolygons,
  // in which case, skip drawing polygons whose leaflet_id already are on the map
  useEffect(() => {
    if (!map || !initialPolygons) return;
    const drawnItems = drawnItemsRef.current;

    const incomingIds = Object.keys(initialPolygons);

    drawnItems.eachLayer((layer) => {
      if (!incomingIds.includes(String(layer._leaflet_id))) {
        drawnItems.removeLayer(layer);
      }
    });

    Object.entries(initialPolygons).forEach(([stringId, polyData]) => {
      const polygonId = Number(stringId);

      const existingLayer = drawnItems.getLayer(polygonId) as
        | L.Polygon
        | undefined;

      if (!existingLayer) {
        const polygon = L.polygon(polyData as L.LatLngExpression[], {
          color: '#3388ff',
          weight: 4,
        });

        (polygon as any)._leaflet_id = polygonId;
        drawnItems.addLayer(polygon);
      } else {
        existingLayer.setLatLngs(polyData as L.LatLngExpression[]);
      }
    });
  }, [initialPolygons, map]);

  return null;
}
