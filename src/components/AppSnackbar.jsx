import React, { useState } from "react";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function AppSnackbar({ message }) {
  const [open, SetOpen] = useState(true);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={3000}
      message={<span id="message-id">{message}</span>}
      ContentProps={{ "aria-describedby": "message-id" }}
      onClose={() => SetOpen(false)}
      action={[
        <IconButton onClick={() => SetOpen(false)} color="inherit" key="close" aria-label="close">
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );
}

export default AppSnackbar;
