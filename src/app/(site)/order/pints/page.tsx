import { permanentRedirect } from "next/navigation";

/** Pints are ordered on Our gelato now; old links land on its Order pints section. */
export default function PintsPage() {
  permanentRedirect("/our-gelato#order-pints");
}
