"use client";

/** Fired on `window` with the package id; the booking form selects that package. */
export const CHOOSE_PACKAGE_EVENT = "lucia:choose-package";

/** A link to the booking form that also preselects a package in it. */
export function RequestPackageLink({
  packageId,
  className = "",
  children,
}: {
  packageId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#book"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(CHOOSE_PACKAGE_EVENT, { detail: packageId }))}
    >
      {children}
    </a>
  );
}
