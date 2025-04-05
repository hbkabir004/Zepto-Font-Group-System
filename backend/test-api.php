<?php
// backend/test-api.php

// Include CORS headers
require_once 'includes/cors-headers.php';

// Set the content type for the response
header("Content-Type: application/json");

// Return a success response
echo json_encode([
    'status' => 'success',
    'message' => 'API is working!',
    'time' => date('Y-m-d H:i:s')
]);