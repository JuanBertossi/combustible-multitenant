import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import VirtualizedTable, {
  DataTableColumn,
} from "../../components/common/DataTable/VirtualizedTable";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx";
import { useAuth } from "../../hooks/useAuth";
import { useTenant } from "../../hooks/useTenant";
import {
  mockVehiculos,
  mockChoferes,
  mockSurtidores,
} from "../../utils/mockData";

interface EventoExtended {
  id: number;
  vehiculoPatente: string;
  choferNombre: string;
  surtidorNombre: string;
  litros: number;
  precio: number;
  total: number;
  estado: "Pendiente" | "Validado" | "Rechazado";
  observaciones: string;
  ubicacion: string;
  empresaId: number;
  empresaNombre?: string;
}

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
  ubicacion: string;
  evidencias: File[];
  activo: boolean;
}

const defaultFormData: EventoFormData = {
  vehiculoId: "",
  choferId: "",
  surtidorId: "",
  litros: "",
  precio: "",
  total: "",
  fecha: "",
  estado: "Pendiente",
  observaciones: "",
  ubicacion: "",
  evidencias: [],
  activo: true,
};

const Eventos: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  // Simulación de eventos
  const [eventos, setEventos] = useState<EventoExtended[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvento, setEditingEvento] = useState<EventoExtended | null>(
    null
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteEvento, setDeleteEvento] = useState<EventoExtended | null>(null);
  const [formData, setFormData] = useState<EventoFormData>(defaultFormData);

  useEffect(() => {
    // Simulación de fetch
    setEventos([
      {
        id: 1,
        vehiculoPatente: "ABC123",
        choferNombre: "Juan Pérez",
        surtidorNombre: "Surtidor 1",
        litros: 50,
        precio: 100,
        total: 5000,
        estado: "Validado",
        observaciones: "Sin observaciones",
        ubicacion: "Depósito Central",
        empresaId: 1,
        empresaNombre: "Empresa A",
      },
      {
        id: 2,
        vehiculoPatente: "XYZ789",
        choferNombre: "Ana Gómez",
        surtidorNombre: "Surtidor 2",
        litros: 30,
        precio: 120,
        total: 3600,
        estado: "Pendiente",
        observaciones: "Revisar ticket",
        ubicacion: "Sucursal Norte",
        empresaId: 2,
        empresaNombre: "Empresa B",
      },
    ]);
  }, []);

  // Filtrar por empresa y búsqueda
  const eventosPorEmpresa = eventos.filter(
    (e) => e.empresaId === currentTenant?.id
  );
  const filteredEventos = eventosPorEmpresa.filter((e) => {
    const vehiculoPatente = e.vehiculoPatente?.toLowerCase() || "";
    const choferNombre = e.choferNombre?.toLowerCase() || "";
    const observaciones = e.observaciones?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return (
      vehiculoPatente.includes(term) ||
      choferNombre.includes(term) ||
      observaciones.includes(term)
    );
  });

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
    setOpenDialog(false);
    setEditingEvento(null);
  };
  const handleDelete = () => {
    setOpenDeleteDialog(false);
    setDeleteEvento(null);
  };
  const handleExport = (): void => {
    const ws = XLSX.utils.json_to_sheet(filteredEventos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eventos");
    XLSX.writeFile(
      wb,
      `Eventos_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header y filtros */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Gestión de eventos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNew}
          >
            Nuevo Evento
          </Button>
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
            Exportar Excel
          </Button>
        </Box>
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
          <Typography variant="body2" color="text.secondary">
            {filteredEventos.length}{" "}
            {filteredEventos.length === 1 ? "evento" : "eventos"}
          </Typography>
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
          ¿Estás seguro de eliminar el evento {deleteEvento?.vehiculoPatente}?
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
};

export default Eventos;
