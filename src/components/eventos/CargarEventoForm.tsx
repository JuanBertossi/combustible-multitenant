import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { FileUpload } from "../common/Evidence";
import { mockVehiculos, mockChoferes, mockSurtidores } from "../../utils/mockData";
import { mockPolitica, mockUmbrales } from "../../utils/mockPoliticas";
import {
  validarEventoConPoliticas,
  ValidationResult,
} from "../../utils/validacionPoliticas";
import type { TipoEvidencia, Evidencia } from "../../types/reports";
import type { Evento } from "../../types";

interface CargarEventoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (evento: EventoFormData) => Promise<void>;
}

export interface EventoFormData {
  // Datos básicos
  vehiculoId: number | null;
  choferId: number | null;
  surtidorId: number | null;
  fecha: string;
  
  // Mediciones
  litros: number | null;
  odometro?: number | null;
  horometro?: number | null;
  
  // Ubicación (opcional)
  latitud?: number | null;
  longitud?: number | null;
  
  // Datos adicionales
  observaciones?: string;
  
  // Evidencias (serán subidas después)
  evidenciasFotos: File[];
  evidenciaAudio?: File;
}

interface FormErrors {
  vehiculoId?: string;
  choferId?: string;
  surtidorId?: string;
  fecha?: string;
  litros?: string;
  odometro?: string;
  horometro?: string;
}

