import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Badge,
  Chip,
  Divider 
} from '@mui/material';
import { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarColor = (nombre) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#1E2C56'];
    const index = nombre?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const getRolColor = (rol) => {
    const colors = {
      'Admin': { bg: '#ef444415', color: '#ef4444' },
      'SuperAdmin': { bg: '#8b5cf615', color: '#8b5cf6' },
      'Supervisor': { bg: '#f59e0b15', color: '#f59e0b' },
      'Operador': { bg: '#3b82f615', color: '#3b82f6' }
    };
    return colors[rol] || { bg: '#99999915', color: '#999' };
  };

  const commonIconButtonStyle = {
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    width: 46,
    height: 46,
    border: '1px solid rgba(180, 195, 205, 0.6)',
    '&:hover': { 
      bgcolor: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.05)',
      transition: 'all 0.2s',
      borderColor: '#94a3b8'
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        background: '#E1E9EF', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(180, 195, 205, 0.6)',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        boxShadow: '0 2px 8px rgba(30, 44, 86, 0.08)'
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', px: 4 }}>
        {/* Left side */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              ml: 3,
              fontSize: 12,
              letterSpacing: '0.5px',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
          >
            Bienvenido de nuevo
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                ml: 3,
                fontSize: 20,
                lineHeight: 1,
                fontWeight: 600,
                color: '#1e293b',
                letterSpacing: '-0.3px'
              }}
            >
              {user?.nombre} {user?.apellido}
            </Typography>
            <Chip
              label={user?.rol}
              size="small"
              sx={{
                bgcolor: getRolColor(user?.rol).bg,
                color: getRolColor(user?.rol).color,
                fontWeight: 700,
                height: 26,
                fontSize: 12,
                borderRadius: 2,
                letterSpacing: '0.3px'
              }}
            />
          </Box>
        </Box>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          
          {/* Notificaciones */}
          <IconButton sx={commonIconButtonStyle}>
            <Badge 
              badgeContent={3} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: 10,
                  height: 19,
                  minWidth: 19,
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }
              }}
            >
              <NotificationsIcon sx={{ fontSize: 22, color: '#475569' }} />
            </Badge>
          </IconButton>

          {/* Avatar */}
          <IconButton 
            onClick={handleMenu}
            sx={{ 
              p: 0,
              '&:hover': { 
                transform: 'scale(1.08)',
                transition: 'all 0.2s'
              }
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: getAvatarColor(user?.nombre),
                width: 46,
                height: 46,
                fontWeight: 700,
                fontSize: 17,
                border: '3px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                cursor: 'pointer'
              }}
            >
              {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              minWidth: 320,
              mt: 2,
              borderRadius: 3,
              border: '1px solid rgba(226, 232, 240, 0.6)',
              overflow: 'visible',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 18,
                width: 12,
                height: 12,
                bgcolor: 'rgba(255, 255, 255, 0.98)',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                border: '1px solid rgba(226, 232, 240, 0.6)',
                borderBottom: 'none',
                borderRight: 'none'
              },
              '& .MuiMenuItem-root': {
                borderRadius: 2,
                mx: 1.5,
                my: 0.5
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 3, py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
              <Avatar 
                sx={{ 
                  bgcolor: getAvatarColor(user?.nombre),
                  width: 60,
                  height: 60,
                  fontWeight: 700,
                  fontSize: 22,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 0.8,
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#1e293b',
                    letterSpacing: '-0.3px'
                  }}
                >
                  {user?.nombre} {user?.apellido}
                </Typography>
                <Chip
                  label={user?.rol}
                  size="small"
                  sx={{
                    bgcolor: getRolColor(user?.rol).bg,
                    color: getRolColor(user?.rol).color,
                    fontWeight: 700,
                    height: 24,
                    fontSize: 11,
                    letterSpacing: '0.3px'
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon sx={{ fontSize: 19, color: '#94a3b8' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: 14,
                    color: '#64748b',
                    fontWeight: 500
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
              {user?.empresa && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <BusinessIcon sx={{ fontSize: 19, color: '#94a3b8' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: 14,
                      color: '#64748b',
                      fontWeight: 500
                    }}
                  >
                    {user?.empresa}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(226, 232, 240, 0.6)' }} />
          
          <Box sx={{ p: 1.5 }}>
            <MenuItem 
              onClick={handleClose}
              sx={{ fontWeight: 600, fontSize: 14, py: 1.2, color: '#334155' }}
            >
              <PersonIcon fontSize="small" sx={{ mr: 2, color: '#64748b' }} />
              Mi Perfil
            </MenuItem>
            
            <MenuItem 
              onClick={handleClose}
              sx={{ fontWeight: 600, fontSize: 14, py: 1.2, color: '#334155' }}
            >
              <SettingsIcon fontSize="small" sx={{ mr: 2, color: '#64748b' }} />
              Configuración
            </MenuItem>
          </Box>

          <Divider sx={{ borderColor: 'rgba(226, 232, 240, 0.6)' }} />

          <MenuItem 
            onClick={handleLogout}
            sx={{
              color: '#ef4444',
              fontWeight: 700,
              py: 1.8,
              fontSize: 14,
              letterSpacing: '0.2px',
              '&:hover': {
                bgcolor: '#fee2e2'
              }
            }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
