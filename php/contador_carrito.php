<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

if (!isset($_SESSION["id_usuario"])) {
    echo json_encode([
        "success" => true,
        "total" => 0
    ]);
    exit();
}

$id_usuario = $_SESSION["id_usuario"];

$sql = "
SELECT COALESCE(SUM(dc.cantidad), 0) AS total
FROM carrito c
LEFT JOIN detalle_carrito dc
    ON c.id_carrito = dc.id_carrito
WHERE c.id_usuario = ?
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id_usuario]);

$total = $stmt->fetchColumn();

echo json_encode([
    "success" => true,
    "total" => intval($total)
]);