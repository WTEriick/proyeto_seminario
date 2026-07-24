<?php

session_start();

require_once "conexion.php";


// ==========================================
// COMPROBAR QUE EL FORMULARIO ENVÍE POST
// ==========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    header("Location: ../html/inicios_sesion.html");
    exit();

}


// ==========================================
// RECIBIR DATOS
// ==========================================

$login = trim($_POST["login_input"] ?? "");

$password = trim($_POST["contrasena"] ?? "");


// ==========================================
// VALIDAR CAMPOS
// ==========================================

if (empty($login) || empty($password)) {

    echo "
    <script>
        alert('Debes completar todos los campos.');
        window.location.href = '../html/inicios_sesion.html';
    </script>
    ";

    exit();

}


// ==========================================
// BUSCAR USUARIO
// ==========================================

$sql = "SELECT * FROM usuarios 
        WHERE correo = ? OR usuario = ?
        LIMIT 1";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $login,
    $login
]);


$usuario = $stmt->fetch(PDO::FETCH_ASSOC);


// ==========================================
// COMPROBAR SI EXISTE
// ==========================================

if (!$usuario) {

    echo "
    <script>
        alert('El usuario no existe.');
        window.location.href = '../html/inicios_sesion.html';
    </script>
    ";

    exit();

}


// ==========================================
// COMPROBAR CONTRASEÑA
// ==========================================

if (!password_verify(
    $password,
    $usuario["contrasena"]
)) {

    echo "
    <script>
        alert('Contraseña incorrecta.');
        window.location.href = '../html/inicios_sesion.html';
    </script>
    ";

    exit();

}


// ==========================================
// CREAR SESIÓN
// ==========================================

session_regenerate_id(true);

$_SESSION["id_usuario"] = $usuario["id_usuario"];
$_SESSION["usuario"] = $usuario["usuario"];
$_SESSION["correo"] = $usuario["correo"];


// ==========================================
// REDIRIGIR AL MENÚ
// ==========================================

header(
    "Location: ../html/menu.html"
);

exit();

?>