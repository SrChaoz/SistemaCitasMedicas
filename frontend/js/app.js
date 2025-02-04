// Configurar la URL base del backend
const BASE_URL = 'http://localhost:5000/api';  // <-- Cambiar 3000 por 5000

// Función para realizar solicitudes al backend
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        // **Verificar si la respuesta es JSON válido**
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Respuesta del servidor:", await response.text()); // Muestra lo que devuelve el servidor
            throw new Error("La respuesta no es un JSON válido");
        }

        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return null;
    }
}



// **Definir correctamente `obtenerPacientes`**
async function obtenerPacientes() {
    return await apiRequest('/pacientes', 'GET');
}

// **Definir correctamente `obtenerCitas`**
async function obtenerCitas() {
    try {
        const response = await fetch(`${BASE_URL}/citas`);
        console.log("📢 Respuesta del servidor:", response); // 🚀 Depuración

        const data = await response.json();
        console.log("📢 Datos recibidos en obtenerCitas():", data); // 🚀 Verificar si hay datos

        if (!Array.isArray(data)) {
            console.error("❌ Error: La API no devolvió un array", data);
            return [];
        }

        return data;
    } catch (error) {
        console.error("❌ Error en obtenerCitas():", error);
        return [];
    }
}


// **Definir correctamente `agendarCita`**
async function agendarCita(pacienteId, doctorId, fecha, hora, estado) {
    return await apiRequest('/citas', 'POST', { pacienteId, doctorId, fecha, hora, estado });
}

async function obtenerCitasDoctor(doctorId) {
    return await apiRequest(`/citas/doctor/${doctorId}`, 'GET');
}

async function completarCita(citaId) {
    return await apiRequest(`/citas/${citaId}`, 'PUT', { estado: 'Completada' });
}

export { obtenerCitasDoctor, completarCita };

// **Exportar todas las funciones correctamente**
export { apiRequest, obtenerPacientes, obtenerCitas, agendarCita };
