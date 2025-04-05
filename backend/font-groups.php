<?php
// backend/font-groups.php

// Include CORS headers
require_once 'includes/cors-headers.php';

// Set the content type for the response
header("Content-Type: application/json");

// Required for MongoDB
require 'vendor/autoload.php';
require_once 'db/connection.php';

// Get the request body for POST requests
$requestBody = file_get_contents('php://input');
$requestData = json_decode($requestBody, true);

// Determine the action from POST data or JSON request body
$action = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? ($requestData['action'] ?? '');
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
}

switch ($action) {
    case 'create':
        $group = $_POST['group'] ?? ($requestData['group'] ?? '');
        if (is_string($group)) {
            $group = json_decode($group, true);
        }
        
        if (is_array($group) && count($group) >= 2) {
            $groupId = uniqid();
            $fontGroup = [
                'id' => $groupId,
                'fonts' => $group,
                'created_at' => new MongoDB\BSON\UTCDateTime(time() * 1000)
            ];

            try {
                $collection = getFontGroupsCollection();
                if (is_array($collection) && isset($collection['status']) && $collection['status'] === 'error') {
                    echo json_encode($collection);
                    break;
                }

                $result = $collection->insertOne($fontGroup);
                if ($result->getInsertedCount() > 0) {
                    $fontGroups = iterator_to_array($collection->find([], ['sort' => ['created_at' => -1]]));
                    echo json_encode([
                        'status' => 'success',
                        'fontGroups' => array_map(function ($doc) {
                            return [
                                'id' => $doc['id'],
                                'fonts' => $doc['fonts']
                            ];
                        }, $fontGroups)
                    ]);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Failed to create font group.']);
                }
            } catch (Exception $e) {
                echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'You must select at least two fonts.']);
        }
        break;

    case 'delete':
        $groupId = $_POST['id'] ?? ($requestData['id'] ?? '');
        try {
            $collection = getFontGroupsCollection();
            if (is_array($collection) && isset($collection['status']) && $collection['status'] === 'error') {
                echo json_encode($collection);
                break;
            }

            $result = $collection->deleteOne(['id' => $groupId]);
            if ($result->getDeletedCount() > 0) {
                $fontGroups = iterator_to_array($collection->find([], ['sort' => ['created_at' => -1]]));
                echo json_encode([
                    'status' => 'success',
                    'fontGroups' => array_map(function ($doc) {
                        return [
                            'id' => $doc['id'],
                            'fonts' => $doc['fonts']
                        ];
                    }, $fontGroups)
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Invalid group ID or group not found.']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
        break;

    case 'getGroups':
        try {
            $collection = getFontGroupsCollection();
            if (is_array($collection) && isset($collection['status']) && $collection['status'] === 'error') {
                echo json_encode($collection);
                break;
            }

            $fontGroups = iterator_to_array($collection->find([], ['sort' => ['created_at' => -1]]));
            echo json_encode([
                'status' => 'success',
                'fontGroups' => array_map(function ($doc) {
                    return [
                        'id' => $doc['id'],
                        'fonts' => $doc['fonts']
                    ];
                }, $fontGroups)
            ]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
        break;
}