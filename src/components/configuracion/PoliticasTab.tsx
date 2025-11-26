
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import type { PoliticaCombustible } from "../../types/reports";

interface PoliticasTabProps {
  politica: PoliticaCombustible;
  onChange: (politica: PoliticaCombustible) => void;
  onSave: () => void;
}

export default function PoliticasTab({ politica, onChange, onSave }: PoliticasTabProps) {
  return (
    <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          Políticas de Evidencias
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Configure qué evidencias son obligatorias para los eventos de combustible
        </Typography>

        <Grid container spacing={4}>
          {/* Evidencias Fotográficas */}
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid xs={12}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Evidencias Fotográficas
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={politica.evidenciasFotograficas.surtidor}
                    onChange={(e) =>
                      onChange({
                        ...politica,
                        evidenciasFotograficas: {
                          ...politica.evidenciasFotograficas,
                          surtidor: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Foto del Surtidor (Obligatoria)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={politica.evidenciasFotograficas.cuentaLitros}
                    onChange={(e) =>
                      onChange({
                        ...politica,
                        evidenciasFotograficas: {
                          ...politica.evidenciasFotograficas,
                          cuentaLitros: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Foto del Cuenta-Litros (Obligatoria)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={politica.evidenciasFotograficas.odometro}
                    onChange={(e) =>
                      onChange({
                        ...politica,
                        evidenciasFotograficas: {
                          ...politica.evidenciasFotograficas,
                          odometro: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Foto del Odómetro (Para vehículos de transporte)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={politica.evidenciasFotograficas.horometro}
                    onChange={(e) =>
                      onChange({
                        ...politica,
                        evidenciasFotograficas: {
                          ...politica.evidenciasFotograficas,
                          horometro: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Foto del Horómetro (Para maquinaria agrícola)"
              />
            </FormGroup>
          </Grid>

          {/* Otras Evidencias */}
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid xs={12}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Otras Evidencias
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={politica.evidenciaAudio}
                    onChange={(e) => onChange({ ...politica, evidenciaAudio: e.target.checked })}
                  />
                }
                label="Nota de Voz (Obligatoria)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={politica.geolocalizacionObligatoria}
                    onChange={(e) =>
                      onChange({ ...politica, geolocalizacionObligatoria: e.target.checked })
                    }
                  />
                }
                label="Geolocalización GPS (Obligatoria)"
              />
            </FormGroup>

            {politica.geolocalizacionObligatoria && (
              <TextField
                type="number"
                label="Radio de Geovalla (metros)"
                value={politica.radioGeovallaMetros || ""}
                onChange={(e) =>
                  onChange({
                    ...politica,
                    radioGeovallaMetros: parseInt(e.target.value) || undefined,
                  })
                }
                helperText="Distancia máxima permitida desde el surtidor"
                sx={{ mt: 2, maxWidth: 300 }}
              />
            )}
          </Grid>

          {/* Validaciones */}
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid xs={12}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Validaciones
            </Typography>
            <Grid container spacing={2}>
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Litros Máximos por Carga"
                  value={politica.litrosMaximosPorCarga}
                  onChange={(e) =>
                    onChange({ ...politica, litrosMaximosPorCarga: parseInt(e.target.value) })
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position="end">L</InputAdornment>,
                  }}
                />
              </Grid>
              {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
              <Grid xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={politica.validarDuplicados}
                      onChange={(e) =>
                        onChange({ ...politica, validarDuplicados: e.target.checked })
                      }
                    />
                  }
                  label="Validar Eventos Duplicados"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Botón Guardar */}
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={onSave}
                sx={{
                  bgcolor: "#10b981",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                Guardar Políticas
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

