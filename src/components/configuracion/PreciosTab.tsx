import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import StopIcon from "@mui/icons-material/Stop";
import { format } from "date-fns";
import format from "date-fns/format";
import type { PrecioCombustible } from "../../types/reports";

interface PreciosTabProps {
  precios: PrecioCombustible[];
  onUpdate: (updated: PrecioCombustible[]) => void;
  onSave: () => void;
}

const mockSurtidores = [
  { id: 1, nombre: "SUR-001 - Principal" },
  { id: 2, nombre: "SUR-002 - Secundario" },
  { id: 3, nombre: "SUR-003 - Emergencia" },
];

export default function PreciosTab({
  precios,
  onUpdate,
  onSave,
}: PreciosTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPrecio, setEditingPrecio] = useState<PrecioCombustible | null>(
    null
  );
  const [form, setForm] = useState({
    surtidorId: undefined as number | undefined,
    precioLitro: "",
    fechaInicio: format(new Date(), "yyyy-MM-dd"),
    observaciones: "",
  });

  const handleNuevo = () => {
    setEditingPrecio(null);
    setForm({
      surtidorId: undefined,
      precioLitro: "",
      fechaInicio: format(new Date(), "yyyy-MM-dd"),
      observaciones: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (precio: PrecioCombustible) => {
    setEditingPrecio(precio);
    setForm({
      surtidorId: precio.surtidorId,
      precioLitro: precio.precioLitro.toString(),
      fechaInicio: format(new Date(precio.fechaInicio), "yyyy-MM-dd"),
      observaciones: precio.observaciones || "",
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingPrecio) {
      onUpdate(
        precios.map((p) =>
          p.id === editingPrecio.id
            ? { ...p, ...form, precioLitro: parseFloat(form.precioLitro) }
            : p
        )
      );
    } else {
      const newPrecio: PrecioCombustible = {
        id: Math.max(...precios.map((p) => p.id)) + 1,
        empresaId: 1,
        ...form,
        precioLitro: parseFloat(form.precioLitro),
        moneda: "ARS",
        activo: true,
        createdBy: 1,
        createdAt: new Date().toISOString(),
      };
      onUpdate([...precios, newPrecio]);
    }
    setOpenDialog(false);
    onSave();
  };

  const handleFinalizar = (id: number) => {
    onUpdate(
      precios.map((p) =>
        p.id === id
          ? { ...p, fechaFin: new Date().toISOString(), activo: false }
          : p
      )
    );
    onSave();
  };

  return (
    <>
      <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e0e0" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                  Histórico de Precios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestión de precios de combustible por surtidor o globales
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNuevo}
                sx={{
                  bgcolor: "#10b981",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                Nuevo Precio
              </Button>
            </Box>
          </Box>

          <Table>
            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Surtidor</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Precio/Litro</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vigencia Desde</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vigencia Hasta</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {precios.map((precio) => (
                <TableRow key={precio.id} hover>
                  <TableCell>
                    {precio.surtidorId
                      ? mockSurtidores.find((s) => s.id === precio.surtidorId)
                          ?.nombre ||
                        `SUR-${precio.surtidorId.toString().padStart(3, "0")}`
                      : "Global"}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ${precio.precioLitro}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(precio.fechaInicio), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {precio.fechaFin ? (
                      format(new Date(precio.fechaFin), "dd/MM/yyyy")
                    ) : (
                      <Chip label="Vigente" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={precio.activo ? "Activo" : "Inactivo"}
                      color={precio.activo ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(precio)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {!precio.fechaFin && (
                      <IconButton
                        size="small"
                        onClick={() => handleFinalizar(precio.id)}
                        color="warning"
                      >
                        <StopIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPrecio ? "Editar Precio" : "Nuevo Precio"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Autocomplete
              options={mockSurtidores}
              getOptionLabel={(s) => s.nombre}
              value={
                mockSurtidores.find((s) => s.id === form.surtidorId) || null
              }
              onChange={(_, newValue) =>
                setForm({ ...form, surtidorId: newValue?.id })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Surtidor (Opcional)"
                  helperText="Dejar vacío para precio global"
                />
              )}
            />
            <TextField
              required
              type="number"
              label="Precio por Litro"
              value={form.precioLitro}
              onChange={(e) =>
                setForm({ ...form, precioLitro: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <TextField
              required
              type="date"
              label="Vigencia Desde"
              value={form.fechaInicio}
              onChange={(e) =>
                setForm({ ...form, fechaInicio: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              multiline
              rows={2}
              label="Observaciones (Opcional)"
              value={form.observaciones}
              onChange={(e) =>
                setForm({ ...form, observaciones: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.precioLitro || !form.fechaInicio}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
