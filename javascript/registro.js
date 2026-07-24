// Espera a que cargue la página
document.addEventListener("DOMContentLoaded", iniciarEventos);

function iniciarEventos() {

    document
        .getElementById("btnIniciarSesion")
        .addEventListener("click", regresarLogin);

}

function regresarLogin(evento){

    evento.preventDefault();

    window.location.href = "inicios_sesion.html"; 

}