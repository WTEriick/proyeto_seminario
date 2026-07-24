<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

//====================================
// COMPROBAR SESIÓN
//====================================

if (!isset($_SESSION["id_usuario"])) {

    echo json_encode([
        "success" => false
    ]);

    exit();

}

$id_usuario = $_SESSION["id_usuario"];

//====================================
// RECIBIR DATOS
//====================================

$datos = json_decode(file_get_contents("php://input"), true);

$id_juego = $datos["id_juego"] ?? 0;

//====================================
// OBTENER EL CARRITO
//====================================

$sql = "SELECT id_carrito
        FROM carrito
        WHERE id_usuario = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id_usuario]);

$carrito = $stmt->fetch();

if (!$carrito) {

    echo json_encode([
        "success" => false
    ]);

    exit();

}

$id_carrito = $carrito["id_carrito"];

//====================================
// OBTENER CANTIDAD ACTUAL
//====================================

$sql = "SELECT cantidad
        FROM detalle_carrito
        WHERE id_carrito = ?
        AND id_juego = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    $id_carrito,
    $id_juego
]);

$detalle = $stmt->fetch();

if (!$detalle) {

    echo json_encode([
        "success" => false
    ]);

    exit();

}

//====================================
// DISMINUIR O ELIMINAR
//====================================

if ($detalle["cantidad"] > 1) {

    $sql = "UPDATE detalle_carrito
            SET cantidad = cantidad - 1
            WHERE id_carrito = ?
            AND id_juego = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id_carrito,
        $id_juego
    ]);

} else {

    $sql = "DELETE FROM detalle_carrito
            WHERE id_carrito = ?
            AND id_juego = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id_carrito,
        $id_juego
    ]);

}

//====================================
// RESPUESTA
//====================================

echo json_encode([
    "success" => true
]);

?>