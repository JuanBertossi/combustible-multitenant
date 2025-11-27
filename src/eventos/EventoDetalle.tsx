import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const EventoDetalle = ({
  open,
  onClose,
  evento,
  evidencias,
  onValidate,
  onReject,
}: any) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Detalle del Evento #{evento?.id}</DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        Evidencias: {evidencias?.length ?? 0}
      </Typography>
      {/* Aquí puedes renderizar más detalles del evento y evidencias */}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => onValidate(evento)}
        color="success"
        variant="contained"
      >
        Validar
      </Button>
      <Button onClick={() => onReject(evento)} color="error" variant="outlined">
        Rechazar
      </Button>
      <Button onClick={onClose}>Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default EventoDetalle;
