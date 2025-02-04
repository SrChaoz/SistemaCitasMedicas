import { apiRequest } from './app.js';

// 📌 Función para obtener citas del doctor y mostrarlas en una tabla
async function obtenerCitasDoctor(doctorId) {
    console.log("📢 Solicitando citas para el doctor ID:", doctorId);

    const citas = await apiRequest(`/citas/doctor/${doctorId}`, 'GET');
    console.log("📢 Citas recibidas:", citas);

    const tablaCitas = document.getElementById('tablaCitas').querySelector('tbody');

    if (!tablaCitas) {
        console.warn("⚠️ No se encontró `tablaCitas`. Verifica el HTML.");
        return;
    }

    tablaCitas.innerHTML = '';

    if (!Array.isArray(citas) || citas.length === 0) {
        tablaCitas.innerHTML = '<tr><td colspan="6">No hay citas registradas.</td></tr>';
        return;
    }

    citas.forEach(cita => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cita.id_cita}</td>
            <td>${cita.paciente}</td>
            <td>${new Date(cita.fecha).toLocaleDateString()}</td>
            <td>${cita.hora}</td>
            <td>${cita.estado}</td>
            <td>
                ${cita.estado === "Pendiente" ? `<button data-id="${cita.id_cita}" class="btnCompletar">✔ Completar</button>` : "✅ Completada"}
            </td>
        `;
        tablaCitas.appendChild(row);
    });

    // 🚀 Agregar eventos a los botones de completar cita
    document.querySelectorAll('.btnCompletar').forEach(button => {
        button.addEventListener('click', async (event) => {
            const citaId = event.target.dataset.id;
            console.log("📢 Botón presionado para cita:", citaId);

            await completarCita(citaId);
            console.log("📢 Cita marcada como completada. Recargando citas...");
            obtenerCitasDoctor(doctorId); // Recargar la tabla
        });
    });

    console.log("✅ Citas mostradas en la tabla.");
}

// 📌 Función para marcar cita como completada
async function completarCita(citaId) {
    console.log("📢 Enviando solicitud para completar la cita ID:", citaId);
    
    const response = await apiRequest(`/citas/${citaId}`, 'PUT', { estado: 'Completada' });

    if (!response || response.error) {
        console.error("❌ Error al completar la cita:", response);
        alert("Hubo un error al completar la cita.");
        return;
    }

    console.log("✅ Cita completada correctamente:", response);
    alert("Cita completada correctamente.");
}

// 📌 Evento para el botón de buscar citas
document.getElementById("buscarCitas").addEventListener("click", () => {
    const doctorId = document.getElementById("doctorId").value;

    if (!doctorId) {
        alert("Por favor, ingrese un ID de doctor válido.");
        return;
    }

    obtenerCitasDoctor(doctorId);
});

console.log("📢 doctor.js cargado correctamente.");

/*import { apiRequest } from './app.js';

// Obtener citas del doctor
async function obtenerCitasDoctor(doctorId) {
    console.log("📢 Solicitando citas para el doctor:", doctorId); // ✅ Verifica que la función se ejecuta

    const citas = await apiRequest(`/citas/doctor/${doctorId}`, 'GET');
    console.log("📢 Citas recibidas en el frontend:", citas); // ✅ Verifica si llegan citas

    const listaCitas = document.getElementById('listaCitas');

    if (!listaCitas) {
        console.warn("⚠️ No se encontró `listaCitas`. Verifica el HTML.");
        return;
    }

    listaCitas.innerHTML = '';

    if (!Array.isArray(citas) || citas.length === 0) {
        listaCitas.innerHTML = '<li>No hay citas registradas.</li>';
        return;
    }

    citas.forEach(cita => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Paciente:</strong> ${cita.paciente} <br>
            <strong>Fecha:</strong> ${new Date(cita.fecha).toLocaleDateString()} - <strong>Hora:</strong> ${cita.hora} <br>
            <strong>Estado:</strong> ${cita.estado} <br>
            ${cita.estado === "Pendiente" ? `<button data-id="${cita.id_cita}" class="btnCompletar">Marcar como Completada</button>` : ""}
        `;
        listaCitas.appendChild(li);
    });

    // Agregar eventos a los botones
    document.querySelectorAll('.btnCompletar').forEach(button => {
        button.addEventListener('click', async (event) => {
            const citaId = event.target.dataset.id;
            console.log("📢 Marcando como completada la cita:", citaId);
            await completarCita(citaId);
            obtenerCitasDoctor(doctorId); // Recargar la lista
        });
    });
}

// Marcar cita como completada
async function completarCita(citaId) {
    const response = await apiRequest(`/citas/${citaId}`, 'PUT', { estado: 'Completada' });
    console.log("📢 Respuesta al completar cita:", response);
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    console.log("📢 DOM cargado, ejecutando obtenerCitasDoctor().");

    const doctorId = localStorage.getItem('doctorId'); // Asumiendo que se guarda en el login
    if (doctorId) {
        obtenerCitasDoctor(doctorId);
    } else {
        console.warn("⚠️ No se encontró `doctorId` en localStorage.");
    }
});
*/