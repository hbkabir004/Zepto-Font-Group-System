<?php
// backend/db/connection.php

// MongoDB connection details using environment variables
function getMongoUri() {
    // Check for environment variable first
    $mongoUri = getenv('MONGODB_URI');
    
    // If not found in environment, look for it in .env file
    if (!$mongoUri) {
        if (file_exists(__DIR__ . '/../.env')) {
            $envVars = parse_ini_file(__DIR__ . '/../.env');
            $mongoUri = $envVars['MONGODB_URI'] ?? null;
        }
    }
    
    // Fallback to a default for local development only (not recommended for production)
    if (!$mongoUri) {
        error_log('Warning: MONGODB_URI environment variable not set. Using default connection string.');
        return null;
    }
    
    return $mongoUri;
}

// Function to get MongoDB client
function getMongoClient() {
    $mongoUri = getMongoUri();
    
    if (!$mongoUri) {
        return ['status' => 'error', 'message' => 'MongoDB connection string not configured. Please set MONGODB_URI environment variable.'];
    }
    
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
    if (is_array($client) && isset($client['status']) && $client['status'] === 'error') {
        return $client; // Return error if connection failed
    }
    
    return $client->selectDatabase('fontsystem');
}

// Function to get the font groups collection
function getFontGroupsCollection() {
    $db = getFontsDB();
    if (is_array($db) && isset($db['status']) && $db['status'] === 'error') {
        return $db; // Return error if connection failed
    }
    
    return $db->selectCollection('fontGroups');
}

// Function to get the fonts collection
function getFontsCollection() {
    $db = getFontsDB();
    if (is_array($db) && isset($db['status']) && $db['status'] === 'error') {
        return $db; // Return error if connection failed
    }
    
    return $db->selectCollection('fonts');
}