import { Studio } from "./Studio";

// The whole Studio is a client-side app; every /studio/* URL serves the same shell.
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <Studio />;
}
