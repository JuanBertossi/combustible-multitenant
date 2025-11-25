import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const SkeletonLoading = ({
  variant = "rectangular",
  height = 120,
  width = "100%",
  count = 1,
}) => (
  <Box>
    {[...Array(count)].map((_, i) => (
      <Skeleton
        key={i}
        variant={variant}
        height={height}
        width={width}
        animation="wave"
        sx={{ mb: 2, borderRadius: 2 }}
      />
    ))}
  </Box>
);

export default SkeletonLoading;
