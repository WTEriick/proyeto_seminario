//==============================
// INICIAR
//==============================
document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {
    const contenedor = document.getElementById("contenedorJuegos");
    const buscador = document.getElementById("buscador");
    const btnOfertas = document.getElementById("btnOfertas");
    const iconoCarrito = document.querySelector(".nav-icons .icon");
    const iconoUsuario = document.getElementById("iconoUsuario");
    const btnHero = document.getElementById("btnHeroCarrito");

    
    if (contenedor) {
        
        contenedor.addEventListener("click", (e) => {
            
            const boton = e.target.closest(".btn-add");
            if (boton) {
                agregarCarritoDirecto(boton);
            }
        });

        fetch("../php/obtener_juegos.php")
            .then(response => response.json())
            .then(resultado => {
                if (resultado.status === "error") {
                    contenedor.innerHTML = `<p>Error al cargar catálogo: ${resultado.message}</p>`;
                    return;
                }

                const juegos = resultado.data;
                if (juegos.length === 0) {
                    contenedor.innerHTML = "<p>No hay videojuegos disponibles en este momento.</p>";
                    return;
                }

                contenedor.innerHTML = ""; // Limpiamos el "Cargando..."

                // Inyectamos las tarjetas
                juegos.forEach(juego => {
                    const categoriaTag = (juego.categoria_nombre || 'general')
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "");

                    const precioFormateado = parseFloat(juego.precio).toFixed(2);
                    const rutaImagen = `../imagenes/${juego.imagen}`;

                    const tarjetaHTML = `
                        <div class="product-card" data-category="${categoriaTag}" data-sale="false">
                            <div class="card-img-container">
                                <img src="${rutaImagen}" class="game-img" alt="${juego.nombre}">
                            </div>
                            <div class="card-info">
                                <span class="card-category">${juego.categoria_nombre || 'General'}</span>
                                <h3 class="card-title">${juego.nombre}</h3>
                                <div class="card-footer">
                                    <div class="card-prices">
                                        <span class="card-price-current">$${precioFormateado}</span>
                                    </div>
                                    <button class="btn-add" 
                                        data-id="${juego.id_juego}"
                                        data-name="${juego.nombre}" 
                                        data-price="${juego.precio}" 
                                        data-image="${rutaImagen}">
                                        + Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    contenedor.insertAdjacentHTML("beforeend", tarjetaHTML);
                });
            })
            .catch(error => {
                console.error("Error al conectar con PHP:", error);
                contenedor.innerHTML = "<p>Error de conexión con el catálogo.</p>";
            });
    }

    if (buscador) buscador.addEventListener("keyup", buscarJuego);
    if (btnOfertas) btnOfertas.addEventListener("click", mostrarOfertas);
    if (iconoCarrito) iconoCarrito.addEventListener("click", () => window.location.href = "carrito.html");
    if (iconoUsuario) iconoUsuario.addEventListener("click", () => window.location.href = "usuario.html");
    if (btnHero) {
        btnHero.addEventListener("click", (e) => agregarCarritoDirecto(e.target.closest("#btnHeroCarrito")));
    }

    actualizarContador();
}

//==============================
// AGREGAR AL CARRITO (Optimizado y Blindado)
//==============================
function agregarCarritoDirecto(boton) {

    if (!boton) return;

    const idJuego = boton.getAttribute("data-id");

    fetch("../php/agregar_carrito.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            id_juego: idJuego
        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.success) {

            actualizarContador();

            alert("Juego agregado al carrito.");

        } else {

            alert(data.message);

        }

    })

    .catch(error => {

        console.error(error);

        alert("Error al agregar al carrito.");

    });

}
function actualizarContador() {

    const contador = document.getElementById("contadorCarrito");

    if (!contador) return;

    fetch("../php/obtener_carrito.php")

    .then(response => response.json())

    .then(resultado => {

        if (!resultado.success) {

            contador.textContent = "0";
            return;

        }

        let total = 0;

        resultado.productos.forEach(producto => {

            total += Number(producto.cantidad);

        });

        contador.textContent = total;

    })

    .catch(error => {

        console.error(error);
        contador.textContent = "0";

    });

}
//==============================
// FILTRAR CATEGORÍAS (Funciona buscando en tiempo real)
//==============================
document.querySelectorAll(".tag").forEach(botonTag => {
    botonTag.addEventListener("click", (e) => {
        document.querySelectorAll(".tag").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");

        const categoriaSeleccionada = e.target.getAttribute("data-category");
        const tarjetas = document.querySelectorAll(".product-card");

        tarjetas.forEach(card => {
            const catCard = card.getAttribute("data-category");
            if (categoriaSeleccionada === "todos" || catCard === categoriaSeleccionada) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});

//==============================
// OFERTAS
//==============================
function mostrarOfertas(e) {
    e.preventDefault();
    document.querySelectorAll(".product-card").forEach(card => {
        if (card.getAttribute("data-sale") === "true") {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

//==============================
// BUSCAR
//==============================
function buscarJuego() {
    const buscador = document.getElementById("buscador");
    let texto = buscador.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
        let nombre = card.querySelector(".card-title").textContent.toLowerCase();
        if (nombre.includes(texto)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}