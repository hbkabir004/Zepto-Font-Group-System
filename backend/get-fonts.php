<?php
// backend/get-fonts.php

// Include CORS headers
require_once 'includes/cors-headers.php';

// Set the content type for the response
header("Content-Type: application/json");

// Required for MongoDB
require 'vendor/autoload.php';
require_once 'db/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get the fonts collection
        $collection = getFontsCollection();
        if (is_array($collection) && isset($collection['status']) && $collection['status'] === 'error') {
            echo json_encode($collection);
            exit;
        }

        // Fetch all fonts, sort by upload date (newest first)
        $cursor = $collection->find([], ['sort' => ['uploaded_at' => -1]]);
        $fonts = [];

        foreach ($cursor as $document) {
            $fonts[] = [
                'id' => (string) $document['_id'],
                'name' => $document['name'],
                'path' => $document['path'],
                'size' => $document['size'],
                'type' => $document['type'],
            ];
        }

        echo json_encode([
            'status' => 'success',
            'fonts' => $fonts
        ]);
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