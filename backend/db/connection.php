<?php
// backend/db/connection.php

// MongoDB connection details
$mongoUri = "mongodb+srv://hbkabir004:pQWGhh6fpfY3nydG@fontsystem.icir9hv.mongodb.net/?retryWrites=true&w=majority&appName=FontSystem";

// Function to get MongoDB client
function getMongoClient() {
    global $mongoUri;
    
    try {
        // Create a new MongoDB client
        $client = new MongoDB\Client($mongoUri);
        return $client;
    } catch (MongoDB\Driver\Exception\Exception $e) {
        // Return error if connection fails
        return ['status' => 'error', 'message' => 'Failed to connect to MongoDB: ' . $e->getMessage()];
    }
}

// Function to get the fonts database
function getFontsDB() {
    $client = getMongoClient();
    if (isset($client['status']) && $client['status'] === 'error') {
        return $client; // Return error if connection failed
    }
    
    return $client->selectDatabase('fontsystem');
}

// Function to get the font groups collection
function getFontGroupsCollection() {
    $db = getFontsDB();
    if (isset($db['status']) && $db['status'] === 'error') {
        return $db; // Return error if connection failed
    }
    
    return $db->selectCollection('fontGroups');
}

// Function to get the fonts collection
function getFontsCollection() {
    $db = getFontsDB();
    if (isset($db['status']) && $db['status'] === 'error') {
        return $db; // Return error if connection failed
    }
    
    return $db->selectCollection('fonts');
}