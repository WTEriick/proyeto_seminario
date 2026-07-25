//==============================
// INICIAR
//==============================

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar(){
    

    document.getElementById("btnExplorar").addEventListener("click", explorarTienda);

    document.getElementById("btnPago").addEventListener("click", irPago);

    mostrarCarrito();

}

//==============================
// EXPLORAR TIENDA
//==============================

function explorarTienda(){

    window.location.href="menu.html";

}

//==============================
// IR A PAGO
//==============================

function irPago(){

    fetch("../php/obtener_carrito.php")

    .then(response=>response.json())

    .then(resultado=>{

        if(resultado.productos.length==0){

            alert("El carrito está vacío.");

            return;

        }

        window.location.href="pago.html";

    });

}

//==============================
// MOSTRAR CARRITO
//==============================

function mostrarCarrito(){
    console.log("mostrarCarrito ejecutándose");

    fetch("php/obtener_carrito.php")

    .then(response => response.json())

    .then(resultado=>{
        console.log(resultado);

        if(!resultado.success){

            alert("No se pudo cargar el carrito.");

            return;

        }

        const carrito=resultado.productos;

        const vacio=document.getElementById("carritoVacio");

        const contenido=document.getElementById("carritoContenido");

        const lista=document.getElementById("listaCarrito");

        lista.innerHTML="";

        if(carrito.length==0){

            vacio.style.display="block";

            contenido.style.display="none";

            return;

        }

        vacio.style.display="none";

        contenido.style.display="grid";

        let subtotal=0;

        let totalArticulos=0;

        carrito.forEach(producto=>{

            subtotal+=parseFloat(producto.precio)*producto.cantidad;

            totalArticulos+=parseInt(producto.cantidad);

            lista.innerHTML+=`

            <div class="producto-carrito">

                <div class="info-producto">

                    <img src="imagenes/${producto.imagen}">

                    <div class="datos">

                        <h3>${producto.nombre}</h3>

                        <p class="precio">

                            $${parseFloat(producto.precio).toFixed(2)}

                        </p>

                        <div class="cantidad">

                            <button onclick="disminuir(${producto.id_juego})">

                                -

                            </button>

                            <span class="numero">

                                ${producto.cantidad}

                            </span>

                            <button onclick="aumentar(${producto.id_juego})">

                                +

                            </button>

                        </div>

                    </div>

                </div>

                <button
                class="eliminar"
                onclick="eliminarProducto(${producto.id_juego})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

            `;

        });

        document.getElementById("cantidadArticulos").textContent=

            totalArticulos+" artículos";

        document.getElementById("contadorCarrito").textContent=

            totalArticulos;

        document.getElementById("subtotal").textContent=

            "$"+subtotal.toFixed(2);

        let envio=4.99;

        document.getElementById("envio").textContent=

            "$"+envio.toFixed(2);

        document.getElementById("total").textContent=

            "$"+(subtotal+envio).toFixed(2);

    });

}

//==============================
// AUMENTAR
//==============================

function aumentar(idJuego){

    fetch("php/aumentar_cantidad.php",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            id_juego:idJuego
        })

    })

    .then(response=>response.json())

    .then(resultado=>{

        if(resultado.success){

            mostrarCarrito();

        }else{

            alert("No se pudo aumentar la cantidad.");

        }

    });

}


//==============================
// DISMINUIR
//==============================

function disminuir(idJuego){

    fetch("php/disminuir_cantidad.php",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            id_juego:idJuego
        })

    })

    .then(response=>response.json())

    .then(resultado=>{

        if(resultado.success){

            mostrarCarrito();

        }else{

            alert("No se pudo disminuir la cantidad.");

        }

    });

}

//==============================
// ELIMINAR
//==============================

function eliminarProducto(idJuego){

    fetch("php/eliminar_carrito.php",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            id_juego:idJuego
        })

    })

    .then(response=>response.json())

    .then(resultado=>{

        if(resultado.success){

            mostrarCarrito();

        }else{

            alert("No se pudo eliminar el producto.");

        }

    });

}