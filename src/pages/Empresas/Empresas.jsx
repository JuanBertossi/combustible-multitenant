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
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from '../../components/common/DataTable/DataTable';
import { mockEmpresas } from '../../utils/mockData';
import { TIPOS_MERCADO } from '../../utils/constants';

export default function Empresas() {
  const [empresas, setEmpresas] = useState(mockEmpresas);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [deleteEmpresa, setDeleteEmpresa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    tipoMercado: 'Transporte',
    activo: true
  });
  const [errors, setErrors] = useState({});

  const filteredEmpresas = empresas.filter(e => {
    return e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           e.cuit.includes(searchTerm);
  });

  const handleNew = () => {
    setEditingEmpresa(null);
    setFormData({
      nombre: '',
      cuit: '',
      tipoMercado: 'Transporte',
      activo: true
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setFormData({ ...empresa });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.cuit.trim()) {
      newErrors.cuit = 'El CUIT es obligatorio';
    } else if (!/^\d{2}-\d{8}-\d{1}$/.test(formData.cuit)) {
      newErrors.cuit = 'Formato inválido (ej: 30-12345678-9)';
    }
    if (!formData.tipoMercado) newErrors.tipoMercado = 'El tipo de mercado es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingEmpresa) {
      setEmpresas(empresas.map(e => 
        e.id === editingEmpresa.id ? { ...formData, id: e.id } : e
      ));
    } else {
      const newEmpresa = {
        ...formData,
        id: Math.max(...empresas.map(e => e.id)) + 1
      };
      setEmpresas([...empresas, newEmpresa]);
    }

    setOpenDialog(false);
  };

  const handleDeleteClick = (empresa) => {
    setDeleteEmpresa(empresa);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    setEmpresas(empresas.filter(e => e.id !== deleteEmpresa.id));
    setOpenDeleteDialog(false);
    setDeleteEmpresa(null);
  };

  const columns = [
    { field: 'nombre', headerName: 'Nombre' },
    { field: 'cuit', headerName: 'CUIT' },
    { 
      field: 'tipoMercado', 
      headerName: 'Mercado',
      type: 'badge',
      getColor: (value) => value === 'Agro' ? 'success' : 'info'
    },
    { 
      field: 'activo', 
      headerName: 'Estado',
      type: 'boolean'
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Empresas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión de empresas clientes (Multi-tenant)
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por nombre o CUIT..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNew}
          sx={{ 
            bgcolor: '#1a1a2e',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#252540' }
          }}
        >
          Nueva Empresa
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={filteredEmpresas}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No hay empresas registradas"
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Empresa"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CUIT"
                placeholder="30-12345678-9"
                value={formData.cuit}
                onChange={(e) => setFormData({...formData, cuit: e.target.value})}
                error={!!errors.cuit}
                helperText={errors.cuit}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Tipo de Mercado"
                value={formData.tipoMercado}
                onChange={(e) => setFormData({...formData, tipoMercado: e.target.value})}
                error={!!errors.tipoMercado}
                helperText={errors.tipoMercado || "Define el tipo de operación de la empresa"}
                required
              >
                {TIPOS_MERCADO.map(tipo => (
                  <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingEmpresa ? 'Guardar Cambios' : 'Crear Empresa'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar la empresa <strong>{deleteEmpresa?.nombre}</strong>?
          </Typography>
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
