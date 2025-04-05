<?php
// backend/font-groups.php

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If this is an OPTIONS request (preflight request), stop further execution
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Required for MongoDB
require 'vendor/autoload.php';
require_once 'db/connection.php';

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'create':
        $group = json_decode($_POST['group'], true);
        if (count($group) >= 2) {
            $groupId = uniqid();
            $fontGroup = [
                'id' => $groupId,
                'fonts' => $group,
                'created_at' => new MongoDB\BSON\UTCDateTime(time() * 1000)
            ];

            try {
                $collection = getFontGroupsCollection();
                if (isset($collection['status']) && $collection['status'] === 'error') {
                    echo json_encode($collection);
                    break;
                }

                $result = $collection->insertOne($fontGroup);
                if ($result->getInsertedCount() > 0) {
                    $fontGroups = $collection->find([], ['sort' => ['created_at' => -1]])->toArray();
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
        $groupId = $_POST['id'];
        try {
            $collection = getFontGroupsCollection();
            if (isset($collection['status']) && $collection['status'] === 'error') {
                echo json_encode($collection);
                break;
            }

            $result = $collection->deleteOne(['id' => $groupId]);
            if ($result->getDeletedCount() > 0) {
                $fontGroups = $collection->find([], ['sort' => ['created_at' => -1]])->toArray();
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
            if (isset($collection['status']) && $collection['status'] === 'error') {
                echo json_encode($collection);
                break;
            }

            $fontGroups = $collection->find([], ['sort' => ['created_at' => -1]])->toArray();
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