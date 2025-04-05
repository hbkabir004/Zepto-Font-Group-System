<?php
// backend/setup-database.php

// Include CORS headers
require_once 'includes/cors-headers.php';

// Set the content type for the response
header("Content-Type: application/json");

// Required for MongoDB
require 'vendor/autoload.php';
require_once 'db/connection.php';

try {
    // Test MongoDB connection
    $client = getMongoClient();
    if (is_array($client) && isset($client['status']) && $client['status'] === 'error') {
        echo json_encode($client);
        exit;
    }
    
    // Make sure the fonts database exists
    $db = getFontsDB();
    if (is_array($db) && isset($db['status']) && $db['status'] === 'error') {
        echo json_encode($db);
        exit;
    }
    
    // Create collections if they don't exist
    $collections = $db->listCollections();
    $collectionNames = [];
    
    foreach ($collections as $collection) {
        $collectionNames[] = $collection->getName();
    }
    
    // Check and create fonts collection
    if (!in_array('fonts', $collectionNames)) {
        $db->createCollection('fonts');
        $message[] = "Created 'fonts' collection";
    } else {
        $message[] = "'fonts' collection already exists";
    }
    
    // Check and create fontGroups collection
    if (!in_array('fontGroups', $collectionNames)) {
        $db->createCollection('fontGroups');
        $message[] = "Created 'fontGroups' collection";
    } else {
        $message[] = "'fontGroups' collection already exists";
    }
    
    // Check if uploads directory exists
    $uploadDir = './uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
        $message[] = "Created uploads directory";
    } else {
        $message[] = "Uploads directory already exists";
    }
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Database setup completed',
        'details' => $message
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Setup error: ' . $e->getMessage()
    ]);
}