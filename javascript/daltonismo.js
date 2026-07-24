document.addEventListener("DOMContentLoaded", function () {
  // 1. Crear el botón de manera dinámica en la esquina superior izquierda
  const boton = document.createElement("button");
  boton.id = "toggle-daltonismo";
  boton.className = "btn-daltonismo";
  boton.setAttribute("type", "button");
  boton.setAttribute("aria-label", "Activar o desactivar modo daltonismo");
  
  // 2. Comprobar si ya estaba activo previamente
  const estadoGuardado = localStorage.getItem("modoDaltonismo");
  if (estadoGuardado === "activo") {
    document.body.classList.add("modo-daltonismo");
    boton.textContent = "👁️ Daltonismo: ON";
  } else {
    boton.textContent = "👁️ Daltonismo: OFF";
  }

  // 3. Agregar el botón al inicio de la página
  document.body.prepend(boton);

  // 4. Evento de clic para activar o desactivar
  boton.addEventListener("click", function () {
    document.body.classList.toggle("modo-daltonismo");

    if (document.body.classList.contains("modo-daltonismo")) {
      localStorage.setItem("modoDaltonismo", "activo");
      boton.textContent = "👁️ Daltonismo: ON";
    } else {
      localStorage.setItem("modoDaltonismo", "desactivado");
      boton.textContent = "👁️ Daltonismo: OFF";
    }
  });
});