import "@mui/material";

declare module "@mui/material/Grid" {
  interface GridPropsVariantOverrides {
    item?: boolean;
    xs?: boolean | number;
    sm?: boolean | number;
    md?: boolean | number;
    lg?: boolean | number;
    xl?: boolean | number;
  }
}
