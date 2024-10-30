<?php


$imgDir = '/var/www/html/3D_printer/Files/img/jobs/';
$allowedImgExtensions = ['jpg', 'jpeg', 'png'];
$maxFileSize = 5 * 1024 * 1024; // (5 MB)

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['img_file'])) {
    $imgFile = $_FILES['img_file'];

    if ($imgFile['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'Error al subir el archivo.']);
        exit;
    }

    if ($imgFile['size'] > $maxFileSize) {
        echo json_encode(['status' => 'error', 'message' => 'El archivo supera el tamaño máximo permitido.']);
        exit;
    }

    $fileExtension = strtolower(pathinfo($imgFile['name'], PATHINFO_EXTENSION));
    
    if (!is_array($allowedImgExtensions) || !in_array($fileExtension, $allowedImgExtensions)) {
        echo json_encode(['status' => 'error', 'message' => 'Extensión de archivo no permitida.']);
        exit;
    }

    $uniqueFileName = $_POST['job_id'] . '.' . $fileExtension;
    $targetFilePath = $imgDir . $uniqueFileName;


    error_log($imgFile["tmp_name"]);
    if (move_uploaded_file($imgFile['tmp_name'], $targetFilePath)) {
        echo json_encode(['status' => 'success', 'message' => 'Archivo subido correctamente.', 'file_path' => $targetFilePath]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo guardar el archivo.']);
    }
    
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se recibió ningún archivo.']);
}

