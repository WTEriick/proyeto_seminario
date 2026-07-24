document.addEventListener("DOMContentLoaded", function () {

    console.log("inicio.js cargado correctamente");


    // ==========================================
    // BOTÓN CREAR CUENTA
    // ==========================================

    const btnCrearCuenta =
        document.getElementById("btnCrearCuenta");


    if (btnCrearCuenta) {

        btnCrearCuenta.addEventListener("click", function () {

            window.location.href = "registro.html";

        });

    }


    // ==========================================
    // MOSTRAR / OCULTAR CONTRASEÑA
    // ==========================================

    const mostrarPassword =
        document.getElementById("mostrarPassword");

    const password =
        document.getElementById("password");


    if (mostrarPassword && password) {

        mostrarPassword.addEventListener("click", function () {

            if (password.type === "password") {

                password.type = "text";

                mostrarPassword.title =
                    "Ocultar contraseña";

            } else {

                password.type = "password";

                mostrarPassword.title =
                    "Mostrar contraseña";

            }

        });

    }


    // ==========================================
    // BOTÓN OLVIDÉ MI CONTRASEÑA
    // ==========================================

    const btnOlvidePassword =
        document.getElementById("btnOlvidePassword");


    if (btnOlvidePassword) {

        btnOlvidePassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "La recuperación de contraseña estará disponible próximamente."
                );

            }
        );

    }

});