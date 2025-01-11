<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
try {
    $stmt->execute([$username, $password]);
    echo json_encode(['success' => true, 'message' => 'Регистрация успешна']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка регистрации: ' . $e->getMessage()]);
}
?>
