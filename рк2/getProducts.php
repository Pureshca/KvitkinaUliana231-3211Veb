<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'bd.php';  // Подключаем файл с настройками базы данных

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');  // Разрешаем кросс-доменные запросы
header('Access-Control-Allow-Methods: GET');  // Разрешаем только GET-запросы
header('Access-Control-Allow-Headers: Content-Type');  // Разрешаем указание заголовков

try {
    // Выполняем SQL запрос для получения всех продуктов
    $stmt = $pdo->query("SELECT * FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);  // Получаем данные в виде ассоциативного массива

    // Выводим результат в формате JSON
    echo json_encode($products, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // В случае ошибки выводим сообщение об ошибке в формате JSON
    echo json_encode(['error' => 'Не удалось получить данные о продуктах.']);
}
?>
