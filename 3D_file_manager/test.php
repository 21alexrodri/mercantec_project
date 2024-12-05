<?php

// Configuración para mostrar errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

ini_set('log_errors', 1); // Habilitar el logging de errores
ini_set('error_log', '/var/log/apache2/error.log');


include_once '/var/www/3d_project/connection.php';


$response = [];

error_log($_POST["type"]);
try {
    uploadImg();
    if ($_POST["type"] === "stl") {
        uploadStlFiles($conn, $_POST['job_id']);
    } else if ($_POST["type"] === "zip") {
        uploadZip($_POST['job_id']);
    }
} catch (Exception $e) {
    $response[] = ['status' => 'error', 'message' => $e->getMessage()];
}

// Envía la respuesta final en JSON
echo json_encode($response);

function uploadImg() {
    global $response; // Usa el array de respuesta global
    $imgDir = '/var/www/html/3D_printer/Files/img/jobs/';
    $allowedImgExtensions = ['jpg', 'jpeg', 'png'];
    $maxFileSize = 5 * 1024 * 1024; // 5 MB

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['img_file'])) {
        $imgFile = $_FILES['img_file'];

        if ($imgFile['error'] !== UPLOAD_ERR_OK) {
            $response[] = ['status' => 'error', 'message' => 'Error al subir el archivo.'];
            return;
        }

        if ($imgFile['size'] > $maxFileSize) {
            $response[] = ['status' => 'error', 'message' => 'El archivo supera el tamaño máximo permitido.'];
            return;
        }

        $fileExtension = strtolower(pathinfo($imgFile['name'], PATHINFO_EXTENSION));
        
        if (!in_array($fileExtension, $allowedImgExtensions)) {
            $response[] = ['status' => 'error', 'message' => 'Extensión de archivo no permitida.'];
            return;
        }

        $uniqueFileName = $_POST['job_id'] . '.' . $fileExtension;
        $targetFilePath = $imgDir . $uniqueFileName;

        if (!is_writable($imgDir)) {
            $response[] = ['status' => 'error', 'message' => 'No se puede escribir en el directorio de destino.'];
            return;
        }

        if (move_uploaded_file($imgFile['tmp_name'], $targetFilePath)) {
            $response[] = ['status' => 'success', 'message' => 'Archivo subido correctamente.', 'file_path' => $targetFilePath];
        } else {
            $response[] = ['status' => 'error', 'message' => 'No se pudo guardar el archivo en el directorio de destino.'];
        }
        
    } else {
        $response[] = ['status' => 'error', 'message' => 'No se recibió ningún archivo.'];
    }
}

function uploadStlFiles($conn, $job_id) {
    global $response;
    $filesDir = '/var/www/html/3D_printer/Files/3d_files/';
    $allowedExtensions = ['stl','3mf'];

    error_log("---- COUNT: ".count($_FILES['files']['name']));
    // error_log(print_r($_FILES, true));

    if (isset($_FILES['files'])) {
        $files = $_FILES['files'];
        // error_log(" -- FILES: ".$files." --");
        foreach ($_FILES['files']['name'] as $index => $name) {
            try{
                error_log("ARCHIVO  ".$name. " EN EL INDICE ".$index);
	   
                $tmpName = $_FILES['files']['tmp_name'][$index];
                $size = $_FILES['files']['size'][$index];
                $error = $_FILES['files']['error'][$index];

                $fileExtension = strtolower(pathinfo($name, PATHINFO_EXTENSION));

                if (!in_array($fileExtension, $allowedExtensions)) {
                    $response[] = ['status' => 'error', 'message' => "Extensión de archivo no permitida para el archivo $name. Extensiones permitidas: .stl y .3mf."];
                    continue; // Saltar este archivo
                }

                $file_id = $index + 1; 
                $newFileName = "job_{$job_id}_file_{$file_id}." . $fileExtension;
                $targetPath = $filesDir . $newFileName;
                $color = "Red";
                $material = null;

                if ($error === UPLOAD_ERR_OK) {
                    if (move_uploaded_file($tmpName, $targetPath)) {
				if($material == null || $material == ""){
				$material = "undefined";
				}
                        $stmt = $conn->prepare("INSERT INTO files (job_id, file_path, color, file_weight, material) VALUES (?, ?, ?, ?, ?);");
                        $stmt->bind_param("issds", $job_id, $newFileName, $color, $size, $material);
                        $stmt->execute();
                        if ($stmt->error) {
                            $response[] = ['status' => 'success', 'message' => "File uploaded correctly."];
                        } else {
                            $response[] = ['status' => 'error', 'message' => "Error uploading file."];
                        }
                        
                    } else {
                        $response[] = ['status' => 'error', 'message' => "Error moviendo el archivo $newFileName al directorio destino."];
                    }
                } else {
                    $response[] = ['status' => 'error', 'message' => "Error subiendo el archivo $name."];
                }
            }catch(Exception $e){
                error_log($e);
            }
        }
    } else {
        $response[] = ['status' => 'error', 'message' => 'No se recibieron archivos para subir.'];
    }
}

function uploadZip($job_id) {
    global $response;
    $response[] = ['status' => 'info', 'message' => 'Función uploadZip aún no implementada.'];
}

?>
