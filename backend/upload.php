<?php
// Allow CORS
header("Content-Type: font/ttf");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// If this is an OPTIONS request (preflight request), stop further execution
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
            $destPath = $uploadFileDir . $fileName;

            if (move_uploaded_file($fileTmpPath, $destPath)) {
                // Generate a unique ID for the font
                $fontId = uniqid('font_');  // Using PHP's uniqid function

                echo json_encode([
                    'status' => 'success',
                    'fontId' => $fontId,  // Return the generated font ID
                    'fontName' => pathinfo($fileName, PATHINFO_FILENAME),
                    'fontPath' => $destPath
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Only TTF files are allowed.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No file uploaded or there was an error uploading the file.']);
    }
}
