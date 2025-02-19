async function login(event) {
    event.preventDefault();  // Evita la recarga de la página al hacer submit

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Ajustar el rol para que coincida con los valores en la base de datos
    const adjustedRole = role === "doctor" ? "medico" : (role === "admin" ? "administrativo" : role);

    // Log para verificar los datos antes de enviarlos al backend
    console.log('Datos enviados al backend:', {
        username, 
        password, 
        rol: adjustedRole
    });

    try {
        // Asegúrate de usar la URL correcta para el backend (localhost:5000)
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rol: adjustedRole })  // Enviamos el rol ajustado
        });

        const data = await response.json();

        if (response.ok) {
            // Si el login es exitoso, verificamos el rol y redirigimos
            if (adjustedRole === "medico") {
                window.location.href = "doctor_dashboard.html";
                localStorage.setItem("id_medico", data.id_medico);
            } else if (adjustedRole === "administrativo") {
                window.location.href = "admin_dashboard.html";
            }
        } else {
            // Si el login no es exitoso
            document.getElementById("error-message").innerText = "Credenciales incorrectas.";
        }
    } catch (error) {
        console.error("Error en el login:", error);
        document.getElementById("error-message").innerText = "Hubo un problema al intentar iniciar sesión.";
    }
}



// Función para obtener las citas del médico, si es necesario
async function getCitas(id_medico) {
    try {
        const citasResponse = await fetch('http://localhost:5000/api/citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_medico })
        });

        const citas = await citasResponse.json();
        console.log("Citas del médico:", citas);
    } catch (error) {
        console.error("Error al obtener citas:", error);
    }
}




/*
import { apiRequest } from './app.js';

// Función para iniciar sesión
async function loginUser(email, password) {
    const response = await apiRequest('/auth/login', 'POST', { email, password });

    if (response && response.token) {
        localStorage.setItem('token', response.token);
        alert('Inicio de sesión exitoso');
        window.location.href = 'admin_dashboard.html'; // Redirigir después de login
    } else {
        alert('Credenciales incorrectas');
    }
}

// Evento del formulario de login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await loginUser(email, password);
});
*/