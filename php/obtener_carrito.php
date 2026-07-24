<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

//====================================
// COMPROBAR SESIÓN
//====================================

if (!isset($_SESSION["id_usuario"])) {

    echo json_encode([
        "success" => false,
        "message" => "No hay sesión."
    ]);

    exit();

}

$id_usuario = $_SESSION["id_usuario"];

//====================================
// BUSCAR CARRITO DEL USUARIO
//====================================

$sql = "
SELECT c.id_carrito
FROM carrito c
WHERE c.id_usuario = ?
LIMIT 1
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id_usuario]);

$carrito = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$carrito) {

    echo json_encode([
        "success" => true,
        "productos" => []
    ]);

    exit();

}

$id_carrito = $carrito["id_carrito"];

//====================================
// OBTENER PRODUCTOS
//====================================

$sql = "
SELECT

j.id_juego,
j.nombre,
j.imagen,

dc.cantidad,
dc.precio

FROM detalle_carrito dc

INNER JOIN juegos j
ON dc.id_juego = j.id_juego

WHERE dc.id_carrito = ?
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id_carrito]);

$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

//====================================
// RESPUESTA
//====================================

echo json_encode([

    "success" => true,

    "productos" => $productos

]);

?>