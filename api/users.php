<?php
require 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM users");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if(!isset($data['id'])) {
            $data['id'] = $data['role'] . '_' . time();
        }
        $stmt = $pdo->prepare("INSERT INTO users (id, role, email, name, role_desc, img) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['id'],
            $data['role'],
            $data['email'] ?? ($data['id'].'@test.com'),
            $data['name'],
            $data['role_desc'] ?? null,
            $data['img'] ?? 'https://i.pravatar.cc/150?u='.$data['id']
        ]);
        echo json_encode(["status" => "success", "id" => $data['id']]);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "deleted"]);
        break;
}
?>