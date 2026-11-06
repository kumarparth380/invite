import { preload } from "react-dom";
import { DOOR_SRCSET, TEMPLE_SRCSET } from "@/components/art/Photos";
import { Invitation } from "@/components/Invitation";

export default function Home() {
  // The doors and the temple are the first things a guest sees.
  preload("/images/door-leaf-1800.webp", {
    as: "image",
    imageSrcSet: DOOR_SRCSET,
    imageSizes: "(max-width: 480px) 50vw, 240px",
    fetchPriority: "high",
  });
  preload("/images/temple-1080.webp", {
    as: "image",
    imageSrcSet: TEMPLE_SRCSET,
    imageSizes: "(max-width: 480px) 100vw, 480px",
    fetchPriority: "high",
  });
  return <Invitation />;
}
