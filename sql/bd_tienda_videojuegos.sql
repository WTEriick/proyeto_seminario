CREATE DATABASE gamestore;
USE gamestore;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,
    usuario VARCHAR(40) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categorias(
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO categorias(nombre) VALUES
('Acción'),     -- ID 1
('RPG'),        -- ID 2
('Shooter'),    -- ID 3
('Racing'),     -- ID 4
('Estrategia'); -- ID 5

CREATE TABLE juegos(
    id_juego INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(8,2),
    stock INT,
    imagen VARCHAR(255),
    FOREIGN KEY(id_categoria) REFERENCES categorias(id_categoria)
);

INSERT INTO juegos (id_categoria, nombre, descripcion, precio, stock, imagen) VALUES
(1, 'Grand Theft Auto VI', 'Juego de acción de Rockstar', 75.99, 20, 'gta6.webp'),
(4, 'Forza Horizon 5', 'Juego de carreras', 29.99, 25, 'forza5.jpg'), -- Corregido de 5 a 4
(2, 'God of War Ragnarök', 'Aventura RPG', 69.99, 15, 'gow.jpg'),
(1, 'Red Dead Redemption 2', 'Mundo abierto', 19.99, 30, 'rdr2.png'),
(1, 'Cyberpunk 2077', 'RPG futurista', 49.99, 18, 'cyberpunk.jpg'),
(1, 'Mecha Chameleon', 'Juego de acción', 9.99, 40, 'mc2.jpg'),
(3, 'Call of Duty Black Ops 6', 'FPS multijugador', 69.99, 20, 'bo6.jpg'),
(3, 'DOOM Eternal', 'Shooter', 39.99, 10, 'doom.jpg'),
(2, 'Elden Ring', 'RPG de mundo abierto', 59.99, 22, 'eldenring.jpg'),
(2, 'Baldur''s Gate 3', 'RPG por turnos', 59.99, 14, 'bg3.jpg');

CREATE TABLE carrito(
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE detalle_carrito(
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT,
    id_juego INT,
    cantidad INT,
    precio DECIMAL(8,2),
    FOREIGN KEY(id_carrito) REFERENCES carrito(id_carrito),
    FOREIGN KEY(id_juego) REFERENCES juegos(id_juego)
);

CREATE TABLE compras(
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(8,2),
    envio DECIMAL(8,2),
    total DECIMAL(8,2),
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE detalle_compra(
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT,
    id_juego INT,
    cantidad INT,
    precio DECIMAL(8,2),
    FOREIGN KEY(id_compra) REFERENCES compras(id_compra),
    FOREIGN KEY(id_juego) REFERENCES juegos(id_juego)
);