<?php
// Indicamos al navegador que la respuesta será un objeto JSON limpio
header('Content-Type: application/json; charset=utf-8');

// Conectamos a tu base de datos
require_once 'conexion.php';

try {
    // Traemos los juegos cruzando la tabla con su categoría para tener el nombre real
    $sql = "SELECT j.*, c.nombre AS categoria_nombre 
            FROM juegos j
            LEFT JOIN categorias c ON j.id_categoria = c.id_categoria";
    $stmt = $pdo->query($sql);
    $juegos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Si todo sale bien, respondemos con éxito y los datos
    echo json_encode([
        "status" => "success",
        "data" => $juegos
    ]);

} catch (PDOException $e) {
    // Si la base de datos falla, respondemos con el error en formato JSON
    echo json_encode([
        "status" => "error",
        "message" => "Error en la consulta: " . $e->getMessage()
    ]);
}

?>