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

/**
 * The design's map pin (Figma "Lucia Website" › XX Working Zone › Find us › Frame 55): pale
 * pins for every spot, the selected spot's pin in the card pink.
 */
function pinElement(name: string) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "lucia-pin";
  el.setAttribute("aria-label", `Show ${name}`);
  el.innerHTML = `<img src="/find-us/pin.svg" alt="" width="32" height="46" /><img src="/find-us/pin-active.svg" alt="" width="32" height="46" data-on />`;
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
  const activeIdRef = useRef(activeId);
  const firstFly = useRef(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
    activeIdRef.current = activeId;
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
          // The map loads after the first render, so mark the already-selected spot here.
          el.toggleAttribute("data-active", s.id === activeIdRef.current);
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
    if (spot && map.current)
      map.current.flyTo({ center: [spot.lng, spot.lat], zoom: 14.5, essential: false });
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
