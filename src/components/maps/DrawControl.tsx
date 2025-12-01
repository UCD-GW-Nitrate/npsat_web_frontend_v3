import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function DrawControl({ onCreated, onEdited, onDeleted }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Create a FeatureGroup to store drawn layers
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const pane = drawnItems.getPane();
    if (pane) {
      pane.style.zIndex = '1000';
    }

    // Create the draw control
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

    // Handle events
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

  return null;
}
