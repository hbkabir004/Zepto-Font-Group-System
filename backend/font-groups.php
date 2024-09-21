<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

if (!isset($_SESSION['fontGroups'])) {
    $_SESSION['fontGroups'] = [];
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'create':
        $group = json_decode($_POST['group'], true);
        if (count($group) >= 2) {
            // Generate a unique ID for the group
            $groupId = uniqid();
            $fontGroup = ['id' => $groupId, 'fonts' => $group];

            $_SESSION['fontGroups'][] = $fontGroup;  // Store group with unique ID
            echo json_encode(['status' => 'success', 'fontGroups' => $_SESSION['fontGroups']]);
            
        } else {
            echo json_encode(['status' => 'error', 'message' => 'You must select at least two fonts.']);
        }
        break;

    case 'delete':
        $groupId = $_POST['id'];  // Get the group ID from the frontend
        $groupIndex = null;

        // Find the index of the group by its ID
        foreach ($_SESSION['fontGroups'] as $index => $group) {
            if ($group['id'] === $groupId) {
                $groupIndex = $index;
                break;
            }
        }

        // If group is found, delete it
        if ($groupIndex !== null) {
            array_splice($_SESSION['fontGroups'], $groupIndex, 1);  // Remove the group from the session
            echo json_encode(['status' => 'success', 'fontGroups' => $_SESSION['fontGroups']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid group ID.']);
        }
        break;

    case 'getGroups':
        echo json_encode(['status' => 'success', 'fontGroups' => $_SESSION['fontGroups']]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
        break;
}
