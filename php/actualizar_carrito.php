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

$accion = $data["accion"] ?? "";

//=========================================
// VALIDAR DATOS
//=========================================

if ($id_juego <= 0 || ($accion != "sumar" && $accion != "restar")) {

    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos."
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
// OBTENER PRODUCTO
//=========================================

$stmt = $pdo->prepare("
SELECT id_detalle,cantidad
FROM detalle_carrito
WHERE id_carrito=?
AND id_juego=?
");

$stmt->execute([
    $id_carrito,
    $id_juego
]);

$detalle = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$detalle) {

    echo json_encode([
        "success" => false
    ]);

    exit();

}

//=========================================
// SUMAR
//=========================================

if ($accion == "sumar") {

    $stmt = $pdo->prepare("
    UPDATE detalle_carrito
    SET cantidad=cantidad+1
    WHERE id_detalle=?
    ");

    $stmt->execute([
        $detalle["id_detalle"]
    ]);

}

//=========================================
// RESTAR
//=========================================

if ($accion == "restar") {

    if ($detalle["cantidad"] > 1) {

        $stmt = $pdo->prepare("
        UPDATE detalle_carrito
        SET cantidad=cantidad-1
        WHERE id_detalle=?
        ");

        $stmt->execute([
            $detalle["id_detalle"]
        ]);

    } else {

        $stmt = $pdo->prepare("
        DELETE FROM detalle_carrito
        WHERE id_detalle=?
        ");

        $stmt->execute([
            $detalle["id_detalle"]
        ]);

    }

}

echo json_encode([
    "success" => true
]);

?>