export default function CargarEventoForm({
  open,
  onClose,
  onSubmit,
}: CargarEventoFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<EventoFormData>({
    vehiculoId: null,
    choferId: null,
    surtidorId: null,
    fecha: new Date().toISOString().slice(0, 16),
    litros: null,
    odometro: null,
    horometro: null,
    latitud: null,
    longitud: null,
    observaciones: "",
    evidenciasFotos: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const steps = ["Datos Básicos", "Mediciones", "Evidencias", "Confirmar"];

  // Validar en tiempo real cuando cambian datos relevantes
  useEffect(() => {
    if (activeStep > 0) {
      validateCurrentData();
    }
  }, [
    formData.litros,
    formData.odometro,
    formData.horometro,
    formData.evidenciasFotos,
    formData.evidenciaAudio,
    formData.latitud,
    formData.vehiculoId,
    activeStep
  ]);

  const validateCurrentData = () => {
    if (!formData.vehiculoId || !formData.litros) return;

    const selectedVehiculo = mockVehiculos.find(v => v.id === formData.vehiculoId);
    const umbral = mockUmbrales.find(u => u.vehiculoId === formData.vehiculoId);

    // Construir objeto Evento parcial para validación
    const eventoParcial: Partial<Evento> = {
      id: 0, // Temporal
      vehiculoId: formData.vehiculoId,
      vehiculoPatente: selectedVehiculo?.patente || "",
      litros: formData.litros,
      kmFinal: formData.odometro || undefined,
      // Estimamos kmInicial para calcular rendimiento si hay odómetro
      kmInicial: formData.odometro ? formData.odometro - (selectedVehiculo?.rendimientoPromedio ? formData.litros * selectedVehiculo.rendimientoPromedio : 0) : undefined,
      latitud: formData.latitud || undefined,
      longitud: formData.longitud || undefined,
    };

    // Construir evidencias parciales
    const evidenciasParciales: Evidencia[] = [
      ...formData.evidenciasFotos.map((_, i) => ({ tipo: "foto-surtidor", url: "temp" } as Evidencia)), // Asumimos tipo genérico para validar cantidad
      ...(formData.evidenciaAudio ? [{ tipo: "audio", url: "temp" } as Evidencia] : []),
      ...(formData.latitud ? [{ tipo: "ubicacion", url: "temp" } as Evidencia] : []),
    ];

    const result = validarEventoConPoliticas(
      eventoParcial as Evento,
      evidenciasParciales,
      mockPolitica,
      umbral
    );

    setValidationResult(result);
  };

  // Obtener ubicación GPS
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  };

  // Validaciones
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 0) {
      if (!formData.vehiculoId) newErrors.vehiculoId = "Selecciona un vehículo";
      if (!formData.choferId) newErrors.choferId = "Selecciona un chofer";
      if (!formData.surtidorId) newErrors.surtidorId = "Selecciona un surtidor";
      if (!formData.fecha) newErrors.fecha = "Ingresa la fecha y hora";
    }

    if (step === 1) {
      if (!formData.litros || formData.litros <= 0) {
        newErrors.litros = "Ingresa una cantidad válida de litros";
      }
      if (formData.odometro !== null && formData.odometro !== undefined && formData.odometro < 0) {
        newErrors.odometro = "El odómetro no puede ser negativo";
      }
      if (formData.horometro !== null && formData.horometro !== undefined && formData.horometro < 0) {
        newErrors.horometro = "El horómetro no puede ser negativo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error al guardar evento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      vehiculoId: null,
      choferId: null,
      surtidorId: null,
      fecha: new Date().toISOString().slice(0, 16),
      litros: null,
      odometro: null,
      horometro: null,
      latitud: null,
      longitud: null,
      observaciones: "",
      evidenciasFotos: [],
    });
    setActiveStep(0);
    setErrors({});
    setValidationResult(null);
    onClose();
  };

  const handleUploadFotos = async (files: File[], tipo: TipoEvidencia) => {
    setFormData({
      ...formData,
      evidenciasFotos: [...formData.evidenciasFotos, ...files],
    });
  };

  const handleUploadAudio = async (files: File[], tipo: TipoEvidencia) => {
    setFormData({
      ...formData,
      evidenciaAudio: files[0],
    });
  };

  const selectedVehiculo = mockVehiculos.find((v) => v.id === formData.vehiculoId);
  const selectedChofer = mockChoferes.find((c) => c.id === formData.choferId);
  const selectedSurtidor = mockSurtidores.find((s) => s.id === formData.surtidorId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "#1E2C56",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <LocalGasStationIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Cargar Evento Manualmente
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fallback cuando WhatsApp no está disponible
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: Datos Básicos */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
              Información del Evento
            </Typography>
            <Grid container spacing={3}>
              {/* Vehículo */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Autocomplete
                  options={mockVehiculos}
                  getOptionLabel={(option) =>
                    `${option.patente} - ${option.marca} ${option.modelo}`
                  }
                  value={selectedVehiculo || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, vehiculoId: newValue?.id || null })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vehículo *"
                      error={!!errors.vehiculoId}
                      helperText={errors.vehiculoId}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <DirectionsCarIcon sx={{ color: "#999", mr: 1 }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Chofer */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Autocomplete
                  options={mockChoferes}
                  getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
                  value={selectedChofer || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, choferId: newValue?.id || null })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chofer/Operador *"
                      error={!!errors.choferId}
                      helperText={errors.choferId}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <PersonIcon sx={{ color: "#999", mr: 1 }} />,
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Surtidor */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Autocomplete
                  options={mockSurtidores}
                  getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                  value={selectedSurtidor || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, surtidorId: newValue?.id || null })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Surtidor *"
                      error={!!errors.surtidorId}
                      helperText={errors.surtidorId}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <LocalGasStationIcon sx={{ color: "#999", mr: 1 }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Fecha y Hora */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Fecha y Hora *"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  error={!!errors.fecha}
                  helperText={errors.fecha}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 1: Mediciones */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
              Mediciones y Datos Técnicos
            </Typography>

            {/* Alerta de validación en tiempo real */}
            <Collapse in={!!validationResult && (validationResult.errores.length > 0 || validationResult.advertencias.length > 0)}>
              <Box sx={{ mb: 3 }}>
                {validationResult?.errores.map((err, i) => (
                  <Alert key={`err-${i}`} severity="error" icon={<ErrorIcon />} sx={{ mb: 1 }}>
                    {err.mensaje}
                  </Alert>
                ))}
                {validationResult?.advertencias.map((adv, i) => (
                  <Alert key={`adv-${i}`} severity="warning" icon={<WarningIcon />} sx={{ mb: 1 }}>
                    {adv.mensaje}
                  </Alert>
                ))}
              </Box>
            </Collapse>

            <Grid container spacing={3}>
              {/* Litros */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Litros Cargados *"
                  value={formData.litros || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, litros: parseFloat(e.target.value) || null })
                  }
                  error={!!errors.litros}
                  helperText={errors.litros}
                  InputProps={{
                    endAdornment: <Typography color="text.secondary">L</Typography>,
                  }}
                />
              </Grid>

              {/* Odómetro */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Odómetro (Opcional)"
                  value={formData.odometro || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, odometro: parseFloat(e.target.value) || null })
                  }
                  error={!!errors.odometro}
                  helperText={errors.odometro || "Para vehículos de transporte"}
                  InputProps={{
                    endAdornment: <Typography color="text.secondary">km</Typography>,
                  }}
                />
              </Grid>

              {/* Horómetro */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Horómetro (Opcional)"
                  value={formData.horometro || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, horometro: parseFloat(e.target.value) || null })
                  }
                  error={!!errors.horometro}
                  helperText={errors.horometro || "Para maquinaria agrícola"}
                  InputProps={{
                    endAdornment: <Typography color="text.secondary">hs</Typography>,
                  }}
                />
              </Grid>

              {/* Ubicación GPS */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ bgcolor: "#f8f9fa", border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" fontWeight={600}>
                        🗺️ Ubicación GPS (Opcional)
                      </Typography>
                      <Button size="small" onClick={handleGetLocation} variant="outlined">
                        Obtener Ubicación
                      </Button>
                    </Box>
                    {formData.latitud && formData.longitud && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        Lat: {formData.latitud.toFixed(6)}, Long: {formData.longitud.toFixed(6)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Observaciones */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observaciones (Opcional)"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Ej: Carga realizada en ruta 9, km 120..."
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 2: Evidencias */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Evidencias Fotográficas y de Audio
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sube fotos del surtidor, cuenta-litros, odómetro/horómetro y opcionalmente una nota de voz
            </Typography>

            <Grid container spacing={3}>
              {/* Fotos */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  📷 Fotos de Evidencia
                </Typography>
                <FileUpload
                  onUpload={handleUploadFotos}
                  tipo="foto-surtidor"
                  accept="image/*"
                  maxSize={5}
                  maxFiles={5}
                  multiple
                />
              </Grid>

              {/* Audio */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  🎤 Nota de Voz (Opcional)
                </Typography>
                <FileUpload
                  onUpload={handleUploadAudio}
                  tipo="audio"
                  accept="audio/*"
                  maxSize={10}
                  maxFiles={1}
                  multiple={false}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 3: Confirmar */}
        {activeStep === 3 && (
          <Box>
            {validationResult && !validationResult.valido ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                El evento tiene errores de validación. Si continúas, será marcado como <strong>Rechazado</strong> o requerirá revisión manual urgente.
              </Alert>
            ) : validationResult && validationResult.advertencias.length > 0 ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                El evento tiene advertencias. Quedará pendiente de validación por un supervisor.
              </Alert>
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Revisa los datos antes de confirmar. Una vez guardado, el evento quedará en estado
                "Pendiente" para validación.
              </Alert>
            )}

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Resumen del Evento
            </Typography>

            <Grid container spacing={2}>
              {/* Info básica */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Vehículo
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedVehiculo?.patente} - {selectedVehiculo?.marca}{" "}
                      {selectedVehiculo?.modelo}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Chofer
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedChofer?.nombre} {selectedChofer?.apellido}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Surtidor
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedSurtidor?.codigo} - {selectedSurtidor?.nombre}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Mediciones */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12} sm={4}>
                <Card elevation={0} sx={{ bgcolor: "#1E2C5608" }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Litros
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#1E2C56">
                      {formData.litros} L
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {formData.odometro && (
                /* @ts-expect-error - MUI v7 Grid type incompatibility */
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        Odómetro
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formData.odometro} km
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {formData.horometro && (
                /* @ts-expect-error - MUI v7 Grid type incompatibility */
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        Horómetro
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formData.horometro} hs
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Evidencias */}
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ bgcolor: "#3b82f608", border: "1px solid #3b82f630" }}>
                  <CardContent>
                    <Typography variant="caption" fontWeight={600} color="#3b82f6">
                      📎 Evidencias cargadas
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {formData.evidenciasFotos.length} foto(s)
                      {formData.evidenciaAudio && " • 1 nota de voz"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} variant="outlined">
            Atrás
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{
              bgcolor: "#1E2C56",
              "&:hover": { bgcolor: "#16213E" },
            }}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={<CheckCircleIcon />}
            sx={{
              bgcolor: "#10b981",
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            {loading ? "Guardando..." : "Confirmar y Guardar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
