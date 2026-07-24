<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

//==================================================
// LEER JSON RECIBIDO DESDE pago.js
//==================================================

$datos = json_decode(file_get_contents("php://input"), true);

if (!$datos) {

    echo json_encode([
        "success" => false,
        "message" => "No se recibieron datos."
    ]);

    exit();
}

//==================================================
// VALIDAR SESIÓN
//==================================================

if (!isset($_SESSION["id_usuario"])) {

    echo json_encode([
        "success" => false,
        "message" => "Debes iniciar sesión."
    ]);

    exit();
}

$id_usuario = $_SESSION["id_usuario"];

//==================================================
// OBTENER DATOS
//==================================================

$nombre = trim($datos["nombre"] ?? "");
$apellido = trim($datos["apellido"] ?? "");
$email = trim($datos["email"] ?? "");
$direccion = trim($datos["direccion"] ?? "");
$ciudad = trim($datos["ciudad"] ?? "");
$codigo_postal = trim($datos["codigo_postal"] ?? "");
$metodo_pago = trim($datos["metodo_pago"] ?? "");

//==================================================
// VALIDACIONES
//==================================================

if (

    $nombre == "" ||
    $apellido == "" ||
    $email == "" ||
    $direccion == "" ||
    $ciudad == "" ||
    $codigo_postal == "" ||
    $metodo_pago == ""

){

    echo json_encode([
        "success"=>false,
        "message"=>"Completa todos los campos."
    ]);

    exit();

}

if(!filter_var($email,FILTER_VALIDATE_EMAIL)){

    echo json_encode([
        "success"=>false,
        "message"=>"Correo inválido."
    ]);

    exit();

}

//==================================================
// BUSCAR CARRITO DEL USUARIO
//==================================================

$sql="

SELECT id_carrito

FROM carrito

WHERE id_usuario=?

LIMIT 1

";

$stmt=$pdo->prepare($sql);

$stmt->execute([$id_usuario]);

$carrito=$stmt->fetch();

if(!$carrito){

    echo json_encode([

        "success"=>false,

        "message"=>"Tu carrito está vacío."

    ]);

    exit();

}

$id_carrito=$carrito["id_carrito"];

//==================================================
// OBTENER PRODUCTOS DEL CARRITO
//==================================================

$sql="

SELECT

dc.id_juego,

dc.cantidad,

dc.precio,

j.nombre,

j.stock

FROM detalle_carrito dc

INNER JOIN juegos j

ON dc.id_juego=j.id_juego

WHERE dc.id_carrito=?

";

$stmt=$pdo->prepare($sql);

$stmt->execute([$id_carrito]);

$productos=$stmt->fetchAll();

if(count($productos)==0){

    echo json_encode([

        "success"=>false,

        "message"=>"No hay productos en el carrito."

    ]);

    exit();

}

//==================================================
// CALCULAR TOTALES
//==================================================

$subtotal=0;

foreach($productos as $producto){

    if($producto["cantidad"]>$producto["stock"]){

        echo json_encode([

            "success"=>false,

            "message"=>"No hay suficiente stock de ".$producto["nombre"]

        ]);

        exit();

    }

    $subtotal+=($producto["precio"]*$producto["cantidad"]);

}

$envio=0;

$total=$subtotal+$envio;
//==================================================
// INICIAR TRANSACCIÓN
//==================================================

try{

    $pdo->beginTransaction();

    //==============================================
    // GUARDAR COMPRA
    //==============================================

    $sql="

    INSERT INTO compras

    (
        id_usuario,
        subtotal,
        envio,
        total
    )

    VALUES

    (
        ?,
        ?,
        ?,
        ?
    )

    ";

    $stmt=$pdo->prepare($sql);

    $stmt->execute([

        $id_usuario,
        $subtotal,
        $envio,
        $total

    ]);

    $id_compra=$pdo->lastInsertId();

    //==============================================
    // PREPARAR CONSULTAS
    //==============================================

    $sqlDetalle="

    INSERT INTO detalle_compra

    (
        id_compra,
        id_juego,
        cantidad,
        precio
    )

    VALUES

    (
        ?,
        ?,
        ?,
        ?
    )

    ";

    $stmtDetalle=$pdo->prepare($sqlDetalle);


    $sqlStock="

    UPDATE juegos

    SET stock=stock-?

    WHERE id_juego=?

    ";

    $stmtStock=$pdo->prepare($sqlStock);

    //==============================================
    // RECORRER PRODUCTOS
    //==============================================

    foreach($productos as $producto){

        $stmtDetalle->execute([

            $id_compra,
            $producto["id_juego"],
            $producto["cantidad"],
            $producto["precio"]

        ]);

        $stmtStock->execute([

            $producto["cantidad"],
            $producto["id_juego"]

        ]);

    }

    //==============================================
    // VACIAR DETALLE DEL CARRITO
    //==============================================

    $sql="

    DELETE FROM detalle_carrito

    WHERE id_carrito=?

    ";

    $stmt=$pdo->prepare($sql);

    $stmt->execute([

        $id_carrito

    ]);

    //==============================================
    // ELIMINAR CARRITO
    //==============================================

    $sql="

    DELETE FROM carrito

    WHERE id_carrito=?

    ";

    $stmt=$pdo->prepare($sql);

    $stmt->execute([

        $id_carrito

    ]);

    //==============================================
    // CONFIRMAR
    //==============================================

    $pdo->commit();

    echo json_encode([

        "success"=>true,

        "message"=>"Compra realizada correctamente."

    ]);

}catch(Exception $e){

    $pdo->rollBack();

    echo json_encode([

        "success"=>false,

        "message"=>$e->getMessage()

    ]);

}

?>