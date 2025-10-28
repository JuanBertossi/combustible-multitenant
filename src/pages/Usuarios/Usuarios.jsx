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
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mockUsuarios } from '../../utils/mockData';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import * as XLSX from 'xlsx';

const roles = [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.OPERADOR];

export default function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [deleteUsuario, setDeleteUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('Todos');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    whatsapp: '',
    rol: 'Operador',
    activo: true
  });
  const [errors, setErrors] = useState({});

  const usuariosPorEmpresa = user?.rol === 'SuperAdmin' 
    ? usuarios
    : usuarios.filter(u => u.empresaId === user?.empresaId);

  const filteredUsuarios = usuariosPorEmpresa.filter(u => {
    const matchSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRol = filterRol === 'Todos' || u.rol === filterRol;
    return matchSearch && matchRol;
  });

  const handleExport = () => {
    const dataToExport = filteredUsuarios.map(u => ({
      'Nombre': u.nombre,
      'Apellido': u.apellido,
      'Email': u.email,
      'WhatsApp': u.whatsapp || 'Sin WhatsApp',
      'Rol': u.rol,
      'Estado': u.activo ? 'Activo' : 'Inactivo',
      ...(user?.rol === 'SuperAdmin' && { 'Empresa': u.empresa })
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, `Usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleNew = () => {
    setEditingUsuario(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      whatsapp: '',
      rol: 'Operador',
      activo: true
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({ ...usuario });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    // WhatsApp es OPCIONAL para usuarios
    if (formData.whatsapp && !/^\+?\d{10,15}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'Formato inválido (ej: +5493512345678)';
    }
    if (!formData.rol) newErrors.rol = 'El rol es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingUsuario) {
      setUsuarios(usuarios.map(u => 
        u.id === editingUsuario.id ? { ...formData, id: u.id, empresaId: u.empresaId, empresa: u.empresa } : u
      ));
    } else {
      const newUsuario = {
        ...formData,
        id: Math.max(...usuarios.map(u => u.id), 0) + 1,
        empresaId: user?.empresaId,
        empresa: user?.empresa
      };
      setUsuarios([...usuarios, newUsuario]);
    }

    setOpenDialog(false);
  };

  const handleDeleteClick = (usuario) => {
    setDeleteUsuario(usuario);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    setUsuarios(usuarios.filter(u => u.id !== deleteUsuario.id));
    setOpenDeleteDialog(false);
    setDeleteUsuario(null);
  };

  const getInitials = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (nombre) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const index = nombre.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getRolColor = (rol) => {
    const colors = {
      'Admin': { bg: '#ef444415', color: '#ef4444' },
      'Supervisor': { bg: '#f59e0b15', color: '#f59e0b' },
      'Operador': { bg: '#3b82f615', color: '#3b82f6' }
    };
    return colors[rol] || { bg: '#99999915', color: '#999' };
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Usuarios del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de accesos al frontoffice web • {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'usuario' : 'usuarios'}
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
            placeholder="Buscar por nombre, apellido o email..."
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
            label="Rol"
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="Todos">Todos los roles</MenuItem>
            {roles.map(rol => (
              <MenuItem key={rol} value={rol}>{rol}</MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredUsuarios.length === 0}
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
            Nuevo Usuario
          </Button>
        </Box>
      </Box>

      {/* Grid de usuarios */}
      <Grid container spacing={3}>
        {filteredUsuarios.map((usuario) => (
          <Grid item xs={12} sm={6} md={4} key={usuario.id}>
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
                {/* Avatar y estado */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: getAvatarColor(usuario.nombre),
                      fontSize: 20,
                      fontWeight: 700,
                      mr: 2
                    }}
                  >
                    {getInitials(usuario.nombre, usuario.apellido)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                      {usuario.nombre} {usuario.apellido}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip
                        label={usuario.rol}
                        size="small"
                        sx={{
                          bgcolor: getRolColor(usuario.rol).bg,
                          color: getRolColor(usuario.rol).color,
                          fontWeight: 600,
                          height: 20,
                          fontSize: 11
                        }}
                      />
                      <Chip
                        label={usuario.activo ? 'Activo' : 'Inactivo'}
                        size="small"
                        sx={{
                          bgcolor: usuario.activo ? '#10b98115' : '#99999915',
                          color: usuario.activo ? '#10b981' : '#999',
                          fontWeight: 600,
                          height: 20,
                          fontSize: 11
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ wordBreak: 'break-word' }}>
                      {usuario.email}
                    </Typography>
                  </Box>

                  {usuario.whatsapp && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                        WhatsApp (opcional)
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneAndroidIcon sx={{ fontSize: 16, color: '#10b981' }} />
                        <Typography variant="body2" fontWeight="600">
                          {usuario.whatsapp}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {user?.rol === 'SuperAdmin' && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Empresa: {usuario.empresa}
                  </Typography>
                )}

                {/* Acciones */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(usuario)}
                    sx={{ bgcolor: '#f3f4f6', '&:hover': { bgcolor: '#e5e7eb' } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(usuario)}
                    sx={{ bgcolor: '#fee2e2', color: '#dc2626', '&:hover': { bgcolor: '#fecaca' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredUsuarios.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 64, color: '#ddd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay usuarios registrados
          </Typography>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />

            <TextField
              fullWidth
              label="Apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              error={!!errors.apellido}
              helperText={errors.apellido}
              required
            />

            <TextField
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              error={!!errors.email}
              helperText={errors.email}
              required
            />

            <TextField
              fullWidth
              label="Número WhatsApp (opcional)"
              placeholder="+5493512345678"
              value={formData.whatsapp}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              error={!!errors.whatsapp}
              helperText={errors.whatsapp || "Formato: +54 9 351 234 5678 (opcional para usuarios web)"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Rol"
              value={formData.rol}
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
              error={!!errors.rol}
              helperText={errors.rol}
              required
            >
              {roles.map(rol => (
                <MenuItem key={rol} value={rol}>{rol}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingUsuario ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de eliminar al usuario <strong>{deleteUsuario?.nombre} {deleteUsuario?.apellido}</strong>?
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
