function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    
    if (username === "admin" && password === "admin123" && role === "admin") {
        window.location.href = "admin_dashboard.html";
    } else if (username === "doctor" && password === "doctor123" && role === "doctor") {
        window.location.href = "doctor_dashboard.html";
    } else {
        document.getElementById("error-message").innerText = "Credenciales incorrectas.";
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