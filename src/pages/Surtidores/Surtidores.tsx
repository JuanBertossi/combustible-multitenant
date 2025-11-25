import { useState, useEffect } from "react";
import SkeletonLoading from "../../components/common/SkeletonLoading/SkeletonLoading";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAuth } from "../../hooks/useAuth";
import { useTenant } from "../../hooks/useTenant";
import * as XLSX from "xlsx";
import { surtidorService } from "../../services/SurtidorService";
import type { SurtidorExtended, FormErrors } from "../../types";

const TIPOS_COMBUSTIBLE: string[] = ["Diésel", "Nafta", "GNC", "GLP"];

interface SurtidorFormData {
  codigo: string;
  nombre: string;
  ubicacion: string;
  tipoCombustible: string;
  activo: boolean;
}

export default function Surtidores() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [surtidores, setSurtidores] = useState<SurtidorExtended[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [editingSurtidor, setEditingSurtidor] =
    useState<SurtidorExtended | null>(null);
  const [deleteSurtidor, setDeleteSurtidor] = useState<SurtidorExtended | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterTipo, setFilterTipo] = useState<string>("Todos");
  const [formData, setFormData] = useState<SurtidorFormData>({
    codigo: "",
    nombre: "",
    ubicacion: "",
    tipoCombustible: "Diésel",
    activo: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadSurtidores();
  }, []);

  const loadSurtidores = async () => {
    setLoading(true);
    try {
      const data = await surtidorService.getAll();
      setSurtidores(data);
    } catch (error) {
      console.error("Error loading surtidores:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <SkeletonLoading height={48} count={1} />
        <SkeletonLoading height={120} count={4} />
      </Box>
    );
  }

  const surtidoresPorEmpresa = surtidores.filter(
    (s) => s.empresaId === currentTenant?.id
  );

  const filteredSurtidores = surtidoresPorEmpresa.filter((s) => {
    const matchSearch =
      (s.codigo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.ubicacion || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo =
      filterTipo === "Todos" || s.tipoCombustible === filterTipo;
    return matchSearch && matchTipo;
  });

  const handleExport = (): void => {
    const dataToExport = filteredSurtidores.map((s) => ({
      Código: s.codigo || "",
      Nombre: s.nombre,
      Ubicación: s.ubicacion || "",
      "Tipo Combustible": s.tipoCombustible || "",
      Estado: s.activo ? "Activo" : "Inactivo",
      ...(user?.rol === "SuperAdmin" && {
        Empresa: s.empresa || s.empresaNombre,
      }),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Surtidores");
    XLSX.writeFile(
      wb,
      `Surtidores_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleNew = (): void => {
    setEditingSurtidor(null);
    setFormData({
      codigo: "",
      nombre: "",
      ubicacion: "",
      tipoCombustible: "Diésel",
      activo: true,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (surtidor: SurtidorExtended): void => {
    setEditingSurtidor(surtidor);
    setFormData({
      codigo: surtidor.codigo || "",
      nombre: surtidor.nombre,
      ubicacion: surtidor.ubicacion || "",
      tipoCombustible: surtidor.tipoCombustible || "Diésel",
      activo: surtidor.activo,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = "El código es obligatorio";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.ubicacion.trim())
      newErrors.ubicacion = "La ubicación es obligatoria";
    if (!formData.tipoCombustible)
      newErrors.tipoCombustible = "El tipo de combustible es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingSurtidor) {
        await surtidorService.update(editingSurtidor.id, {
          ...formData,
          empresaId: editingSurtidor.empresaId, // Mantener empresa original
        });
      } else {
        await surtidorService.create({
          ...formData,
          empresaId: currentTenant?.id || 0,
          empresa: currentTenant?.nombre,
        });
      }
      await loadSurtidores();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving surtidor:", error);
    }
  };

  const handleDeleteClick = (surtidor: SurtidorExtended): void => {
    setDeleteSurtidor(surtidor);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deleteSurtidor) {
      try {
        await surtidorService.delete(deleteSurtidor.id);
        await loadSurtidores();
      } catch (error) {
        console.error("Error deleting surtidor:", error);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteSurtidor(null);
  };

  const getColorByTipo = (tipo: string): string => {
    const colors: Record<string, string> = {
      Diésel: "#10b981",
      Nafta: "#3b82f6",
      GNC: "#f59e0b",
      GLP: "#8b5cf6",
    };
    return colors[tipo] ?? "#667eea";
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
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
              Surtidores
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de surtidores y puntos de carga •{" "}
              {filteredSurtidores.length}{" "}
              {filteredSurtidores.length === 1 ? "surtidor" : "surtidores"}
            </Typography>
          </Box>
        </Box>

        {/* Filtros */}
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
            placeholder="Buscar por código, nombre o ubicación..."
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

          <TextField
            select
            size="small"
            label="Tipo"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="Todos">Todos los tipos</MenuItem>
            {TIPOS_COMBUSTIBLE.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredSurtidores.length === 0}
            sx={{
              borderColor: "#10b981",
              color: "#10b981",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#059669",
                bgcolor: "#10b98110",
              },
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
            Nuevo Surtidor
          </Button>
        </Box>
      </Box>

      {/* Grid de surtidores */}
      <Grid container spacing={3}>
        {filteredSurtidores.map((surtidor) => (
          /* @ts-expect-error - MUI v7 Grid type incompatibility */
          <Grid item xs={12} sm={6} md={4} lg={3} key={surtidor.id}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${getColorByTipo(
                        surtidor.tipoCombustible || ""
                      )}15`,
                      color: getColorByTipo(surtidor.tipoCombustible || ""),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LocalGasStationIcon sx={{ fontSize: 28 }} />
                  </Box>

                  <Chip
                    label={surtidor.tipoCombustible}
                    size="small"
                    sx={{
                      bgcolor: `${getColorByTipo(
                        surtidor.tipoCombustible || ""
                      )}15`,
                      color: getColorByTipo(surtidor.tipoCombustible || ""),
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Info */}
                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                  {surtidor.codigo}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {surtidor.nombre}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 2,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 16, color: "#999" }} />
                  <Typography variant="caption" color="text.secondary">
                    {surtidor.ubicacion}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    Estado
                  </Typography>
                  <Chip
                    label={surtidor.activo ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{
                      bgcolor: surtidor.activo ? "#10b98115" : "#99999915",
                      color: surtidor.activo ? "#10b981" : "#999",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {user?.rol === "SuperAdmin" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 2 }}
                  >
                    Empresa: {surtidor.empresa}
                  </Typography>
                )}

                {/* Acciones */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(surtidor)}
                    sx={{
                      bgcolor: "#f3f4f6",
                      "&:hover": { bgcolor: "#e5e7eb" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(surtidor)}
                    sx={{
                      bgcolor: "#fee2e2",
                      color: "#dc2626",
                      "&:hover": { bgcolor: "#fecaca" },
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

      {filteredSurtidores.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <LocalGasStationIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay surtidores registrados
          </Typography>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSurtidor ? "Editar Surtidor" : "Nuevo Surtidor"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Código"
              value={formData.codigo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  codigo: e.target.value.toUpperCase(),
                })
              }
              error={!!errors.codigo}
              helperText={errors.codigo}
              required
              placeholder="SUR-001"
              fullWidth
            />
            <TextField
              select
              label="Tipo de Combustible"
              value={formData.tipoCombustible}
              onChange={(e) =>
                setFormData({ ...formData, tipoCombustible: e.target.value })
              }
              error={!!errors.tipoCombustible}
              helperText={errors.tipoCombustible}
              required
              fullWidth
            >
              {TIPOS_COMBUSTIBLE.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
              placeholder="Surtidor Principal"
              fullWidth
            />
            <TextField
              label="Ubicación"
              value={formData.ubicacion}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion: e.target.value })
              }
              error={!!errors.ubicacion}
              helperText={errors.ubicacion}
              required
              placeholder="Estación Central, Lote 45, etc."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingSurtidor ? "Guardar Cambios" : "Crear Surtidor"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el surtidor {deleteSurtidor?.codigo} -{" "}
          {deleteSurtidor?.nombre}?
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
