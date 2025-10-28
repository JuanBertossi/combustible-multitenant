import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mockEventos } from '../../utils/mockData';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { ESTADOS_EVENTO } from '../../utils/constants';
import * as XLSX from 'xlsx';

const estadosEvento = ['Todos', ESTADOS_EVENTO.PENDIENTE, ESTADOS_EVENTO.VALIDADO, ESTADOS_EVENTO.RECHAZADO];

export default function Eventos() {
  const { user } = useAuth();
  const [eventos] = useState(mockEventos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const eventosPorEmpresa = user?.rol === 'SuperAdmin'
    ? eventos
    : eventos.filter(e => e.empresaId === user?.empresaId);

  const filteredEventos = eventosPorEmpresa.filter(e => {
    const matchSearch = e.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.chofer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === 'Todos' || e.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  // ⭐ Función de exportación
  const handleExport = () => {
    const dataToExport = filteredEventos.map(e => ({
      'ID': e.id,
      ...(user?.rol === 'SuperAdmin' && { 'Empresa': e.empresa }),
      'Fecha': format(new Date(e.fecha), 'dd/MM/yyyy HH:mm'),
      'Vehículo': e.vehiculo,
      'Chofer': e.chofer,
      'Litros': e.litros,
      'Costo': e.costo,
      'Precio/L': (e.costo / e.litros).toFixed(2),
      'Estado': e.estado,
      ...(e.kmInicial && {
        'Km Inicial': e.kmInicial,
        'Km Final': e.kmFinal,
        'Recorrido': e.kmFinal - e.kmInicial
      }),
      ...(e.lote && {
        'Lote': e.lote,
        'Labor': e.labor
      })
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Eventos');
    XLSX.writeFile(wb, `Eventos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleView = (evento) => {
    setSelectedEvento(evento);
    setOpenDialog(true);
  };

  const getEstadoColor = (estado) => {
    const colors = {
      'Validado': { bg: '#10b98115', color: '#10b981' },
      'Pendiente': { bg: '#f59e0b15', color: '#f59e0b' },
      'Rechazado': { bg: '#ef444415', color: '#ef4444' }
    };
    return colors[estado] || { bg: '#99999915', color: '#999' };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Eventos de Combustible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Historial completo de cargas • {filteredEventos.length} {filteredEventos.length === 1 ? 'evento' : 'eventos'}
            </Typography>
          </Box>
        </Box>

        {/* Filtros */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          bgcolor: 'white',
          p: 2.5,
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}>
          <TextField
            placeholder="Buscar por vehículo o chofer..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#999' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            size="small"
            label="Estado"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {estadosEvento.map(estado => (
              <MenuItem key={estado} value={estado}>{estado}</MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredEventos.length === 0}
            sx={{
              borderColor: '#10b981',
              color: '#10b981',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#059669',
                bgcolor: '#10b98110'
              }
            }}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Timeline de eventos */}
      <Grid container spacing={3}>
        {filteredEventos.map((evento) => (
          <Grid item xs={12} key={evento.id}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  {/* Ícono */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: `${getEstadoColor(evento.estado).bg}`,
                      color: getEstadoColor(evento.estado).color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <LocalGasStationIcon sx={{ fontSize: 28 }} />
                  </Box>

                  {/* Contenido */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                          #{evento.id} • {evento.vehiculo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(evento.fecha), 'dd/MM/yyyy HH:mm')} • {evento.chofer}
                        </Typography>
                      </Box>
                      <Chip
                        label={evento.estado}
                        size="small"
                        sx={{
                          bgcolor: getEstadoColor(evento.estado).bg,
                          color: getEstadoColor(evento.estado).color,
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    {/* Métricas */}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Litros Cargados
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          {evento.litros} L
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Costo Total
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          ${evento.costo.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Precio/Litro
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          ${(evento.costo / evento.litros).toFixed(2)}
                        </Typography>
                      </Grid>
                      {evento.kmInicial && (
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Recorrido
                          </Typography>
                          <Typography variant="h6" fontWeight="700">
                            {evento.kmFinal - evento.kmInicial} km
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Acciones */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleView(evento)}
                        sx={{
                          borderColor: '#e0e0e0',
                          color: '#1E2C56',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#1E2C56',
                            bgcolor: '#1E2C5610'
                          }
                        }}
                      >
                        Ver Detalle
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredEventos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LocalGasStationIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay eventos registrados
          </Typography>
        </Box>
      )}

      {/* Dialog de detalle */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalle del Evento #{selectedEvento?.id}</DialogTitle>
        <DialogContent>
          {selectedEvento && (
            <Grid container spacing={3} sx={{ pt: 2 }}>
              {user?.rol === 'SuperAdmin' && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Empresa</Typography>
                  <Typography variant="body1" fontWeight="600">{selectedEvento.empresa}</Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Fecha</Typography>
                <Typography variant="body1" fontWeight="600">
                  {format(new Date(selectedEvento.fecha), 'dd/MM/yyyy HH:mm')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Estado</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedEvento.estado}
                    size="small"
                    sx={{
                      bgcolor: getEstadoColor(selectedEvento.estado).bg,
                      color: getEstadoColor(selectedEvento.estado).color,
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Vehículo</Typography>
                <Typography variant="body1" fontWeight="600">{selectedEvento.vehiculo}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Chofer</Typography>
                <Typography variant="body1" fontWeight="600">{selectedEvento.chofer}</Typography>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Litros Cargados</Typography>
                <Typography variant="body1" fontWeight="600">{selectedEvento.litros} L</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Costo Total</Typography>
                <Typography variant="body1" fontWeight="600">${selectedEvento.costo.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Precio por Litro</Typography>
                <Typography variant="body1" fontWeight="600">
                  ${(selectedEvento.costo / selectedEvento.litros).toFixed(2)}
                </Typography>
              </Grid>

              {selectedEvento.kmInicial && (
                <>
                  <Grid item xs={12}><Divider><Typography variant="caption">Datos de Transporte</Typography></Divider></Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Km Inicial</Typography>
                    <Typography variant="body1" fontWeight="600">{selectedEvento.kmInicial} km</Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Km Final</Typography>
                    <Typography variant="body1" fontWeight="600">{selectedEvento.kmFinal} km</Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">Recorrido</Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedEvento.kmFinal - selectedEvento.kmInicial} km
                    </Typography>
                  </Grid>

                  {selectedEvento.ruta && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Ruta</Typography>
                      <Typography variant="body1" fontWeight="600">{selectedEvento.ruta}</Typography>
                    </Grid>
                  )}
                </>
              )}

              {selectedEvento.lote && (
                <>
                  <Grid item xs={12}><Divider><Typography variant="caption">Datos Agrícolas</Typography></Divider></Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Lote</Typography>
                    <Typography variant="body1" fontWeight="600">{selectedEvento.lote}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Labor</Typography>
                    <Typography variant="body1" fontWeight="600">{selectedEvento.labor}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
