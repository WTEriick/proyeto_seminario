<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

if (
    !isset($_SESSION["usuario"]) ||
    !isset($_SESSION["correo"])
) {

    echo json_encode([
        "success" => false,
        "message" => "No hay sesión iniciada."
    ]);

    exit();

}

echo json_encode([

    "success" => true,

    "usuario" => $_SESSION["usuario"],

    "correo" => $_SESSION["correo"]

]);

exit();

?>