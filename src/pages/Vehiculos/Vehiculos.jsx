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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mockVehiculos } from '../../utils/mockData';
import { useAuth } from '../../hooks/useAuth';
import { TIPOS_VEHICULO } from '../../utils/constants';
import * as XLSX from 'xlsx';

export default function Vehiculos() {
  const { user } = useAuth();
  const [vehiculos, setVehiculos] = useState(mockVehiculos);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const [deleteVehiculo, setDeleteVehiculo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [formData, setFormData] = useState({
    patente: '',
    tipo: 'Camión',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    capacidad: '',
    activo: true
  });
  const [errors, setErrors] = useState({});

  const vehiculosPorEmpresa = user?.rol === 'SuperAdmin'
    ? vehiculos
    : vehiculos.filter(v => v.empresaId === user?.empresaId);

  const filteredVehiculos = vehiculosPorEmpresa.filter(v => {
    const matchSearch = v.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'Todos' || v.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  // ⭐ Nueva función de exportación
  const handleExport = () => {
    const dataToExport = filteredVehiculos.map(v => ({
      'Patente': v.patente,
      'Tipo': v.tipo,
      'Marca': v.marca,
      'Modelo': v.modelo,
      'Año': v.anio,
      'Capacidad (L)': v.capacidad,
      'Estado': v.activo ? 'Activo' : 'Inactivo',
      ...(user?.rol === 'SuperAdmin' && { 'Empresa': v.empresa })
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehículos');
    XLSX.writeFile(wb, `Vehiculos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleNew = () => {
    setEditingVehiculo(null);
    setFormData({
      patente: '',
      tipo: 'Camión',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      capacidad: '',
      activo: true
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (vehiculo) => {
    setEditingVehiculo(vehiculo);
    setFormData({ ...vehiculo });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patente.trim()) newErrors.patente = 'La patente es obligatoria';
    if (!formData.tipo) newErrors.tipo = 'El tipo es obligatorio';
    if (!formData.marca.trim()) newErrors.marca = 'La marca es obligatoria';
    if (!formData.modelo.trim()) newErrors.modelo = 'El modelo es obligatorio';
    if (!formData.anio) {
      newErrors.anio = 'El año es obligatorio';
    } else if (formData.anio < 1900 || formData.anio > new Date().getFullYear() + 1) {
      newErrors.anio = 'Año inválido';
    }
    if (!formData.capacidad) {
      newErrors.capacidad = 'La capacidad es obligatoria';
    } else if (formData.capacidad <= 0) {
      newErrors.capacidad = 'La capacidad debe ser mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingVehiculo) {
      setVehiculos(vehiculos.map(v =>
        v.id === editingVehiculo.id ? { ...formData, id: v.id } : v
      ));
    } else {
      const newVehiculo = {
        ...formData,
        id: Math.max(...vehiculos.map(v => v.id)) + 1,
        empresaId: user?.empresaId,
        empresa: user?.empresa
      };
      setVehiculos([...vehiculos, newVehiculo]);
    }
    setOpenDialog(false);
  };

  const handleDeleteClick = (vehiculo) => {
    setDeleteVehiculo(vehiculo);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    setVehiculos(vehiculos.filter(v => v.id !== deleteVehiculo.id));
    setOpenDeleteDialog(false);
    setDeleteVehiculo(null);
  };

  const getColorByTipo = (tipo) => {
    const colors = {
      'Camión': '#3b82f6',
      'Tractor': '#10b981',
      'Sembradora': '#f59e0b',
      'Cosechadora': '#8b5cf6',
      'Pulverizadora': '#ec4899',
      'Pick-up': '#06b6d4',
      'Generador': '#ef4444'
    };
    return colors[tipo] || '#667eea';
  };

  return (
    <Box>
      {/* Header mejorado */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Vehículos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de vehículos y maquinaria • {filteredVehiculos.length} {filteredVehiculos.length === 1 ? 'vehículo' : 'vehículos'}
            </Typography>
          </Box>
        </Box>

        {/* Filtros y acciones mejorados */}
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
            placeholder="Buscar por patente, marca o modelo..."
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
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="Todos">Todos los tipos</MenuItem>
            {TIPOS_VEHICULO.map(tipo => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </TextField>

          {/* ⭐ Botón Exportar */}
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredVehiculos.length === 0}
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
            Nuevo Vehículo
          </Button>
        </Box>
      </Box>

      {/* Grid de vehículos */}
      <Grid container spacing={3}>
        {filteredVehiculos.map((vehiculo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={vehiculo.id}>
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
                  borderColor: getColorByTipo(vehiculo.tipo)
                }
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Header de card */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${getColorByTipo(vehiculo.tipo)}15`,
                      color: getColorByTipo(vehiculo.tipo),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DirectionsCarIcon sx={{ fontSize: 28 }} />
                  </Box>
                  
                  <Chip
                    label={vehiculo.tipo}
                    size="small"
                    sx={{
                      bgcolor: `${getColorByTipo(vehiculo.tipo)}15`,
                      color: getColorByTipo(vehiculo.tipo),
                      fontWeight: 600,
                      border: 'none'
                    }}
                  />
                </Box>

                {/* Contenido */}
                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                  {vehiculo.patente}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {vehiculo.marca} {vehiculo.modelo}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Año
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {vehiculo.anio}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Capacidad
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {vehiculo.capacidad} L
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label={vehiculo.activo ? 'Activo' : 'Inactivo'}
                  size="small"
                  sx={{
                    bgcolor: vehiculo.activo ? '#10b98115' : '#99999915',
                    color: vehiculo.activo ? '#10b981' : '#999',
                    fontWeight: 600,
                    mb: 1
                  }}
                />

                {user?.rol === 'SuperAdmin' && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Empresa: {vehiculo.empresa}
                  </Typography>
                )}

                {/* Acciones */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(vehiculo)}
                    sx={{
                      bgcolor: '#f3f4f6',
                      '&:hover': { bgcolor: '#e5e7eb' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(vehiculo)}
                    sx={{
                      bgcolor: '#fee2e2',
                      color: '#dc2626',
                      '&:hover': { bgcolor: '#fecaca' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredVehiculos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DirectionsCarIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay vehículos registrados
          </Typography>
        </Box>
      )}

      {/* Dialogs (sin cambios) */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Patente"
              value={formData.patente}
              onChange={(e) => setFormData({...formData, patente: e.target.value.toUpperCase()})}
              error={!!errors.patente}
              helperText={errors.patente}
              required
              fullWidth
            />
            <TextField
              select
              label="Tipo"
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              error={!!errors.tipo}
              helperText={errors.tipo}
              required
              fullWidth
            >
              {TIPOS_VEHICULO.map(tipo => (
                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Marca"
              value={formData.marca}
              onChange={(e) => setFormData({...formData, marca: e.target.value})}
              error={!!errors.marca}
              helperText={errors.marca}
              required
              fullWidth
            />
            <TextField
              label="Modelo"
              value={formData.modelo}
              onChange={(e) => setFormData({...formData, modelo: e.target.value})}
              error={!!errors.modelo}
              helperText={errors.modelo}
              required
              fullWidth
            />
            <TextField
              label="Año"
              type="number"
              value={formData.anio}
              onChange={(e) => setFormData({...formData, anio: parseInt(e.target.value)})}
              error={!!errors.anio}
              helperText={errors.anio}
              required
              fullWidth
            />
            <TextField
              label="Capacidad (litros)"
              type="number"
              value={formData.capacidad}
              onChange={(e) => setFormData({...formData, capacidad: parseInt(e.target.value)})}
              error={!!errors.capacidad}
              helperText={errors.capacidad}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingVehiculo ? 'Guardar Cambios' : 'Crear Vehículo'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el vehículo {deleteVehiculo?.patente}?
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
