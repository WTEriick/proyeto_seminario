<?php

require_once __DIR__ . "/conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario = trim($_POST["usuario"]);
    $correo = trim($_POST["correo"]);
    $password = trim($_POST["password"]);
    $confirmar_password = trim($_POST["confirmar_password"]);

    if (
        empty($usuario) ||
        empty($correo) ||
        empty($password) ||
        empty($confirmar_password)
    ) {
        die("Todos los campos son obligatorios.");
    }

    if ($password != $confirmar_password) {
        die("Las contraseñas no coinciden.");
    }

    try {

        $consulta = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE correo = ?");
        $consulta->execute([$correo]);

        if ($consulta->fetch()) {
            die("El correo ya está registrado.");
        }

        $consulta = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE usuario = ?");
        $consulta->execute([$usuario]);

        if ($consulta->fetch()) {
            die("El nombre de usuario ya existe.");
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO usuarios(correo,usuario,contrasena)
                VALUES(?,?,?)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            $correo,
            $usuario,
            $passwordHash
        ]);

        header("Location: html/index.html");
        exit();

    } catch (PDOException $e) {

        die($e->getMessage());

    }

} else {

    header("Location: html/registro.html");
    exit();

}