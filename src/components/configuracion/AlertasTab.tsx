import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import type { ConfiguracionAlerta } from "../../types/reports";

interface AlertasTabProps {
  configuraciones: ConfiguracionAlerta[];
  onToggle: (tipoAlerta: string, config: ConfiguracionAlerta | undefined) => void;
}

export default function AlertasTab({ configuraciones, onToggle }: AlertasTabProps) {
  return (
    <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          Configuración de Alertas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Habilite y configure las alertas automáticas del sistema
        </Typography>

        <Grid container spacing={3}>
          {configuraciones.map((config) => (
            <Grid item xs={12} md={6} key={config.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <NotificationsIcon color={config.habilitada ? "primary" : "disabled"} />
                      <Typography variant="h6">
                        {config.tipoAlerta
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </Typography>
                    </Box>
                    <Switch
                      checked={config.habilitada}
                      onChange={() => onToggle(config.tipoAlerta, config)}
                    />
                  </Box>

                  {config.habilitada && (
                    <>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Severidad</InputLabel>
                        <Select value={config.severidad} label="Severidad">
                          <MenuItem value="alta">Alta</MenuItem>
                          <MenuItem value="media">Media</MenuItem>
                          <MenuItem value="baja">Baja</MenuItem>
                        </Select>
                      </FormControl>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1 }}
                      >
                        Destinatarios: {config.destinatarios.length} usuarios
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Condiciones:{" "}
                        {JSON.stringify(config.condiciones)
                          .replace(/[{}"]/g, "")
                          .slice(0, 50)}
                        ...
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
