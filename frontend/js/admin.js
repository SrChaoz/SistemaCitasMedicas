import { apiRequest, obtenerPacientes, obtenerCitas, agendarCita } from './app.js';


// Función para cargar pacientes en el select
async function cargarPacientes() {
    const pacientes = await apiRequest('/pacientes', 'GET');
    const selectPacientes = document.getElementById('pacienteId');

    if (!selectPacientes) return;

    selectPacientes.innerHTML = '<option value="">Selecciona un paciente</option>';

    pacientes.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.id_paciente;
        option.textContent = `${paciente.nombre} ${paciente.apellido}`;
        selectPacientes.appendChild(option);
    });
}

// Función para cargar doctores en el select
async function cargarDoctores() {
    const doctores = await apiRequest('/doctores', 'GET');
    const selectDoctores = document.getElementById('doctorId');

    if (!selectDoctores) return;

    selectDoctores.innerHTML = '<option value="">Selecciona un doctor</option>';

    doctores.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id_doctor;
        option.textContent = `Dr. ${doctor.nombre} ${doctor.apellido}`;
        selectDoctores.appendChild(option);
    });
}

// Función para enviar el formulario de nueva cita
async function nuevaCita(event) {
    event.preventDefault();

    const pacienteId = document.getElementById('pacienteId').value;
    const doctorId = document.getElementById('doctorId').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const estado = document.getElementById('estado').value;

    if (!pacienteId || !doctorId) {
        alert("Por favor, selecciona un paciente y un doctor.");
        return;
    }

    const response = await apiRequest('/citas', 'POST', { 
        id_paciente: pacienteId, 
        id_doctor: doctorId, 
        fecha, 
        hora, 
        estado 
    });

    if (response && !response.error) {
        alert("Cita agendada correctamente.");
        document.getElementById('formNuevaCita').reset();
    } else {
        alert("Hubo un error al agendar la cita.");
    }
}

//  Ejecutar funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log("Cargando lista de pacientes y doctores...");
    cargarPacientes();
    cargarDoctores();

    const formCita = document.getElementById('formNuevaCita');
    if (formCita) {
        formCita.addEventListener('submit', nuevaCita);
    }
});
// Función para mostrar pacientes
async function mostrarPacientes() {
    try {
        const pacientes = await obtenerPacientes();
        console.log("Pacientes recibidos:", pacientes);

        const tablaPacientes = document.getElementById('tablaPacientes').querySelector('tbody');

        if (!tablaPacientes) {
            console.warn("No se encontró `tablaPacientes`. Verifica el HTML.");
            return;
        }

        tablaPacientes.innerHTML = ''; // Limpiar tabla antes de agregar nuevos elementos

        pacientes.forEach(paciente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paciente.id_paciente}</td>
                <td>${paciente.nombre}</td>
                <td>${paciente.apellido}</td>
                <td>${paciente.telefono}</td>
                <td>${paciente.direccion}</td>
            `;
            tablaPacientes.appendChild(row);
        });

        console.log("Pacientes mostrados en la tabla.");
    } catch (error) {
        console.error(" Error al obtener pacientes:", error);
    }
}

// Función para mostrar citas en una tabla
async function mostrarCitas() {
    try {
        const citas = await obtenerCitas();
        console.log("Citas recibidas:", citas);

        const tablaCitas = document.getElementById('tablaCitas').querySelector('tbody');

        if (!tablaCitas) {
            console.warn(" No se encontró `tablaCitas`. Verifica el HTML.");
            return;
        }

        tablaCitas.innerHTML = ''; // Limpiar tabla antes de agregar nuevos elementos

        citas.forEach(cita => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cita.id_cita}</td>
                <td>${cita.paciente}</td>
                <td>${cita.doctor}</td>
                <td>${new Date(cita.fecha).toLocaleDateString()}</td>
                <td>${cita.hora}</td>
                <td>${cita.estado}</td>
            `;
            tablaCitas.appendChild(row);
        });

        console.log(" Citas mostradas en la tabla.");
    } catch (error) {
        console.error("Error al obtener citas:", error);
    }
}

// Ejecutar funciones cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, mostrando datos en tablas.");

    if (document.getElementById('tablaPacientes')) {
        mostrarPacientes();
    }

    if (document.getElementById('tablaCitas')) {
        mostrarCitas();
    }
});

console.log(" admin.js ha sido cargado correctamente.");

document.addEventListener('DOMContentLoaded', () => {
    console.log(" DOM cargado, ejecutando mostrarCitas()");

    const listaCitas = document.getElementById('listaCitas');

    if (listaCitas) {
        console.log("`listaCitas` detectado, ejecutando `mostrarCitas()`.");
        mostrarCitas(); // <-- FORZAMOS la ejecución aquí
    } else {
        console.warn(" `listaCitas` no encontrado en el DOM.");
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

// Función para agregar un nuevo doctor
async function nuevoDoctor(event) {
    event.preventDefault();
    console.log("Enviando solicitud para registrar un nuevo doctor...");

    const nombre = document.getElementById('nombreDoctor').value;
    const apellido = document.getElementById('apellidoDoctor').value;
    const telefono = document.getElementById('telefonoDoctor').value;

    console.log("Datos Capturados:", { nombre, apellido, telefono });

    try {
        const response = await fetch('http://localhost:5000/api/doctores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, telefono })
        });

        console.log("Respuesta del Servidor:", response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al registrar el doctor");
        }

        const data = await response.json();
        console.log("Doctor Registrado:", data);
        alert(`Doctor ${data.nombre} ${data.apellido} agregado correctamente.`);
        document.getElementById('formNuevoDoctor').reset();

    } catch (error) {
        console.error("Error en el fetch:", error.message);
        alert("No se pudo registrar el doctor. Verifica la consola.");
    }
}

// Ejecutar funciones cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, verificando formularios...");

    const formDoctor = document.getElementById('formNuevoDoctor');
    if (formDoctor) {
        console.log("Formulario de doctor detectado.");
        formDoctor.addEventListener('submit', nuevoDoctor);
    } else {
        console.warn("No se encontró el formulario de doctor. Esto es normal si no estás en la página de doctores.");
    }
});

// Función para obtener y mostrar la lista de doctores
async function mostrarDoctores() {
    try {
        console.log("Obteniendo lista de doctores...");
        const doctores = await apiRequest('/doctores', 'GET');
        console.log("Doctores recibidos:", doctores);

        const tablaDoctores = document.getElementById('tablaDoctores').querySelector('tbody');

        if (!tablaDoctores) {
            console.warn("No se encontró `tablaDoctores`. Verifica el HTML.");
            return;
        }

        tablaDoctores.innerHTML = ''; // Limpiar tabla antes de agregar nuevos elementos

        if (!Array.isArray(doctores) || doctores.length === 0) {
            tablaDoctores.innerHTML = '<tr><td colspan="4">No hay doctores registrados.</td></tr>';
            return;
        }

        doctores.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.id_doctor}</td>
                <td>${doctor.nombre}</td>
                <td>${doctor.apellido}</td>
                <td>${doctor.telefono ? doctor.telefono : 'N/A'}</td>
            `;
            tablaDoctores.appendChild(row);
        });

        console.log("📢 Doctores mostrados en la tabla.");
    } catch (error) {
        console.error(" Error al obtener doctores:", error);
    }
}

// Ejecutar funciones cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, verificando página...");

    if (document.getElementById('tablaDoctores')) {
        console.log("`tablaDoctores` detectado, ejecutando `mostrarDoctores()`.");
        mostrarDoctores();
    }
});

/*
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
*/

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

console.log(" admin.js ha sido cargado correctamente.");

