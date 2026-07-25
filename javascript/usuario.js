document.addEventListener("DOMContentLoaded", function () {

    const nombreUsuario =
        document.getElementById("nombreUsuario");

    const correoUsuario =
        document.getElementById("correoUsuario");

    const btnCerrarSesion =
        document.getElementById("btnCerrarSesion");


    // ==========================================
    // OBTENER DATOS DEL USUARIO
    // ==========================================

    fetch("php/usuario.php", {
        method: "GET",
        cache: "no-store"
    })

    .then(response => {

    if (!response.ok) {
        throw new Error("Error del servidor.");
    }

    return response.json();

})
    .then(data => {

        console.log(
            "Datos recibidos:",
            data
        );


        // ======================================
        // SI NO HAY SESIÓN
        // ======================================

        if (!data.success) {

            alert(
                "No hay una sesión activa."
            );

            window.location.href =
                "inicios_sesion.html";

            return;

        }


        // ======================================
        // MOSTRAR USUARIO
        // ======================================

       nombreUsuario.value =
    data.usuario ?? "";
// ======================================
        // MOSTRAR EL CORREO
        // ======================================

correoUsuario.value =
    data.correo ?? "";
    })

    .catch(error => {

        console.error(
            "Error obteniendo datos:",
            error
        );

        alert(
            "Error al obtener los datos del usuario."
        );

    });



    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    if (btnCerrarSesion) {

        btnCerrarSesion.addEventListener(
            "click",
            function () {


                const confirmar =
                    confirm(
                        "¿Estás seguro de que deseas cerrar sesión?"
                    );


                if (!confirmar) {

                    return;

                }


                fetch(
                    "php/cerrar_sesion.php",
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                )

                .then(response => {

                    return response.json();

                })

                .then(data => {

                    console.log(
                        "Respuesta logout:",
                        data
                    );


                    if (data.success) {

                        window.location.href =
                            "inicios_sesion.html";

                    } else {

                        alert(
                            "No se pudo cerrar la sesión."
                        );

                    }

                })

                .catch(error => {

                    console.error(
                        "Error al cerrar sesión:",
                        error
                    );

                    alert(
                        "Error al conectar con el servidor."
                    );

                });

            }
        );

    }

});