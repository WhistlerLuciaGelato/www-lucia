import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId: projectId || "unconfigured",
  dataset,
  apiVersion,
  // Responses are cached by Next.js and refreshed by the publish webhook, so read fresh data.
  useCdn: false,
  perspective: "published",
});
