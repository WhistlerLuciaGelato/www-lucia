import Link from "next/link";
import { getSiteSettings } from "@/lib/content";

/** Optional site-wide message the client switches on in the Studio ("Closed today — too windy!"). */
export async function AnnouncementBar() {
  const { announcement } = await getSiteSettings();
  if (!announcement) return null;
  const { message, tone, linkLabel, linkUrl } = announcement;
  const external = linkUrl?.startsWith("http");

  return (
    <div
      role="status"
      className={`px-4 py-2.5 text-center font-ui text-sm font-bold ${
        tone === "alert" ? "bg-strawberry text-[#3d1416]" : "bg-lake-deep text-snow"
      }`}
    >
      {message}
      {linkUrl && linkLabel ? (
        <>
          {" "}
          {external ? (
            <a href={linkUrl} className="underline underline-offset-2" target="_blank" rel="noreferrer">
              {linkLabel}
            </a>
          ) : (
            <Link href={linkUrl} className="underline underline-offset-2">
              {linkLabel}
            </Link>
          )}
        </>
      ) : null}
    </div>
  );
}
