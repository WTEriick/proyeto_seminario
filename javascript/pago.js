document.addEventListener("DOMContentLoaded", function () {

    console.log("pago.js cargado correctamente");

    const formulario = document.getElementById("paymentForm");
    const mensajeExito = document.getElementById("successMessage");
    const botonSeguir = document.getElementById("continueBtn");

    const contenedorProductos =
        document.getElementById("contenedor-productos-pago");

    const txtSubtotal =
        document.getElementById("pago-subtotal");

    const txtIva =
        document.getElementById("pago-iva");

    const txtEnvio =
        document.getElementById("pago-envio");

    const txtTotal =
        document.getElementById("pago-total");

    const badgeCarrito =
        document.getElementById("cant-badge");

    const botonFinalizar =
        document.getElementById("btn-finalizar");


    let carritoActual = [];

    const COSTO_ENVIO = 0;

    const PORCENTAJE_IVA = 0.16;


    // ==========================================
    // CARGAR CARRITO
    // ==========================================

    function cargarResumenPedido() {

        fetch("php/obtener_carrito.php", {
            method: "GET",
            credentials: "include"
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "No se pudo conectar con el servidor."
                );

            }

            return response.json();

        })

        .then(function (data) {

            console.log(
                "Carrito recibido:",
                data
            );


            if (!data.success) {

                alert(
                    data.message ||
                    "No se pudo cargar el carrito."
                );

                return;

            }


            carritoActual =
                data.productos || [];


            mostrarProductos();

        })

        .catch(function (error) {

            console.error(
                "Error al cargar carrito:",
                error
            );

            alert(
                "No se pudo cargar el carrito."
            );

        });

    }


    // ==========================================
    // MOSTRAR PRODUCTOS
    // ==========================================

    function mostrarProductos() {

        contenedorProductos.innerHTML = "";


        if (
            carritoActual.length === 0
        ) {

            contenedorProductos.innerHTML = `
                <p>
                    El carrito está vacío.
                </p>
            `;

            badgeCarrito.textContent = "0";

            actualizarTotales(0);

            if (botonFinalizar) {

                botonFinalizar.disabled = true;

            }

            return;

        }


        let subtotal = 0;

        let cantidadTotal = 0;


        carritoActual.forEach(
            function (producto) {

                const precio =
                    parseFloat(
                        producto.precio
                    ) || 0;


                const cantidad =
                    parseInt(
                        producto.cantidad
                    ) || 0;


                const importe =
                    precio *
                    cantidad;


                subtotal +=
                    importe;


                cantidadTotal +=
                    cantidad;


                const rutaImagen =
                    "../imagenes/" +
                    producto.imagen;


                const productoHTML = `

                    <div class="producto-resumen-item">

                        <img
                            src="${rutaImagen}"
                            alt="${producto.nombre}"
                            class="imagen-producto-pago"
                            onerror="this.style.display='none';"
                        >

                        <div class="info-producto-pago">

                            <h4>
                                ${producto.nombre}
                            </h4>

                            <small>
                                Cantidad: ${cantidad}
                            </small>

                            <small>
                                Precio: $${precio.toFixed(2)}
                            </small>

                        </div>

                        <strong>
                            $${importe.toFixed(2)}
                        </strong>

                    </div>

                `;


                contenedorProductos.insertAdjacentHTML(
                    "beforeend",
                    productoHTML
                );

            }
        );


        badgeCarrito.textContent =
            cantidadTotal;


        actualizarTotales(
            subtotal
        );

    }


    // ==========================================
    // CALCULAR TOTALES
    // ==========================================

    function actualizarTotales(
        subtotal
    ) {

        const iva =
            subtotal *
            PORCENTAJE_IVA;


        const total =
            subtotal +
            iva +
            COSTO_ENVIO;


        txtSubtotal.textContent =
            "$" +
            subtotal.toFixed(2);


        txtIva.textContent =
            "$" +
            iva.toFixed(2);


        txtEnvio.textContent =
            "$" +
            COSTO_ENVIO.toFixed(2);


        txtTotal.textContent =
            "$" +
            total.toFixed(2);

    }


    // ==========================================
    // MÉTODO DE PAGO
    // ==========================================

    const metodosPago =
        document.querySelectorAll(
            'input[name="metodo_pago"]'
        );


    metodosPago.forEach(
        function (metodo) {

            metodo.addEventListener(
                "change",
                function () {

                    const tarjeta =
                        document.getElementById(
                            "tarjeta"
                        );

                    const expiracion =
                        document.getElementById(
                            "expiracion"
                        );

                    const cvv =
                        document.getElementById(
                            "cvv"
                        );

                    const nombreTarjeta =
                        document.getElementById(
                            "nombre-tarjeta"
                        );


                    if (
                        this.value === "paypal"
                    ) {

                        tarjeta.required = false;
                        expiracion.required = false;
                        cvv.required = false;
                        nombreTarjeta.required = false;

                        tarjeta.disabled = true;
                        expiracion.disabled = true;
                        cvv.disabled = true;
                        nombreTarjeta.disabled = true;

                    } else {

                        tarjeta.required = true;
                        expiracion.required = true;
                        cvv.required = true;
                        nombreTarjeta.required = true;

                        tarjeta.disabled = false;
                        expiracion.disabled = false;
                        cvv.disabled = false;
                        nombreTarjeta.disabled = false;

                    }

                }
            );

        }
    );


    // ==========================================
    // FINALIZAR COMPRA
    // ==========================================

    if (formulario) {

        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                console.log(
                    "Botón Finalizar Compra presionado."
                );


                if (
                    carritoActual.length === 0
                ) {

                    alert(
                        "Tu carrito está vacío."
                    );

                    return;

                }


                if (
                    !formulario.checkValidity()
                ) {

                    formulario.reportValidity();

                    return;

                }


                const metodoSeleccionado =
                    document.querySelector(
                        'input[name="metodo_pago"]:checked'
                    );


                if (!metodoSeleccionado) {

                    alert(
                        "Selecciona un método de pago."
                    );

                    return;

                }


                if (botonFinalizar) {

                    botonFinalizar.disabled =
                        true;

                    botonFinalizar.textContent =
                        "Procesando compra...";

                }


                // ==================================
                // DATOS DEL PAGO
                // ==================================

                const datosPago = {

                    metodo_pago:
                        metodoSeleccionado.value,

                    nombre:
                        document.getElementById(
                            "nombre-fact"
                        ).value,

                    apellido:
                        document.getElementById(
                            "apellido-fact"
                        ).value,

                    email:
                        document.getElementById(
                            "email-fact"
                        ).value,

                    direccion:
                        document.getElementById(
                            "direccion-fact"
                        ).value,

                    ciudad:
                        document.getElementById(
                            "ciudad-fact"
                        ).value,

                    codigo_postal:
                        document.getElementById(
                            "cp-fact"
                        ).value

                };


                console.log(
                    "Enviando compra:",
                    datosPago
                );


                // ==================================
                // ENVIAR COMPRA
                // ==================================

                fetch(
                    "php/realizar_compra.php",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body:
                            JSON.stringify(
                                datosPago
                            )

                    }
                )

                .then(function (respuesta) {

                    return respuesta.text();

                })

                .then(function (texto) {

                    console.log(
                        "Respuesta de PHP:",
                        texto
                    );


                    let resultado;


                    try {

                        resultado =
                            JSON.parse(texto);

                    } catch (error) {

                        console.error(
                            "Respuesta no válida:",
                            texto
                        );

                        throw new Error(
                            "El servidor no devolvió una respuesta válida."
                        );

                    }


                    if (
                        resultado.success === true
                    ) {

                        console.log(
                            "Compra realizada correctamente."
                        );


                        formulario.style.display =
                            "none";


                        mensajeExito.style.display =
                            "block";


                        badgeCarrito.textContent =
                            "0";


                        carritoActual = [];


                    } else {

                        throw new Error(
                            resultado.message ||
                            "No se pudo realizar la compra."
                        );

                    }

                })

                .catch(function (error) {

                    console.error(
                        "Error al realizar compra:",
                        error
                    );


                    alert(
                        error.message
                    );


                    if (botonFinalizar) {

                        botonFinalizar.disabled =
                            false;

                        botonFinalizar.textContent =
                            "✓ Finalizar Compra";

                    }

                });

            }
        );

    }


    // ==========================================
    // VOLVER AL MENÚ
    // ==========================================

    if (botonSeguir) {

        botonSeguir.addEventListener(
            "click",
            function () {

                window.location.href =
                    "menu.html";

            }
        );

    }


    // ==========================================
    // INICIAR
    // ==========================================

    cargarResumenPedido();

});