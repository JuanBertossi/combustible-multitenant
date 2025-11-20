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
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { UmbralVehiculo } from "../../types/reports";

interface UmbralesTabProps {
  umbrales: UmbralVehiculo[];
  onUpdate: (updated: UmbralVehiculo[]) => void;
  onSave: () => void;
}

const mockVehiculos = [
  { id: 1, patente: "AB123CD", marca: "Mercedes-Benz", modelo: "1114" },
  { id: 2, patente: "EF456GH", marca: "Scania", modelo: "R440" },
  { id: 3, patente: "IJ789KL", marca: "Iveco", modelo: "Cursor" },
  { id: 4, patente: "MN012OP", marca: "John Deere", modelo: "6125R" },
  { id: 5, patente: "QR345ST", marca: "Case IH", modelo: "Magnum 340" },
];

export default function UmbralesTab({ umbrales, onUpdate, onSave }: UmbralesTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUmbral, setEditingUmbral] = useState<UmbralVehiculo | null>(null);
  const [form, setForm] = useState({
    vehiculoId: 0,
    consumoMaximoLitros: "",
    consumoPromedioEsperado: "",
    toleranciaDesvio: "15",
    horasEntreCargas: "",
  });

  const getVehiculoById = (id: number) => mockVehiculos.find((v) => v.id === id);

  const handleNuevo = () => {
    setEditingUmbral(null);
    setForm({
      vehiculoId: 0,
      consumoMaximoLitros: "",
      consumoPromedioEsperado: "",
      toleranciaDesvio: "15",
      horasEntreCargas: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (umbral: UmbralVehiculo) => {
    setEditingUmbral(umbral);
    setForm({
      vehiculoId: umbral.vehiculoId,
      consumoMaximoLitros: umbral.consumoMaximoLitros?.toString() || "",
      consumoPromedioEsperado: umbral.consumoPromedioEsperado?.toString() || "",
      toleranciaDesvio: umbral.toleranciaDesvio.toString(),
      horasEntreCargas: umbral.horasEntreCargas?.toString() || "",
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingUmbral) {
      onUpdate(
        umbrales.map((u) =>
          u.id === editingUmbral.id
            ? {
                ...u,
                vehiculoId: form.vehiculoId,
                consumoMaximoLitros: form.consumoMaximoLitros
                  ? parseFloat(form.consumoMaximoLitros)
                  : undefined,
                consumoPromedioEsperado: form.consumoPromedioEsperado
                  ? parseFloat(form.consumoPromedioEsperado)
                  : undefined,
                toleranciaDesvio: parseFloat(form.toleranciaDesvio),
                horasEntreCargas: form.horasEntreCargas
                  ? parseFloat(form.horasEntreCargas)
                  : undefined,
              }
            : u
        )
      );
    } else {
      const newUmbral: UmbralVehiculo = {
        id: Math.max(...umbrales.map((u) => u.id)) + 1,
        empresaId: 1,
        vehiculoId: form.vehiculoId,
        consumoMaximoLitros: form.consumoMaximoLitros
          ? parseFloat(form.consumoMaximoLitros)
          : undefined,
        consumoPromedioEsperado: form.consumoPromedioEsperado
          ? parseFloat(form.consumoPromedioEsperado)
          : undefined,
        toleranciaDesvio: parseFloat(form.toleranciaDesvio),
        horasEntreCargas: form.horasEntreCargas ? parseFloat(form.horasEntreCargas) : undefined,
        activo: true,
        createdAt: new Date().toISOString(),
      };
      onUpdate([...umbrales, newUmbral]);
    }
    setOpenDialog(false);
    onSave();
  };

  return (
    <>
      <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e0e0" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                  Umbrales de Consumo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure límites y tolerancias por vehículo
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
                Nuevo Umbral
              </Button>
            </Box>
          </Box>

          <Table>
            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Consumo Máx/Carga</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Promedio Esperado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tolerancia Desvío</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hrs Entre Cargas</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {umbrales.map((umbral) => {
                const vehiculo = getVehiculoById(umbral.vehiculoId);
                return (
                  <TableRow key={umbral.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {vehiculo?.patente}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {vehiculo?.marca} {vehiculo?.modelo}
                      </Typography>
                    </TableCell>
                    <TableCell>{umbral.consumoMaximoLitros || "-"} L</TableCell>
                    <TableCell>
                      {umbral.consumoPromedioEsperado
                        ? `${umbral.consumoPromedioEsperado} L/100km`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`±${umbral.toleranciaDesvio}%`}
                        size="small"
                        color={umbral.toleranciaDesvio > 20 ? "warning" : "default"}
                      />
                    </TableCell>
                    <TableCell>{umbral.horasEntreCargas || "-"} hs</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(umbral)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUmbral ? "Editar Umbral" : "Nuevo Umbral"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Autocomplete
              options={mockVehiculos}
              getOptionLabel={(v) => `${v.patente} - ${v.marca} ${v.modelo}`}
              value={mockVehiculos.find((v) => v.id === form.vehiculoId) || null}
              onChange={(_, newValue) => setForm({ ...form, vehiculoId: newValue?.id || 0 })}
              renderInput={(params) => <TextField {...params} label="Vehículo" required />}
            />
            <TextField
              type="number"
              label="Consumo Máximo por Carga (L)"
              value={form.consumoMaximoLitros}
              onChange={(e) => setForm({ ...form, consumoMaximoLitros: e.target.value })}
            />
            <TextField
              type="number"
              label="Consumo Promedio Esperado"
              value={form.consumoPromedioEsperado}
              onChange={(e) => setForm({ ...form, consumoPromedioEsperado: e.target.value })}
              helperText="L/100km para transporte o L/hora para maquinaria"
            />
            <TextField
              required
              type="number"
              label="Tolerancia de Desvío (%)"
              value={form.toleranciaDesvio}
              onChange={(e) => setForm({ ...form, toleranciaDesvio: e.target.value })}
            />
            <TextField
              type="number"
              label="Horas Mínimas Entre Cargas"
              value={form.horasEntreCargas}
              onChange={(e) => setForm({ ...form, horasEntreCargas: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.vehiculoId || !form.toleranciaDesvio}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
