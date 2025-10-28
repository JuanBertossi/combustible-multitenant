import { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { mockEventos } from '../../utils/mockData';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { ESTADOS_EVENTO } from '../../utils/constants';

export default function ValidacionEventos() {
  const { user } = useAuth();
  const [eventos, setEventos] = useState(mockEventos);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [motivo, setMotivo] = useState('');

  const eventosPendientes = eventos.filter(e => {
    const isPendiente = e.estado === ESTADOS_EVENTO.PENDIENTE;
    const isEmpresa = user?.rol === 'SuperAdmin' || e.empresaId === user?.empresaId;
    return isPendiente && isEmpresa;
  });

  const handleValidate = (evento) => {
    setSelectedEvento(evento);
    setOpenValidateDialog(true);
  };

  const handleReject = (evento) => {
    setSelectedEvento(evento);
    setOpenRejectDialog(true);
  };

  const confirmValidate = () => {
    setEventos(eventos.map(e =>
      e.id === selectedEvento.id ? { ...e, estado: ESTADOS_EVENTO.VALIDADO } : e
    ));
    setOpenValidateDialog(false);
    setSelectedEvento(null);
  };

  const confirmReject = () => {
    if (!motivo.trim()) return;

    setEventos(eventos.map(e =>
      e.id === selectedEvento.id ? { ...e, estado: ESTADOS_EVENTO.RECHAZADO, motivoRechazo: motivo } : e
    ));
    setOpenRejectDialog(false);
    setSelectedEvento(null);
    setMotivo('');
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Validación de Eventos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Revisa y valida los eventos de combustible pendientes
        </Typography>
      </Box>

      {eventosPendientes.length === 0 ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ No hay eventos pendientes de validación
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{eventosPendientes.length}</strong> {eventosPendientes.length === 1 ? 'evento pendiente' : 'eventos pendientes'} de validación
        </Alert>
      )}

      <Grid container spacing={3}>
        {eventosPendientes.map((evento) => (
          <Grid item xs={12} md={6} lg={4} key={evento.id}>
            <Card 
              elevation={3}
              sx={{ 
                borderRadius: 2,
                borderLeft: '4px solid #f59e0b',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Evento #{evento.id}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {evento.vehiculo}
                    </Typography>
                  </Box>
                  <Chip 
                    icon={<PendingIcon />}
                    label="Pendiente" 
                    size="small"
                    color="warning"
                  />
                </Box>

                {user?.rol === 'SuperAdmin' && (
                  <Typography variant="body2" color="primary" fontWeight="600" sx={{ mb: 1 }}>
                    {evento.empresa}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Chofer: <strong>{evento.chofer}</strong>
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Fecha: {format(new Date(evento.fecha), 'dd/MM/yyyy HH:mm')}
                </Typography>

                <Box sx={{ mt: 2, mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Litros</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {evento.litros} L
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Costo</Typography>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        ${evento.costo.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {evento.kmInicial && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Recorrido: {evento.kmInicial} - {evento.kmFinal} km
                  </Typography>
                )}

                {evento.lote && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Lote: {evento.lote} | Labor: {evento.labor}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleValidate(evento)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Validar
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleReject(evento)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Rechazar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Validar */}
      <Dialog open={openValidateDialog} onClose={() => setOpenValidateDialog(false)}>
        <DialogTitle>Confirmar Validación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de validar el evento <strong>#{selectedEvento?.id}</strong> de <strong>{selectedEvento?.vehiculo}</strong>?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #86efac' }}>
            <Typography variant="body2">
              <strong>Litros:</strong> {selectedEvento?.litros} L<br />
              <strong>Costo:</strong> ${selectedEvento?.costo.toLocaleString()}<br />
              <strong>Chofer:</strong> {selectedEvento?.chofer}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenValidateDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={confirmValidate}>
            Confirmar Validación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Rechazar */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rechazar Evento</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Ingresa el motivo del rechazo del evento <strong>#{selectedEvento?.id}</strong>:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Motivo del Rechazo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Los kilómetros no coinciden, falta evidencia fotográfica, etc."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmReject}
            disabled={!motivo.trim()}
          >
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
