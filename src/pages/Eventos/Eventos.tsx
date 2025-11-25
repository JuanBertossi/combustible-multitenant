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
  LinearProgress,
  Alert,
} from "@mui/material";
import VirtualizedTable, {
  DataTableColumn,
} from "../../components/common/DataTable/VirtualizedTable";
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
import {
  mockVehiculos,
  mockChoferes,
  mockSurtidores,
} from "../../utils/mockData";

interface EventoFormData {
  vehiculoId: number | "";
  choferId: number | "";
  surtidorId: number | "";
  litros: number | "";
  precio: number | "";
  total: number | "";
  fecha: string;
  estado: "Pendiente" | "Validado" | "Rechazado";
  observaciones: string;
  evidencias?: File[];
  ubicacion?: string;
  activo: boolean;
}

export default function Eventos() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [eventos, setEventos] = useState<EventoExtended[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingEvento, setEditingEvento] = useState<EventoExtended | null>(
    null
  );
  const [deleteEvento, setDeleteEvento] = useState<EventoExtended | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formData, setFormData] = useState<EventoFormData>({
    vehiculoId: "",
    choferId: "",
    surtidorId: "",
    litros: "",
    precio: "",
    total: "",
    fecha: "",
    estado: "Pendiente",
    observaciones: "",
    evidencias: [],
    ubicacion: "",
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

  // Limpieza de variables y props inexistentes en filtro
  const filteredEventos = eventosPorEmpresa.filter((e) => {
    const vehiculoPatente = e.vehiculoPatente
      ? e.vehiculoPatente.toLowerCase()
      : "";
    const choferNombre = e.choferNombre ? e.choferNombre.toLowerCase() : "";
    const observaciones = e.observaciones ? e.observaciones.toLowerCase() : "";
    const term = searchTerm.toLowerCase();
    return (
      vehiculoPatente.includes(term) ||
      choferNombre.includes(term) ||
      observaciones.includes(term)
    );
  });

  // Columnas para la tabla virtualizada
  const columns: DataTableColumn<EventoExtended>[] = [
    { field: "vehiculoPatente", headerName: "Vehículo" },
    { field: "choferNombre", headerName: "Chofer" },
    { field: "surtidorNombre", headerName: "Surtidor" },
    { field: "litros", headerName: "Litros" },
    { field: "precio", headerName: "Precio" },
    { field: "total", headerName: "Total" },
    {
      field: "estado",
      headerName: "Estado",
      type: "badge",
      getColor: (value) =>
        value === "Validado"
          ? "success"
          : value === "Pendiente"
          ? "info"
          : "error",
    },
    { field: "observaciones", headerName: "Observaciones" },
    { field: "ubicacion", headerName: "Ubicación" },
    ...(user?.rol === "SuperAdmin"
      ? [
          {
            field: "empresaNombre",
            headerName: "Empresa",
          } as DataTableColumn<EventoExtended>,
        ]
      : []),
  ];

  const handleNew = () => {
    setEditingEvento(null);
    setOpenDialog(true);
  };

  const handleEdit = (evento: EventoExtended) => {
    setEditingEvento(evento);
    setOpenDialog(true);
  };

  const handleDeleteClick = (evento: EventoExtended) => {
    setDeleteEvento(evento);
    setOpenDeleteDialog(true);
  };

  const handleSave = () => {
    // Simulate save logic
    setOpenDialog(false);
    setEditingEvento(null);
  };

  const handleDelete = () => {
    // Simulate delete logic
    setOpenDeleteDialog(false);
    setDeleteEvento(null);
  };

  const handleExport = (): void => {
    // Create worksheet from filteredEventos
    const ws = XLSX.utils.json_to_sheet(filteredEventos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eventos");
    XLSX.writeFile(
      wb,
      `Eventos_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

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

      {/* Tabla paginada de eventos */}
      <VirtualizedTable
        columns={columns}
        data={filteredEventos}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No hay eventos registrados"
      />

      {/* Dialogs */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingEvento ? "Editar Evento" : "Nuevo Evento"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              select
              label="Vehículo"
              value={formData.vehiculoId}
              onChange={(e) =>
                setFormData({ ...formData, vehiculoId: Number(e.target.value) })
              }
              error={!!errors.vehiculoId}
              helperText={errors.vehiculoId}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {mockVehiculos.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.patente} - {v.marca} {v.modelo}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Chofer"
              value={formData.choferId}
              onChange={(e) =>
                setFormData({ ...formData, choferId: Number(e.target.value) })
              }
              error={!!errors.choferId}
              helperText={errors.choferId}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {mockChoferes.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre} {c.apellido}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Surtidor"
              value={formData.surtidorId}
              onChange={(e) =>
                setFormData({ ...formData, surtidorId: Number(e.target.value) })
              }
              error={!!errors.surtidorId}
              helperText={errors.surtidorId}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione...</MenuItem>
              {mockSurtidores.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre} ({s.ubicacion})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Litros"
              type="number"
              value={formData.litros}
              onChange={(e) =>
                setFormData({ ...formData, litros: Number(e.target.value) })
              }
              error={!!errors.litros}
              helperText={errors.litros}
              required
              fullWidth
            />
            <TextField
              label="Precio Unitario"
              type="number"
              value={formData.precio}
              onChange={(e) =>
                setFormData({ ...formData, precio: Number(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Total"
              type="number"
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: Number(e.target.value) })
              }
              fullWidth
            />
            <TextField
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
              error={!!errors.fecha}
              helperText={errors.fecha}
              required
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              select
              label="Estado"
              value={formData.estado}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estado: e.target.value as
                    | "Pendiente"
                    | "Validado"
                    | "Rechazado",
                })
              }
              fullWidth
            >
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Validado">Validado</MenuItem>
              <MenuItem value="Rechazado">Rechazado</MenuItem>
            </TextField>
            <TextField
              label="Observaciones"
              value={formData.observaciones}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Ubicación"
              value={formData.ubicacion}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion: e.target.value })
              }
              fullWidth
            />
            <Box>
              <Typography>Evidencias (simulado)</Typography>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    evidencias: e.target.files
                      ? Array.from(e.target.files)
                      : [],
                  })
                }
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Activo</Typography>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) =>
                  setFormData({ ...formData, activo: e.target.checked })
                }
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

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el evento {deleteEvento?.vehiculo}?
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
