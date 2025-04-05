<?php
// backend/upload.php

// Allow CORS
header("Content-Type: application/json");
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['fontFile']) && $_FILES['fontFile']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['fontFile']['tmp_name'];
        $fileName = $_FILES['fontFile']['name'];
        $fileSize = $_FILES['fontFile']['size'];
        $fileType = $_FILES['fontFile']['type'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Allow only TTF files
        if ($fileExtension === 'ttf') {
            $uploadFileDir = './uploads/';
            
            // Create the uploads directory if it doesn't exist
            if (!file_exists($uploadFileDir)) {
                mkdir($uploadFileDir, 0777, true);
            }

            $newFileName = uniqid() . '.' . $fileExtension;
            $destPath = $uploadFileDir . $newFileName;

            if (move_uploaded_file($fileTmpPath, $destPath)) {
                try {
                    // Save font metadata to MongoDB Atlas
                    $collection = getFontsCollection();
                    if (is_array($collection) && isset($collection['status']) && $collection['status'] === 'error') {
                        echo json_encode($collection); // Return the error
                        exit;
                    }

                    $fontData = [
                        'name' => pathinfo($fileName, PATHINFO_FILENAME),
                        'path' => $destPath,
                        'size' => $fileSize,
                        'type' => $fileType,
                        'uploaded_at' => new MongoDB\BSON\UTCDateTime(time() * 1000)
                    ];

                    $result = $collection->insertOne($fontData);

                    if ($result->getInsertedCount() > 0) {
                        echo json_encode([
                            'status' => 'success',
                            'fontId' => (string) $result->getInsertedId(),
                            'fontName' => $fontData['name'],
                            'fontPath' => $fontData['path']
                        ]);
                    } else {
                        echo json_encode(['status' => 'error', 'message' => 'Failed to save font metadata.']);
                    }
                } catch (Exception $e) {
                    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Only TTF files are allowed.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No file uploaded or upload error.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}