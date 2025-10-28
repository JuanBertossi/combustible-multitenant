import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Typography,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAuth } from '../../hooks/useAuth';
import * as XLSX from 'xlsx';

const TIPOS_COMBUSTIBLE = ['Diésel', 'Nafta', 'GNC', 'GLP'];

// Mock data
const mockTanques = [
  {
    id: 1,
    codigo: 'TNQ-001',
    nombre: 'Tanque Principal Diésel',
    ubicacion: 'Estación Central',
    tipoCombustible: 'Diésel',
    capacidadMaxima: 10000,
    nivelActual: 7500,
    empresaId: 1,
    empresa: 'AgroTransporte SA',
    activo: true
  },
  {
    id: 2,
    codigo: 'TNQ-002',
    nombre: 'Tanque Campo Norte',
    ubicacion: 'Lote 45',
    tipoCombustible: 'Diésel',
    capacidadMaxima: 5000,
    nivelActual: 1200,
    empresaId: 1,
    empresa: 'AgroTransporte SA',
    activo: true
  },
  {
    id: 3,
    codigo: 'TNQ-003',
    nombre: 'Tanque Nafta Premium',
    ubicacion: 'Planta Industrial',
    tipoCombustible: 'Nafta',
    capacidadMaxima: 8000,
    nivelActual: 6800,
    empresaId: 2,
    empresa: 'Transportes del Sur',
    activo: true
  },
];

