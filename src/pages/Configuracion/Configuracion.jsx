import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../../hooks/useAuth';

export default function Configuracion() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombreEmpresa: user?.empresa || 'AgroTransporte SA',
    email: 'contacto@empresa.com',
    telefono: '+54 351 1234567',
    whatsappBusiness: '+54 351 7654321',
    precioLitro: '600',
    umbralAlerta: '80'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Aquí iría la lógica para guardar en la API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Configuración
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configuración general de {user?.rol === 'SuperAdmin' ? 'la plataforma' : 'la empresa'}
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ Configuración guardada exitosamente
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Información General
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nombre de la Empresa"
              value={formData.nombreEmpresa}
              onChange={(e) => setFormData({...formData, nombreEmpresa: e.target.value})}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="email"
              label="Email de Contacto"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="WhatsApp Business"
              value={formData.whatsappBusiness}
              onChange={(e) => setFormData({...formData, whatsappBusiness: e.target.value})}
              helperText="Número para recibir eventos de combustible"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
              Configuración de Combustible
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Precio por Litro ($)"
              value={formData.precioLitro}
              onChange={(e) => setFormData({...formData, precioLitro: e.target.value})}
              helperText="Precio base del combustible"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Umbral de Alerta (%)"
              value={formData.umbralAlerta}
              onChange={(e) => setFormData({...formData, umbralAlerta: e.target.value})}
              helperText="Porcentaje de capacidad para generar alerta"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ 
                  bgcolor: '#1a1a2e',
                  fontWeight: 'bold',
                  px: 4,
                  '&:hover': { bgcolor: '#252540' }
                }}
              >
                Guardar Configuración
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
