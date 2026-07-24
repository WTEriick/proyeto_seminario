<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

//=========================================
// COMPROBAR SESIÓN
//=========================================

if (!isset($_SESSION["id_usuario"])) {

    echo json_encode([
        "success" => false,
        "message" => "Debes iniciar sesión."
    ]);

    exit();

}

//=========================================
// RECIBIR DATOS
//=========================================

$data = json_decode(file_get_contents("php://input"), true);

$id_juego = intval($data["id_juego"] ?? 0);

if ($id_juego <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Juego inválido."
    ]);

    exit();

}

$id_usuario = $_SESSION["id_usuario"];

//=========================================
// OBTENER CARRITO
//=========================================

$stmt = $pdo->prepare("
SELECT id_carrito
FROM carrito
WHERE id_usuario=?
");

$stmt->execute([$id_usuario]);

$carrito = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$carrito) {

    echo json_encode([
        "success" => false
    ]);

    exit();

}

$id_carrito = $carrito["id_carrito"];

//=========================================
// ELIMINAR PRODUCTO
//=========================================

$stmt = $pdo->prepare("
DELETE FROM detalle_carrito
WHERE id_carrito=?
AND id_juego=?
");

$stmt->execute([
    $id_carrito,
    $id_juego
]);

echo json_encode([
    "success" => true
]);

?>