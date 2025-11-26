import { useState } from "react";

import { Box, Typography, Tabs, Tab, Card, Alert } from "@mui/material";
import PolicyIcon from "@mui/icons-material/Policy";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NotificationsIcon from "@mui/icons-material/Notifications";

import PoliticasTab from "../../configuracion/PoliticasTab";
import PreciosTab from "../../configuracion/PreciosTab";
import UmbralesTab from "../../configuracion/UmbralesTab";
import AlertasTab from "../../configuracion/AlertasTab";

import {
  mockPolitica,
  mockPrecios,
  mockUmbrales,
  mockConfiguracionesAlertas,
} from "../../../utils/mockPoliticas";
import type {
  PoliticaCombustible,
  PrecioCombustible,
  UmbralVehiculo,
  ConfiguracionAlerta,
} from "../../../types/reports";

export default function Configuracion() {
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(false);

  // Estados
  const [politica, setPolitica] = useState<PoliticaCombustible>(mockPolitica);
  const [precios, setPrecios] = useState<PrecioCombustible[]>(mockPrecios);
  const [umbrales, setUmbrales] = useState<UmbralVehiculo[]>(mockUmbrales);
  const [configuracionesAlertas, setConfiguracionesAlertas] = useState<
    ConfiguracionAlerta[]
  >(mockConfiguracionesAlertas);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log("Configuración guardada");
  };

  const handleToggleAlerta = (config: ConfiguracionAlerta | undefined) => {
    if (config) {
      setConfiguracionesAlertas(
        configuracionesAlertas.map((c) =>
          c.id === config.id ? { ...c, habilitada: !c.habilitada } : c
        )
      );
      handleSave();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
          Configuración
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestión de políticas, precios, umbrales y alertas
        </Typography>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ Configuración guardada exitosamente
        </Alert>
      )}

      {/* Tabs */}
      <Card
        elevation={0}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 3 }}
      >
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #e0e0e0",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
            },
          }}
        >
          <Tab
            icon={<PolicyIcon />}
            iconPosition="start"
            label="Políticas de Evidencias"
          />
          <Tab
            icon={<LocalGasStationIcon />}
            iconPosition="start"
            label="Precios de Combustible"
          />
          <Tab
            icon={<DirectionsCarIcon />}
            iconPosition="start"
            label="Umbrales por Vehículo"
          />
          <Tab
            icon={<NotificationsIcon />}
            iconPosition="start"
            label="Alertas"
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {tab === 0 && (
        <PoliticasTab
          politica={politica}
          onChange={setPolitica}
          onSave={handleSave}
        />
      )}

      {tab === 1 && (
        <PreciosTab
          precios={precios}
          onUpdate={setPrecios}
          onSave={handleSave}
        />
      )}

      {tab === 2 && (
        <UmbralesTab
          umbrales={umbrales}
          onUpdate={setUmbrales}
          onSave={handleSave}
        />
      )}

      {tab === 3 && (
        <AlertasTab
          configuraciones={configuracionesAlertas}
          onToggle={handleToggleAlerta}
        />
      )}
    </Box>
  );
}
