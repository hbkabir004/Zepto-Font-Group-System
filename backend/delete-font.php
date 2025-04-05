<?php
// backend/delete-font.php

// Allow CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If this is an OPTIONS request (preflight request), stop further execution
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Required for MongoDB
require 'vendor/autoload.php';
require_once 'db/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get request body
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Font ID is required.'
        ]);
        exit;
    }
    
    try {
        // Get the fonts collection
        $collection = getFontsCollection();
        if (is_array($collection) && isset($collection['status']) && $collection['status'] === 'error') {
            echo json_encode($collection);
            exit;
        }
        
        // First, get the font to delete its file
        $fontToDelete = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($data['id'])]);
        
        if ($fontToDelete) {
            // Delete the actual font file if it exists
            if (isset($fontToDelete['path']) && file_exists($fontToDelete['path'])) {
                unlink($fontToDelete['path']);
            }
            
            // Now delete the font record from MongoDB
            $result = $collection->deleteOne(['_id' => new MongoDB\BSON\ObjectId($data['id'])]);
            
            if ($result->getDeletedCount() > 0) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Font deleted successfully.'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete font from database.'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Font not found.'
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
}