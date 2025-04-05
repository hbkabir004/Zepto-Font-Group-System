<?php
// backend/middleware.php
// This script will act as a CORS middleware for all API requests

// Get the actual request path
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Set proper CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Credentials: true");

// Handle OPTIONS preflight requests
if ($request_method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the requested path and remove leading slash if present
$path = ltrim($request_uri, '/');

// Basic routing
if ($path === '' || $path === 'index.php') {
    include 'index.php';
} elseif (file_exists($path)) {
    // Handle static files
    $mime_types = [
        'php' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'ttf' => 'font/ttf',
        'otf' => 'font/otf',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'json' => 'application/json'
    ];
    
    $extension = pathinfo($path, PATHINFO_EXTENSION);
    if (isset($mime_types[$extension])) {
        header("Content-Type: {$mime_types[$extension]}");
    }
    
    include $path;
} else {
    // Show 404 for non-existent paths
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Resource not found']);
}