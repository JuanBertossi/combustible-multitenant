declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

// types.d.ts or vite-env.d.ts
declare module "@google-maps/map" {
  import React from "react";
  import { Map as GoogleMapBase } from "@vis.gl/react-google-maps";
  
  export const Map: React.FC<React.ComponentProps<typeof GoogleMapBase>>;
}
