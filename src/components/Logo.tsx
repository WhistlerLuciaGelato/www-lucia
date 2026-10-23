/* eslint-disable @next/next/no-img-element -- tiny static SVGs placed exactly as in the design */

/**
 * "Primary — simplified" logo (Whistler wordmark over LUCIA GELATO), assembled from the
 * three vector groups in the Figma file, at the same positions within a 250 × 96.77 frame.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative block aspect-[250/96.774] ${className}`}
      role="img"
      aria-label="Whistler Lucia Gelato"
    >
      <img
        src="/brand/logo/simplified-cone.svg"
        alt=""
        className="absolute"
        style={{
          top: "19.68%",
          right: "50.49%",
          bottom: "42.68%",
          left: "43.01%",
          width: "6.5%",
          height: "37.64%",
        }}
      />
      <img
        src="/brand/logo/simplified-wordmark.svg"
        alt=""
        className="absolute"
        style={{
          top: "22.2%",
          right: "7.77%",
          bottom: "41.95%",
          left: "7.78%",
          width: "84.45%",
          height: "35.85%",
        }}
      />
      <img
        src="/brand/logo/simplified-lucia-gelato.svg"
        alt=""
        className="absolute"
        style={{
          top: "69.12%",
          right: "27.49%",
          bottom: "19.84%",
          left: "29.73%",
          width: "42.78%",
          height: "11.04%",
        }}
      />
    </span>
  );
}
