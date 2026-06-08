<?php
require 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM sports");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if(!isset($data['id'])) $data['id'] = 'sport_' . time();
        $stmt = $pdo->prepare("INSERT INTO sports (id, name, icon) VALUES (?, ?, ?)");
        $stmt->execute([$data['id'], $data['name'], $data['icon'] ?? 'fa-trophy']);
        echo json_encode(["status" => "success", "id" => $data['id']]);
        break;
}
?>