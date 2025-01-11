<?php
$host = 'localhost';
$db = 'shopdb';
$user = 'root'; // стандартный пользователь MySQL
$password = '1234'; // пароль для MySQL, обычно пустой для локального сервера

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Пример запроса для проверки работы базы данных
    $query = $pdo->query("SELECT 1");
    if ($query) {
    } else {
        echo "Ошибка при выполнении запроса.";
    }
} catch (PDOException $e) {
    die('Ошибка подключения к базе данных: ' . $e->getMessage());
}
?>
