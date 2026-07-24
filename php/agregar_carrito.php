<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

if (!isset($_SESSION["id_usuario"])) {
    echo json_encode([
        "success" => false,
        "message" => "Debes iniciar sesión."
    ]);
    exit();
}

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

//==============================
// BUSCAR CARRITO
//==============================

$sql = "SELECT id_carrito
        FROM carrito
        WHERE id_usuario = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id_usuario]);

$carrito = $stmt->fetch(PDO::FETCH_ASSOC);

//==============================
// SI NO EXISTE LO CREA
//==============================

if (!$carrito) {

    $stmt = $pdo->prepare("
        INSERT INTO carrito(id_usuario)
        VALUES(?)
    ");

    $stmt->execute([$id_usuario]);

    $id_carrito = $pdo->lastInsertId();

} else {

    $id_carrito = $carrito["id_carrito"];

}

//==============================
// OBTENER PRECIO DEL JUEGO
//==============================

$stmt = $pdo->prepare("
    SELECT precio
    FROM juegos
    WHERE id_juego = ?
");

$stmt->execute([$id_juego]);

$juego = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$juego) {

    echo json_encode([
        "success" => false,
        "message" => "Juego inexistente."
    ]);

    exit();

}

$precio = $juego["precio"];

//==============================
// ¿YA ESTÁ EN EL CARRITO?
//==============================

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

//==============================
// ACTUALIZAR O INSERTAR
//==============================

if ($detalle) {

    $stmt = $pdo->prepare("
        UPDATE detalle_carrito
        SET cantidad=cantidad+1
        WHERE id_detalle=?
    ");

    $stmt->execute([
        $detalle["id_detalle"]
    ]);

} else {

    $stmt = $pdo->prepare("
        INSERT INTO detalle_carrito
        (
            id_carrito,
            id_juego,
            cantidad,
            precio
        )
        VALUES
        (
            ?,?,?,?
        )
    ");

    $stmt->execute([
        $id_carrito,
        $id_juego,
        1,
        $precio
    ]);

}

echo json_encode([
    "success" => true
]);