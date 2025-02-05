const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const doctorRoutes = require("./routes/doctor.routes");
const pacienteRoutes = require("./routes/paciente.routes");
const citaRoutes = require("./routes/cita.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/doctores", doctorRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/auth", authRoutes);

// Iniciar servidor npm run dev
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);  //Ruta para probar el backend
});



