<?php
include 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Неавторизованный пользователь']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? null;

if ($action === 'get') {
    $stmt = $pdo->prepare("SELECT c.quantity, p.name, p.price, p.image FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
    $stmt->execute([$user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($action === 'add') {
    $data = json_decode(file_get_contents('php://input'), true);
    $product_id = $data['product_id'];
    $quantity = $data['quantity'];

    $stmt = $pdo->prepare("INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)");
    $stmt->execute([$user_id, $product_id, $quantity]);

    echo json_encode(['success' => true, 'message' => 'Товар добавлен в корзину']);
}
?>