export default function Tanques() {
  const { user } = useAuth();
  const [tanques, setTanques] = useState(mockTanques);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingTanque, setEditingTanque] = useState(null);
  const [deleteTanque, setDeleteTanque] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    ubicacion: '',
    tipoCombustible: 'Diésel',
    capacidadMaxima: '',
    nivelActual: '',
    activo: true
  });
  const [errors, setErrors] = useState({});

  const tanquesPorEmpresa = user?.rol === 'SuperAdmin'
    ? tanques
    : tanques.filter(t => t.empresaId === user?.empresaId);

  const filteredTanques = tanquesPorEmpresa.filter(t => {
    const matchSearch = t.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'Todos' || t.tipoCombustible === filterTipo;
    return matchSearch && matchTipo;
  });

  // ⭐ Función de exportación
  const handleExport = () => {
    const dataToExport = filteredTanques.map(t => {
      const percentage = ((t.nivelActual / t.capacidadMaxima) * 100).toFixed(1);
      return {
        'Código': t.codigo,
        'Nombre': t.nombre,
        'Ubicación': t.ubicacion,
        'Tipo Combustible': t.tipoCombustible,
        'Capacidad Máxima (L)': t.capacidadMaxima,
        'Nivel Actual (L)': t.nivelActual,
        'Nivel (%)': percentage,
        'Disponible (L)': t.capacidadMaxima - t.nivelActual,
        'Estado': t.activo ? 'Activo' : 'Inactivo',
        ...(user?.rol === 'SuperAdmin' && { 'Empresa': t.empresa })
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tanques');
    XLSX.writeFile(wb, `Tanques_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleNew = () => {
    setEditingTanque(null);
    setFormData({
      codigo: '',
      nombre: '',
      ubicacion: '',
      tipoCombustible: 'Diésel',
      capacidadMaxima: '',
      nivelActual: '',
      activo: true
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (tanque) => {
    setEditingTanque(tanque);
    setFormData({ ...tanque });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = 'El código es obligatorio';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es obligatoria';
    if (!formData.tipoCombustible) newErrors.tipoCombustible = 'El tipo es obligatorio';
    if (!formData.capacidadMaxima || formData.capacidadMaxima <= 0) {
      newErrors.capacidadMaxima = 'La capacidad debe ser mayor a 0';
    }
    if (formData.nivelActual < 0) {
      newErrors.nivelActual = 'El nivel no puede ser negativo';
    }
    if (formData.nivelActual > formData.capacidadMaxima) {
      newErrors.nivelActual = 'El nivel no puede superar la capacidad';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingTanque) {
      setTanques(tanques.map(t =>
        t.id === editingTanque.id ? { ...formData, id: t.id } : t
      ));
    } else {
      const newTanque = {
        ...formData,
        id: Math.max(...tanques.map(t => t.id), 0) + 1,
        empresaId: user?.empresaId,
        empresa: user?.empresa
      };
      setTanques([...tanques, newTanque]);
    }
    setOpenDialog(false);
  };

  const handleDeleteClick = (tanque) => {
    setDeleteTanque(tanque);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    setTanques(tanques.filter(t => t.id !== deleteTanque.id));
    setOpenDeleteDialog(false);
    setDeleteTanque(null);
  };

  const getColorByTipo = (tipo) => {
    const colors = {
      'Diésel': '#10b981',
      'Nafta': '#3b82f6',
      'GNC': '#f59e0b',
      'GLP': '#8b5cf6'
    };
    return colors[tipo] || '#667eea';
  };

  const getNivelPercentage = (tanque) => {
    return (tanque.nivelActual / tanque.capacidadMaxima) * 100;
  };

  const getNivelColor = (percentage) => {
    if (percentage > 50) return 'success';
    if (percentage > 25) return 'warning';
    return 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Tanques de Combustible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de tanques y stock • {filteredTanques.length} {filteredTanques.length === 1 ? 'tanque' : 'tanques'}
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
            placeholder="Buscar por código, nombre o ubicación..."
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
            label="Tipo"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="Todos">Todos los tipos</MenuItem>
            {TIPOS_COMBUSTIBLE.map(tipo => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredTanques.length === 0}
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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            sx={{
              bgcolor: '#1E2C56',
              fontWeight: 600,
              '&:hover': { bgcolor: '#16213E' }
            }}
          >
            Nuevo Tanque
          </Button>
        </Box>
      </Box>

      {/* Grid de tanques */}
      <Grid container spacing={3}>
        {filteredTanques.map((tanque) => {
          const percentage = getNivelPercentage(tanque);
          const nivelColor = getNivelColor(percentage);

          return (
            <Grid item xs={12} sm={6} md={4} key={tanque.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: `${getColorByTipo(tanque.tipoCombustible)}15`,
                        color: getColorByTipo(tanque.tipoCombustible),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PropaneTankIcon sx={{ fontSize: 28 }} />
                    </Box>

                    <Chip
                      label={tanque.tipoCombustible}
                      size="small"
                      sx={{
                        bgcolor: `${getColorByTipo(tanque.tipoCombustible)}15`,
                        color: getColorByTipo(tanque.tipoCombustible),
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  {/* Info */}
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                    {tanque.codigo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {tanque.nombre}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: '#999' }} />
                    <Typography variant="caption" color="text.secondary">
                      {tanque.ubicacion}
                    </Typography>
                  </Box>

                  {/* Indicador de nivel */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Nivel actual
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {percentage < 25 && <WarningIcon sx={{ fontSize: 16, color: '#f59e0b' }} />}
                        <Typography variant="caption" fontWeight="600">
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      color={nivelColor}
                      sx={{ height: 8, borderRadius: 1, mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {tanque.nivelActual.toLocaleString()} / {tanque.capacidadMaxima.toLocaleString()} L
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Capacidad
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {tanque.capacidadMaxima.toLocaleString()} L
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Estado
                      </Typography>
                      <Chip
                        label={tanque.activo ? 'Activo' : 'Inactivo'}
                        size="small"
                        sx={{
                          bgcolor: tanque.activo ? '#10b98115' : '#99999915',
                          color: tanque.activo ? '#10b981' : '#999',
                          fontWeight: 600,
                          height: 20,
                          fontSize: 11
                        }}
                      />
                    </Box>
                  </Box>

                  {user?.rol === 'SuperAdmin' && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Empresa: {tanque.empresa}
                    </Typography>
                  )}

                  {/* Acciones */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(tanque)}
                      sx={{ bgcolor: '#f3f4f6', '&:hover': { bgcolor: '#e5e7eb' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(tanque)}
                      sx={{ bgcolor: '#fee2e2', color: '#dc2626', '&:hover': { bgcolor: '#fecaca' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredTanques.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PropaneTankIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay tanques registrados
          </Typography>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTanque ? 'Editar Tanque' : 'Nuevo Tanque'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Código"
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
              error={!!errors.codigo}
              helperText={errors.codigo}
              required
              placeholder="TNQ-001"
              fullWidth
            />
            <TextField
              select
              label="Tipo de Combustible"
              value={formData.tipoCombustible}
              onChange={(e) => setFormData({...formData, tipoCombustible: e.target.value})}
              error={!!errors.tipoCombustible}
              helperText={errors.tipoCombustible}
              required
              fullWidth
            >
              {TIPOS_COMBUSTIBLE.map(tipo => (
                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
              placeholder="Tanque Principal Diésel"
              fullWidth
            />
            <TextField
              label="Ubicación"
              value={formData.ubicacion}
              onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
              error={!!errors.ubicacion}
              helperText={errors.ubicacion}
              required
              placeholder="Estación Central, Lote 45, etc."
              fullWidth
            />
            <TextField
              label="Capacidad Máxima (litros)"
              type="number"
              value={formData.capacidadMaxima}
              onChange={(e) => setFormData({...formData, capacidadMaxima: parseInt(e.target.value) || ''})}
              error={!!errors.capacidadMaxima}
              helperText={errors.capacidadMaxima}
              required
              fullWidth
            />
            <TextField
              label="Nivel Actual (litros)"
              type="number"
              value={formData.nivelActual}
              onChange={(e) => setFormData({...formData, nivelActual: parseInt(e.target.value) || ''})}
              error={!!errors.nivelActual}
              helperText={errors.nivelActual}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingTanque ? 'Guardar Cambios' : 'Crear Tanque'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el tanque {deleteTanque?.codigo} - {deleteTanque?.nombre}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
