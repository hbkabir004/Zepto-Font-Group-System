<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

// Initialize font groups session if not set
if (!isset($_SESSION['fontGroups'])) {
    $_SESSION['fontGroups'] = [];
}

// Get action from frontend request
$action = $_POST['action'] ?? '';

switch ($action) {
    case 'create':
        // Get the group from the request
        $group = json_decode($_POST['group'], true);

        // Ensure the group contains at least two fonts
        if (count($group) >= 2) {
            // Generate a unique ID for the group
            $groupId = uniqid();
            $fontGroup = ['id' => $groupId, 'fonts' => $group];

            // Store the group with its unique ID
            $_SESSION['fontGroups'][] = $fontGroup;
            echo json_encode(['status' => 'success', 'fontGroups' => $_SESSION['fontGroups']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'You must select at least two fonts.']);
        }
        break;

    case 'delete':
        // Get the group ID from the frontend
        $groupId = $_POST['id'];

        $found = false;
        // Loop through the font groups and find the one to delete by its ID
        foreach ($_SESSION['fontGroups'] as $index => $group) {
            if ($group['id'] === $groupId) {
                // Remove the group from the session
                array_splice($_SESSION['fontGroups'], $index, 1);
                $found = true;
                break;
            }
        }

        if ($found) {
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
