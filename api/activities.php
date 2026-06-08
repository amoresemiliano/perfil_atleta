<?php
require 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM activities");
        $results = $stmt->fetchAll();
        // Convertir snake_case a camelCase para JS
        $jsFriendly = array_map(function($a) {
            return [
                'id' => $a['id'],
                'athleteId' => $a['athlete_id'],
                'coachId' => $a['coach_id'],
                'status' => $a['status'],
                'sport' => $a['sport_id'],
                'title' => $a['title'],
                'type' => $a['type'],
                'bloques' => $a['bloques'],
                'vueltas' => $a['vueltas'],
                'dist' => $a['dist'],
                'pace' => $a['pace'],
                'zone' => $a['zone'],
                'place' => $a['place'],
                'distance' => (float)$a['distance'],
                'time' => $a['time'],
                'rpe' => (int)$a['rpe'],
                'dateAssigned' => $a['date_assigned'],
                'dateCompleted' => $a['date_completed']
            ];
        }, $results);
        echo json_encode($jsFriendly);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if(!isset($data['id'])) $data['id'] = 'act_' . time();

        $stmt = $pdo->prepare("INSERT INTO activities (id, athlete_id, coach_id, status, sport_id, title, type, bloques, vueltas, dist, pace, zone, place, distance, time, rpe, date_assigned, date_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $data['id'],
            $data['athleteId'],
            $data['coachId'] ?? null,
            $data['status'] ?? 'pending',
            $data['sport'],
            $data['title'],
            $data['type'] ?? null,
            $data['bloques'] ?? null,
            $data['vueltas'] ?? null,
            $data['dist'] ?? null,
            $data['pace'] ?? null,
            $data['zone'] ?? null,
            $data['place'] ?? null,
            $data['distance'] ?? null,
            $data['time'] ?? null,
            $data['rpe'] ?? null,
            $data['dateAssigned'] ?? null,
            $data['dateCompleted'] ?? null
        ]);
        echo json_encode(["status" => "success", "id" => $data['id']]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE activities SET status = ?, date_completed = ?, distance = ? WHERE id = ?");
        $stmt->execute([
            $data['status'],
            $data['dateCompleted'],
            $data['distance'],
            $data['id']
        ]);
        echo json_encode(["status" => "updated"]);
        break;
}
?>