# SRS – Agente de WhatsApp para Registro de Combustible y Dashboard

**Fecha:** 2025-10-23
**Tecnologías:** React (Front), C# .NET (APIs), SQL Server (BD).

---

## 1. Objetivo

Implementar un sistema que reemplace las planillas manuales de combustible mediante un agente de WhatsApp, capturando datos estructurados y evidencias (texto, audio, fotos, ubicación) para alimentar un dashboard y reportes, con frontoffice para administración y habilitación de usuarios.

## 2. Alcance

- **MVP:** Captura vía WhatsApp, dashboard básico, reportes estándar, ABM de usuarios y vehículos.
- **Futuro:** OCR para odómetro/cuenta-litros, alertas inteligentes, integración con contabilidad.

---

## 3. Requerimientos Funcionales

### 3.1 Captura por WhatsApp

- **Autenticación:** Validación de usuarios por _whitelist_ desde frontoffice.
- **Flujo guiado:** 'cargar combustible' abre secuencia de datos requeridos.
- **Datos obligatorios configurables:** Vehículo/maquinaria, surtidor/tanque, litros, fecha/hora, geolocalización.
- **Evidencias:** Fotos de surtidor, cuenta-litros, odómetro o horómetro, audio opcional, ubicación.
- **Confirmación:** Resumen de carga + ID de evento.
- **Validaciones de consistencia:** Litros máximos, duplicados, ubicación válida.

### 3.2 Frontoffice (React)

- **ABM:** Empresas, vehículos, usuarios, surtidores y tanques.
- **Configuración de políticas:** Evidencias obligatorias, umbrales, precios de combustible.
- **Dashboard:** KPIs y reportes.
- **Control de acceso:** Roles (operador, supervisor, auditor).

### 3.3 Reportes sugeridos

- Consumo por vehículo (L/100km, L/hora).
- Litros por surtidor/tanque y por operador.
- Costos por centro de costos / lote / labor.
- Análisis de desvíos (fuera de rango, anomalías).
- Ranking de eficiencia y trazabilidad de evidencias.

---

## 4. Requerimientos No Funcionales

- **Escalabilidad:** Multi-empresa (multi-tenant).
- **Disponibilidad:** 99.5%.
- **Seguridad:** JWT, cifrado TLS, control por roles.
- **Auditoría:** Trazabilidad de eventos.
- **Observabilidad:** Logs estructurados y métricas.
- **Rendimiento:** API < 300ms (p95).
- **Portabilidad:** Cloud-agnostic (Docker + blob storage).

---

## 5. Modelo de Datos

**Entidades principales:**
`Empresa`, `Usuario`, `Vehículo`, `Surtidor`, `Tanque`, `CentroCosto`, `EventoCarga`, `Evidencia`, `Alerta`, `AuditLog`.

---

## 6. APIs (C# .NET)

- `POST /webhooks/whatsapp` – Recepción de mensajes.
- `POST /api/eventos` – Crear evento.
- `GET /api/eventos` – Listar eventos con filtros.
- `GET /api/reportes/{tipo}` – Reportes en Excel/PDF.
- **CRUD de ABM:** empresas, usuarios, vehículos, surtidores, tanques, centros de costo.

---

## 7. Dashboard (React)

**KPIs:** Litros totales, costo total, consumo promedio, stock por tanque, % eventos validados, alertas abiertas.

**Visualizaciones:**

- Series temporales.
- Barras por vehículo/surtidor.
- Mapa de cargas.
- Outliers.
- Trazabilidad de fotos.

---

## 8. Roadmap

| Sprint  | Foco                                         |
| :------ | :------------------------------------------- |
| **1-2** | WhatsApp webhook + persistencia básica.      |
| **3-4** | Evidencias y dashboard inicial.              |
| **5-6** | Reportes avanzados y alertas.                |
| **7+**  | OCR, IA predictiva, integraciones contables. |
