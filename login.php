<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$password = $data['password'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    session_start();
    $_SESSION['user_id'] = $user['id'];
    echo json_encode(['success' => true, 'message' => 'Вход выполнен']);
} else {
    echo json_encode(['success' => false, 'message' => 'Неверный логин или пароль']);
}
?>
