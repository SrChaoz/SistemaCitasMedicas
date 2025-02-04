import { apiRequest, obtenerPacientes, obtenerCitas, agendarCita } from './app.js';

// Función para mostrar pacientes
async function mostrarPacientes() {
    try {
        const listaPacientes = document.getElementById('listaPacientes');

        if (!listaPacientes) {
            console.warn("No se encontró el elemento listaPacientes. Asegúrate de estar en la página correcta.");
            return;
        }

        const pacientes = await obtenerPacientes();
        listaPacientes.innerHTML = ''; // Limpiar lista antes de agregar nuevos elementos

        pacientes.forEach(paciente => {
            listaPacientes.innerHTML += `<li>${paciente.nombre} ${paciente.apellido} - Tel: ${paciente.telefono} - Dir: ${paciente.direccion}</li>`;
        });

    } catch (error) {
        console.error("Error al obtener pacientes:", error);
    }
}



// Función para mostrar citas agendadas
async function mostrarCitas() {
    try {
        const listaCitas = document.getElementById('listaCitas');

        if (!listaCitas) {
            console.warn("⚠️ No se encontró el elemento listaCitas. Asegúrate de estar en la página correcta.");
            return;
        }

        const citas = await obtenerCitas();
        console.log("📢 Citas obtenidas del backend:", citas); // 🚀 Verificar si hay datos

        listaCitas.innerHTML = ''; // Limpiar lista antes de agregar nuevos elementos

        if (!Array.isArray(citas)) {
            console.error("❌ Error: `citas` no es un array", citas);
            listaCitas.innerHTML = '<li>Error al obtener citas.</li>';
            return;
        }

        if (citas.length === 0) {
            listaCitas.innerHTML = '<li>No hay citas registradas.</li>';
            return;
        }

        citas.forEach(cita => {
            listaCitas.innerHTML += `
                <li>
                    <strong>Paciente:</strong> ${cita.paciente} - <strong>Doctor:</strong> ${cita.doctor} <br>
                    <strong>Fecha:</strong> ${cita.fecha} - <strong>Hora:</strong> ${cita.hora} <br>
                    <strong>Estado:</strong> ${cita.estado}
                </li>`;
        });

    } catch (error) {
        console.error("❌ Error al obtener citas:", error);
        listaCitas.innerHTML = '<li>Error al cargar las citas.</li>';
    }
}

console.log("📢 admin.js ha sido cargado correctamente.");

document.addEventListener('DOMContentLoaded', () => {
    console.log("📢 DOM cargado, ejecutando mostrarCitas()");

    const listaCitas = document.getElementById('listaCitas');

    if (listaCitas) {
        console.log("📢 `listaCitas` detectado, ejecutando `mostrarCitas()`.");
        mostrarCitas(); // <-- FORZAMOS la ejecución aquí
    } else {
        console.warn("⚠️ `listaCitas` no encontrado en el DOM.");
    }
});


// Función para agregar un nuevo paciente
async function nuevoPaciente(event) {
    event.preventDefault();
    console.log("Formulario enviado");

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;

    console.log("Datos capturados:", { nombre, apellido, telefono, direccion });

    try {
        const response = await fetch('http://localhost:5000/api/pacientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, telefono, direccion })
        });

        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al agregar paciente");
        }

        const data = await response.json();
        console.log("Paciente agregado:", data);
        alert(`Paciente ${data.nombre} agregado correctamente.`);
        document.getElementById('formNuevoPaciente').reset();
        mostrarPacientes();

    } catch (error) {
        console.error("Error en el fetch:", error.message);
        alert("No se pudo agregar el paciente. Verifica la consola.");
    }
}

// Función para agendar una nueva cita
async function nuevaCita(event) {
    event.preventDefault();

    const id_paciente = document.getElementById('pacienteId').value;
    const id_doctor = document.getElementById('doctorId').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const estado = document.getElementById('estado').value;

    // **Verifica los datos antes de enviarlos**
    console.log("Datos capturados para nueva cita:", { id_paciente, id_doctor, fecha, hora, estado });

    try {
        const response = await fetch('http://localhost:5000/api/citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_paciente, id_doctor, fecha, hora, estado })
        });

        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al agendar cita");
        }

        const data = await response.json();
        console.log("Cita agendada:", data);
        alert("Cita agendada correctamente.");
        mostrarCitas();

    } catch (error) {
        console.error("Error al agendar cita:", error.message);
        alert("No se pudo agendar la cita. Verifica la consola.");
    }
}


console.log("Script admin.js cargado");
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado");

    const formPaciente = document.getElementById('formNuevoPaciente');
    if (formPaciente) {
        console.log("Formulario de paciente detectado");
        formPaciente.addEventListener('submit', nuevoPaciente);
    } else {
        console.warn("No se encontró el formulario de paciente. Esto es normal si no estás en la página de pacientes.");
    }

    const formCita = document.getElementById('formNuevaCita');
    if (formCita) {
        console.log("Formulario de cita detectado");
        formCita.addEventListener('submit', nuevaCita);
    } else {
        console.warn("No se encontró el formulario de cita. Esto es normal si no estás en la página de citas.");
    }

    // Solo ejecutar `mostrarPacientes()` si el elemento `listaPacientes` existe
    if (document.getElementById('listaPacientes')) {
        mostrarPacientes();
    }

    // Solo ejecutar `mostrarCitas()` si el formulario de citas existe
    if (document.getElementById('formNuevaCita')) {
        mostrarCitas();
    }
});

console.log("📢 admin.js ha sido cargado correctamente.");

