// Eventos page migrated to Service Layer
import { useState, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import { useAuth } from "../../hooks/useAuth";
import { useTenant } from "../../hooks/useTenant";
import { eventoService } from "../../services/EventoService";
import type { EventoExtended, FormErrors } from "../../types";

interface EventoFormData {
  nombre: string;
  descripcion: string;
  fecha: string; // ISO date string
  activo: boolean;
}

export default function Eventos() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [eventos, setEventos] = useState<EventoExtended[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingEvento, setEditingEvento] = useState<EventoExtended | null>(null);
  const [deleteEvento, setDeleteEvento] = useState<EventoExtended | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<EventoFormData>({
    nombre: "",
    descripcion: "",
    fecha: "",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await eventoService.getAll();
      setEventos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter by tenant
  const eventosPorEmpresa = eventos.filter(
    (e) => e.empresaId === currentTenant?.id
  );

  const filteredEventos = eventosPorEmpresa.filter((e) =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (): void => {
    const dataToExport = filteredEventos.map((e) => ({
      Nombre: e.nombre,
      Descripción: e.descripcion ?? "",
      Fecha: e.fecha,
      Estado: e.activo ? "Activo" : "Inactivo",
      ...(user?.rol === "SuperAdmin" && { Empresa: e.empresaNombre }),
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eventos");
    XLSX.writeFile(
      wb,
      `Eventos_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleNew = (): void => {
    setEditingEvento(null);
    setFormData({ nombre: "", descripcion: "", fecha: "", activo: true });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (evento: EventoExtended): void => {
    setEditingEvento(evento);
    setFormData({
      nombre: evento.nombre,
      descripcion: evento.descripcion ?? "",
      fecha: evento.fecha?.split("T")[0] ?? "",
      activo: evento.activo,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (): Promise<void> => {
    if (!validate()) return;
    if (editingEvento) {
      const updated = await eventoService.update(editingEvento.id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        activo: formData.activo,
      });
      setEventos(eventos.map((e) => (e.id === updated.id ? updated : e)));
    } else {
      const created = await eventoService.create({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        activo: formData.activo,
        empresaId: currentTenant?.id || 0,
        empresaNombre: currentTenant?.nombre,
      } as any);
      setEventos([...eventos, created]);
    }
    setOpenDialog(false);
  };

  const handleDeleteClick = (evento: EventoExtended): void => {
    setDeleteEvento(evento);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (deleteEvento) {
      await eventoService.delete(deleteEvento.id);
      setEventos(eventos.filter((e) => e.id !== deleteEvento.id));
    }
    setOpenDeleteDialog(false);
    setDeleteEvento(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <LinearProgress sx={{ width: "50%" }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Eventos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de eventos • {filteredEventos.length}{" "}
              {filteredEventos.length === 1 ? "evento" : "eventos"}
            </Typography>
          </Box>
        </Box>
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            bgcolor: "white",
            p: 2.5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <TextField
            placeholder="Buscar por nombre o descripción..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredEventos.length === 0}
            sx={{
              borderColor: "#10b981",
              color: "#10b981",
              fontWeight: 600,
              "&:hover": { borderColor: "#059669", bgcolor: "#10b98110" },
            }}
          >
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
            sx={{
              bgcolor: "#1E2C56",
              fontWeight: 600,
              "&:hover": { bgcolor: "#16213E" },
            }}
          >
            Nuevo Evento
          </Button>
        </Box>
      </Box>

      {/* Grid de eventos */}
      <Grid container spacing={3}>
        {filteredEventos.map((evento) => (
          <Grid item xs={12} sm={6} md={4} key={evento.id}>
            <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, height: "100%", transition: "all 0.3s", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transform: "translateY(-2px)" } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                  {evento.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {evento.descripcion}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fecha: {evento.fecha?.split("T")[0]}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={evento.activo ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                      bgcolor: evento.activo ? "#10b98115" : "#99999915",
                      color: evento.activo ? "#10b981" : "#999",
                      fontWeight: 600,
                      height: 20,
                      fontSize: 11,
                    }}
                  />
                </Box>
                {user?.rol === "SuperAdmin" && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    Empresa: {evento.empresaNombre}
                  </Typography>
                )}
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(evento)}
                    sx={{ bgcolor: "#f3f4f6", "&:hover": { bgcolor: "#e5e7eb" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(evento)}
                    sx={{ bgcolor: "#fee2e2", color: "#dc2626", "&:hover": { bgcolor: "#fecaca" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredEventos.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No hay eventos registrados
          </Typography>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEvento ? "Editar Evento" : "Nuevo Evento"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
              fullWidth
            />
            <TextField
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              error={!!errors.fecha}
              helperText={errors.fecha}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Activo</Typography>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingEvento ? "Guardar Cambios" : "Crear Evento"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el evento {deleteEvento?.nombre}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
