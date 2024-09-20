<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If this is an OPTIONS request (preflight request), stop further execution
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

if (!isset($_SESSION['fontGroups'])) {
    $_SESSION['fontGroups'] = [];
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'create':
        $group = json_decode($_POST['group'], true);
        if (count($group) >= 2) {
            $_SESSION['fontGroups'][] = $group;
            echo json_encode(['status' => 'success', 'fontGroups' => $_SESSION['fontGroups']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'You must select at least two fonts.']);
        }
        break;

    case 'delete':
        $index = $_POST['index'];
        if (isset($_SESSION['fontGroups'][$index])) {
            array_splice($_SESSION['fontGroups'], $index, 1);
            echo json_encode(['status' => 'success', 'fontGroups' => $_SESSION['fontGroups']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid group index.']);
        }
        break;

    case 'getGroups':
        echo json_encode(['status' => 'success', 'fontGroups' => $_SESSION['fontGroups']]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
        break;
}
