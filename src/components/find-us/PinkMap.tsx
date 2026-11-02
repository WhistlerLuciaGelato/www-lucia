"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { LayerSpecification, Map as MapLibreMap, Marker, StyleSpecification } from "maplibre-gl";
import type { Location } from "@/lib/content-types";

/** Free OpenStreetMap vector tiles, no API key. Recoloured to the design's pinks on load. */
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

const PINK = {
  land: "#ffcfc8", // the design's mid pink (map placeholder)
  park: "#ffc5bd",
  water: "#fff3f0",
  road: "#ffe8e4",
  casing: "#ffb9b0",
  label: "#d96b75",
  halo: "#ffcfc8",
};
/** The darkest pink in the location cards (borders, titles). */
const MARKER = "#ff8f8f";

const HIDDEN_LAYERS = /^(boundary|label_country|label_state|airport|road_shield|highway-shield)/;

function pinkify(style: StyleSpecification): StyleSpecification {
  const layers = style.layers
    .filter((layer) => !HIDDEN_LAYERS.test(layer.id))
    .map((layer): LayerSpecification => {
      const id = layer.id;
      const isWater = id.includes("water");
      switch (layer.type) {
        case "background":
          return { ...layer, paint: { ...layer.paint, "background-color": PINK.land } };
        case "fill": {
          const color =
            isWater || /glacier|ice/.test(id) ? PINK.water : id === "building" ? PINK.casing : PINK.park;
          const paint: Record<string, unknown> = { ...layer.paint, "fill-color": color };
          delete paint["fill-outline-color"];
          if (id === "building") paint["fill-opacity"] = 0.35;
          return { ...layer, paint } as LayerSpecification;
        }
        case "line": {
          const color = isWater ? PINK.water : /casing|rail/.test(id) ? PINK.casing : PINK.road;
          return { ...layer, paint: { ...layer.paint, "line-color": color } } as LayerSpecification;
        }
        case "symbol":
          return {
            ...layer,
            paint: {
              ...layer.paint,
              "text-color": isWater ? MARKER : PINK.label,
              "text-halo-color": PINK.halo,
            },
          } as LayerSpecification;
        default:
          return layer;
      }
    });
  return { ...style, layers };
}

/** The design's location pin (Figma: Location_pin_icon). */
function pinElement(name: string) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "lucia-pin";
  el.setAttribute("aria-label", `Show ${name}`);
  el.innerHTML = `<svg viewBox="0 0 159.003 199.998" aria-hidden="true"><path fill="${MARKER}" d="M79.5013 151.68C35.5939 151.68 2.23313e-07 162.497 2.23313e-07 175.839C2.23313e-07 189.182 35.5939 199.998 79.5013 199.998C123.409 199.998 159.003 189.182 159.003 175.839C159.003 162.496 123.409 151.68 79.5013 151.68ZM119.265 182.752C108.686 185.967 94.5649 187.738 79.5013 187.738C64.4382 187.738 50.3167 185.967 39.7372 182.752C28.8842 179.454 25.0329 175.583 25.0329 173.271C25.0329 170.958 28.8842 167.088 39.7372 163.79C50.3167 160.575 64.4382 158.805 79.5013 158.805H79.5073C94.5676 158.805 108.688 160.575 119.267 163.79C130.119 167.088 133.969 170.958 133.969 173.271C133.969 175.583 130.118 179.454 119.265 182.752Z"/><path fill="${MARKER}" d="M79.7491 0.000213623C45.531 0.000213623 17.79 27.6806 17.79 61.8282C17.79 67.6962 18.6275 73.3654 20.1588 78.744C21.1004 82.0553 22.1317 85.3446 23.758 88.3173C36.464 111.53 79.7491 178.156 79.7491 178.156C79.7491 178.156 123.036 111.528 135.742 88.3159C137.367 85.3433 138.397 82.0547 139.341 78.744C140.87 73.3654 141.708 67.6962 141.708 61.8282C141.708 27.6806 113.969 0.000213623 79.7491 0.000213623ZM79.7491 89.0519C71.1083 89.0519 63.3979 85.0186 58.3955 78.744C54.689 74.0948 52.4667 68.2168 52.4667 61.8282C52.4667 46.8157 64.705 34.6039 79.7491 34.6039C94.7933 34.6039 107.03 46.8157 107.03 61.8282C107.03 68.2168 104.808 74.0948 101.103 78.744C96.1 85.0186 88.3898 89.0519 79.7491 89.0519Z"/></svg>`;
  return el;
}

/**
 * Interactive map of the seasonal spots in the design's pinks. Clicking a pin selects that
 * spot; selecting a spot elsewhere flies the map to it.
 */
export function PinkMap({
  spots,
  activeId,
  onSelect,
}: {
  spots: Location[];
  activeId?: string;
  onSelect: (id: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const pins = useRef(new Map<string, { marker: Marker; el: HTMLButtonElement }>());
  const onSelectRef = useRef(onSelect);
  const firstFly = useRef(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    let cancelled = false;
    const markers = pins.current;
    (async () => {
      try {
        const [maplibre, style] = await Promise.all([
          import("maplibre-gl"),
          fetch(STYLE_URL).then((r) => r.json() as Promise<StyleSpecification>),
        ]);
        if (cancelled || !container.current) return;
        maplibre.setWorkerUrl("/vendor/maplibre-gl-worker.mjs");

        const bounds = new maplibre.LngLatBounds();
        for (const s of spots) bounds.extend([s.lng, s.lat]);

        const m = new maplibre.Map({
          container: container.current,
          style: pinkify(style),
          bounds,
          fitBoundsOptions: { padding: 70, maxZoom: 14 },
          cooperativeGestures: true,
          attributionControl: { compact: true },
          dragRotate: false,
          pitchWithRotate: false,
        });
        m.touchZoomRotate.disableRotation();
        m.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
        map.current = m;

        for (const s of spots) {
          const el = pinElement(s.name);
          el.addEventListener("click", () => onSelectRef.current(s.id));
          const marker = new maplibre.Marker({ element: el, anchor: "bottom" })
            .setLngLat([s.lng, s.lat])
            .addTo(m);
          markers.set(s.id, { marker, el });
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      markers.clear();
      map.current?.remove();
      map.current = null;
    };
  }, [spots]);

  useEffect(() => {
    for (const [id, { el }] of pins.current) el.toggleAttribute("data-active", id === activeId);
    const spot = spots.find((s) => s.id === activeId);
    // Leave the opening view showing every spot; fly once someone picks one.
    if (firstFly.current) {
      firstFly.current = false;
      return;
    }
    const m = map.current;
    if (!m) return;
    if (spot) {
      m.flyTo({ center: [spot.lng, spot.lat], zoom: 14.5, essential: false });
    } else if (spots.length) {
      // No spot picked ("See all on map"): zoom back out to show every pin.
      const lngs = spots.map((s) => s.lng);
      const lats = spots.map((s) => s.lat);
      m.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 70, maxZoom: 14 },
      );
    }
  }, [activeId, spots]);

  return (
    <div className="relative h-[22rem] overflow-hidden rounded-[1.25rem] border-2 border-[#f48991] bg-[#ffcfc8] sm:h-[28rem] lg:h-[40.625rem]">
      <div ref={container} className="h-full w-full" />
      {failed ? (
        <p className="absolute inset-0 grid place-items-center p-8 text-center font-ui font-semibold text-berry">
          The map couldn’t load here. Use “Show in Google Maps” on any spot to find it.
        </p>
      ) : null}
    </div>
  );
}
