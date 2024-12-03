
<?php
session_start([
    'cookie_lifetime' => 86400, 
    'cookie_httponly' => true,  
    'cookie_samesite' => 'Lax', 
    'cookie_secure' => false     
]);

ini_set('log_errors', 1); 
ini_set('error_log', '/var/log/apache2/error.log');

header("Access-Control-Allow-Origin: https://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");  
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 

include_once 'connection.php';
if($_SERVER['REQUEST_METHOD']==='POST'){
    error_log("POST RECEIVED");

    $data = json_decode(file_get_contents('php://input'),true);

    if (!$data || !isset($data['arg'])) {
        error_log("Error: 'arg' is missing in the request");
        echo json_encode(['success' => false, 'message' => "Error: 'arg' is missing in the request"]);
        exit; 
    }

    $arg = $data['arg'];
    error_log("----- ARG: ".$arg." -----");

    if($arg == "getTags"){
        getTags($conn);
    }else if($arg == "getJobs"){
        $tagId = $data["tag_id"];
        $offset = $data["offset"];
        getJobs($conn,$tagId,$offset, $data["is_logged"]);
    }else if($arg == "getUser"){
	    getUser($conn, $data['username'], $data['password']);
    }else if($arg == "insertUser"){
    	$email = $data["email"];
	$username = $data["username"];
	$password = $data["password"];
	insertUser($conn, $email, $username, $password);
    }else if($arg == "getCustomer"){
	getCustomer($conn);
    }else if($arg == "getJobById"){
        $jobId = $data["jobId"];
        getJobById($conn, $jobId);
    }else if ($arg == "saveComment") {
        $jobId = $data["jobId"];
        $commentText = $data["text"];
        $date = $data["date"];
        saveComment($conn, $jobId, $commentText, $date);
    }else if ($arg == "getUserSession") {
        getUserSession($conn);
    }else if ($arg == "checkUserLoggedIn"){
    	checkUserLoggedIn($conn);
    }else if($arg == "logout"){
	logout($conn);
    }else if($arg == "toggleLike"){
    	$jobId = $data["jobId"];
    	toggleLike($conn, $jobId);
    }else if($arg == "getFilteredItems"){
	getFilteredItems($conn, $data["textname"], $data["date"], $data["tags"], $data["color"], $data["customer"], $data["material"], $data["maxlayerthickness"], $data["minlayerthickness"], $data["order"], $data["orderDirection"]);
    }else if ($arg === 'getJobFiles') {
        $jobId = $data['jobId'];
        getJobFiles($conn, $jobId);
    }else if ($arg == "checkUserLike"){
	$jobId = $data["jobId"];
	checkUserLike($conn, $jobId);
    }else if ($arg === 'getJobFileById') {
        $jobId = $data['jobId'];
        $fileId = $data['fileId'];
        getJobFileById($conn, $jobId, $fileId);
    }else if($arg == "setNewJob"){
        setNewJob($conn, $data["username"], $data["customer_name"], $data["name"], $data["description"], $data["license"], $data["layer_thickness"], $data["img_format"], $data["scale"], $data["color"], $data["material"], $data["tags"], $data["files"]);
    }else if($arg == "getAllUsers"){
	getAllUsers($conn);
    }else if($arg == "changeUserState") {
    	changeUserState($conn, $data["id"], $data["active"]);
    }else if($arg == "getJobsByUsername") {
	getJobsByUsername($conn, $data["username"]);	
    }else if($arg == "deleteJobById"){
        deleteJobById($conn, $data["id"]);
    }else if ($arg === 'getJobFilesZip') {
        $jobId = $data['jobId'];
        getJobFilesZip($conn, $jobId);
    }else if ($arg == 'getTagsByJobId') {
	$jobId = $data['jobId'];
	getTagsByJobId($conn, $jobId);
    }else if ($arg == 'newTag') {
        $isAdmin = $data['admin'];
        $tagName = $data['name'];
        addNewTag($conn,$isAdmin,$tagName);
    }else if($arg == 'getUnacceptedTags'){
        getUnacceptedTags($conn);
    }else if($arg == "modifyTags"){
        $action = $data['action'];
        $id = $data['id'];
        modifyTags($conn,$id,$action);
    }else if($arg == "newCustomer"){
        addNewCustomer($conn, $data['admin'], $data['name'], $data['email'], $data['phone'], $data['desc']);
    }else if($arg == "getCustomers"){
        getCustomers($conn);
    }else if($arg == "modifyCustomers"){
        $id = $data["id"];
        $action = $data["action"];
        modifyCustomers($conn,$id,$action);
    }else if($arg == "toggleAdmin") {
        $id = $data["id"];
        toggleAdmin($conn,$id);
    }
}

/**
 * Gets thhe jobs that a specific user has uploaded
 * @param $conn: the connection to the database
 * @param $username: the username of the user
 * @return: the jobs that the user has uploaded
 */
function getJobsByUsername($conn, $username){
    $username = htmlspecialchars(strip_tags($username));
    $sql = "
        SELECT 
            jobs.id, 
            jobs.project_name, 
            jobs.likes, 
            jobs.creation_date, 
            jobs.layer_thickness, 
            jobs.img_format, 
            users.username,
            COALESCE(SUM(files.physical_weight), 0) AS total_physical_weight
        FROM jobs
        LEFT JOIN users ON jobs.user_id = users.id
        LEFT JOIN job_tag ON jobs.id = job_tag.id_job
        LEFT JOIN tags ON job_tag.id_tag = tags.id
        LEFT JOIN customers ON jobs.customer_id = customers.id
        LEFT JOIN files ON files.job_id = jobs.id
        WHERE users.username = ?
        GROUP BY jobs.id
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    $stmt->close();

    header('Content-Type: application/json');
    echo json_encode($items);
    exit;
}

function logError($message) {
    error_log($message, 3, '/var/log/apache2/error.log'); // Cambia "/path/to/your/error.log" por la ruta de tu archivo de log
}
/**
 * Gets the tags that a job can have
 * @param $conn: the connection to the database
 * @return: the tags that a job can have
 * 
 */
function getTags($conn){
    $sql = "SELECT * FROM tags WHERE accepted = 1";
    $result = $conn->query($sql);
    $value = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $value[] = $row;
        }
    }
    header('Content-Type: application/json');
    echo json_encode($value);
}

/**
 * Gets the customers from the database
 * @param $conn: the connection to the database
 * @return: the customers from the database
 */
function getCustomer($conn){
$sql = "SELECT * FROM customers WHERE id <> 0";
$result = $conn->query($sql);
$value = array();

if($result->num_rows > 0){
	while($row = $result->fetch_assoc()){
		$value[] = $row;
	}
}
	header('Content-Type: application/json');
	echo json_encode($value);

}
/**
 * Gets the jobs for a specific tag
 * @param $conn: the connection to the database
 * @param $tagId: the id of the tag
 * @param $offset: the offset for the query
 * @return: the jobs for a specific tag
 */
function getJobs($conn, $tagId, $offset, $is_logged) {
    $tagId = htmlspecialchars(strip_tags($tagId));

    if ($is_logged) {
        $sql = "SELECT jobs.*, users.username
                FROM jobs 
                JOIN job_tag ON job_tag.id_job = jobs.id 
                JOIN users ON users.id = jobs.user_id 
                WHERE job_tag.id_tag = ?
                ORDER BY jobs.creation_date DESC, jobs.id DESC 
                LIMIT 4 OFFSET ?";
    } else {
        $sql = "SELECT jobs.*, users.username
                FROM jobs 
                JOIN job_tag ON job_tag.id_job = jobs.id 
                JOIN users ON users.id = jobs.user_id 
                WHERE job_tag.id_tag = ? AND license = 0
                ORDER BY jobs.creation_date DESC, jobs.id DESC 
                LIMIT 4 OFFSET ?";
    }
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $tagId, $offset);
    $stmt->execute();
    $results = $stmt->get_result();
    

	if($is_logged) {
	    $sqlCount = "SELECT COUNT(*) as total_count 
                 FROM jobs 
                 JOIN job_tag ON job_tag.id_job = jobs.id 
                 WHERE job_tag.id_tag = ?";

	}else{
		$sqlCount = "SELECT COUNT(*) as total_count 
                 FROM jobs 
                 JOIN job_tag ON job_tag.id_job = jobs.id 
                 WHERE job_tag.id_tag = ? AND license = 0";

	}                 
    $stmtCount = $conn->prepare($sqlCount);
    $stmtCount->bind_param("i", $tagId);
    $stmtCount->execute();
    $countResult = $stmtCount->get_result();

    $value = array();
    $count = 0;

    if ($countResult && $countResult->num_rows > 0) {
        $countRow = $countResult->fetch_assoc();
        $count = $countRow['total_count'];
    }

    if ($results->num_rows > 0) {
        while ($row = $results->fetch_assoc()) {
            $value[] = $row;
        }
    }

    $response = array(
        'jobs' => $value,
        'count' => $count
    );

    header('Content-Type: application/json');
    echo json_encode($response);
}

/**
 * Gets all the users from the database
 * @param $conn: the connection to the database
 * @return: all the users from the database
 */
function getAllUsers($conn){
 $sql = "SELECT id, username, user_password, email, is_admin, date_created, active FROM users";
 $result = $conn->query($sql);
    $value = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $value[] = $row;
        }
    }
    header('Content-Type: application/json');
    echo json_encode($value); 
}
/**
 * Used for the log in, checks if the user exists and if the password is correct
 * @param $conn: the connection to the database
 * @param $username: the username of the user
 * @param $password: the password of the user
 * 
 */
function getUser($conn, $username, $password) {
    $username = htmlspecialchars(strip_tags($username));

    $stmt = $conn->prepare("SELECT id, user_password, is_admin, active FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $userId = '';
        $hashedPassword = '';
        $isAdmin = 0;
	$active = 0;

        $stmt->bind_result($userId, $hashedPassword, $isAdmin, $active);
        $stmt->fetch();

        if ($active == 1 && password_verify($password, $hashedPassword)) {
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['is_admin'] = $isAdmin;


            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => [
                    'user_id' => $userId,
                    'username' => $username,
                    'is_admin' => $isAdmin
                ]
            ]);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }

    $stmt->close();
}
function checkUserLoggedIn($conn) {

    if (isset($_SESSION['user_id'])) {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
	  'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'is_admin' => $_SESSION['is_admin']
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'User not logged in'
        ]);
    }

    exit();
}
function logout($conn){
    session_unset();
    session_destroy();

    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Logged out successfully']);
}
function isAdmin() {
    session_start();
    
    if (!isset($_SESSION['user_id'])) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    if ($_SESSION['is_admin'] !== 1) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'No admin rights']);
        exit;
    }

    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'You are an admin']);
}

/**
 * The controller for the sign in username
 * @param $username: the username to check
 * @param $checkval: the value to check
 */
function usernameChecker($username, $checkval){

	// 1 = mayus detector
	// 2 = space detector
	// 3 = special characters detector
	if($checkval == 1){
		return preg_match('/[A-Z]/',$username) === 1;
	} else if($checkval == 2){
		return preg_match('/\s/', $username) === 1;
	} else if($checkval == 3){
		return preg_match('/[^a-zA-Z0-9]/', $username) === 1;
	}
}

/**
 * Securely inserts a new user into the database.
 * @param $conn: the connection to the database
 * @param $email: the email of the user
 * @param $username: the username of the user
 * @param $password: the password of the user
 */
function insertUser($conn, $email, $username, $password){

    $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        return;
    }


    $username = trim($username);
    $usernamePattern = '/^[a-zA-Z0-9_-]{3,20}$/';
    if (!preg_match($usernamePattern, $username)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Invalid username format']);
        return;
    }


    if (strlen($password) < 8) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 8 characters long']);
        return;
    }


    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = ? OR username = ?");
    if ($stmt === false) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        return;
    }
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    if ($count > 0) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Email or username already exists']);
        return;
    }


    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);


    $dateCreated = date('Y-m-d');


    $stmt = $conn->prepare("INSERT INTO users (email, username, user_password, date_created) VALUES (?, ?, ?, ?)");
    if ($stmt === false) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
        return;
    }

    $stmt->bind_param("ssss", $email, $username, $hashedPassword, $dateCreated);


    if ($stmt->execute()) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'User created successfully']);
    } else {

        error_log("Database error: " . $stmt->error);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Failed to create user. Please try again later.']);
    }

    $stmt->close();
}

/**
 * Change the state of a user from active to inactive or vice versa
 */
function changeUserState($conn, $id, $active) {
    $id = htmlspecialchars(strip_tags($id));
    $newActive = $active == 1 ? 0 : 1; 

    $sql = "UPDATE users SET active = active XOR 1 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        error_log("EJECUTA EL CAMBIO");
        echo json_encode(['status' => 'success', 'message' => 'User state changed']);
    } else {
        error_log("Failed to change user state for ID: $id");
        echo json_encode(['status' => 'error', 'message' => 'Failed to change user state']);
    }
    return;
}
/**
 * Gets a job by its id
 * @param $conn: the connection to the database
 * @param $jobId: the id of the job
 * 
 */
function getJobById($conn, $jobId) {
    $jobId = htmlspecialchars(strip_tags($jobId)); 

    $sqlJob = "SELECT jobs.project_name AS title, 
                    jobs.project_description AS description, 
                    jobs.license, 
                    jobs.likes, 
                    jobs.layer_thickness, 
                    jobs.creation_date, 
                    jobs.color, 
                    jobs.img_format, 
                    users.username AS owner, 
                    customers.customer_name AS customer_name
                FROM printer_archive.jobs 
                JOIN printer_archive.users ON jobs.user_id = users.id
                LEFT JOIN printer_archive.customers ON jobs.customer_id = customers.id
                WHERE jobs.id = ?";

    $sqlImages = "SELECT file_path 
                  FROM printer_archive.files 
                  WHERE job_id = ?";

    $sqlComments = "SELECT job_comments.pr_comment AS comment, job_comments.date_comment AS date, users.username 
                    FROM printer_archive.job_comments 
                    JOIN printer_archive.users ON job_comments.id_user = users.id 
            	    WHERE job_comments.id_job = ? 
                    ORDER BY job_comments.id_job DESC";

    // Solo dos parámetros son necesarios aquí, $jobId y $jobId
    $sqlOtherJobs = "SELECT id, project_name AS title, likes 
                     FROM printer_archive.jobs 
                     WHERE user_id = (SELECT user_id FROM printer_archive.jobs WHERE id = ?) 
                     AND id != ?
		     LIMIT 15"; 

    $stmtJob = $conn->prepare($sqlJob);
    $stmtJob->bind_param("i", $jobId);
    $stmtJob->execute();
    $jobResult = $stmtJob->get_result();

    if ($jobResult->num_rows === 0) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Job not found']);
        return;
    }

    $jobData = $jobResult->fetch_assoc();

    $stmtImages = $conn->prepare($sqlImages);
    $stmtImages->bind_param("i", $jobId);
    $stmtImages->execute();
    $imagesResult = $stmtImages->get_result();
    $images = [];

    while ($row = $imagesResult->fetch_assoc()) {
        $images[] = $row['file_path'];
    }

    $stmtComments = $conn->prepare($sqlComments);
    $stmtComments->bind_param("i", $jobId);
    $stmtComments->execute();
    $commentsResult = $stmtComments->get_result();
    $comments = [];

    while ($row = $commentsResult->fetch_assoc()) {
        $comments[] = [
            'username' => $row['username'],
            'text' => $row['comment'],
	        'date' => $row['date']
        ];
    }

    // Corrección aquí: solo dos parámetros para bind_param
    $stmtOtherJobs = $conn->prepare($sqlOtherJobs);
    $stmtOtherJobs->bind_param("ii", $jobId, $jobId);
    $stmtOtherJobs->execute();
    $otherJobsResult = $stmtOtherJobs->get_result();
    $otherJobs = [];

    while ($row = $otherJobsResult->fetch_assoc()) {
        $otherJobs[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'likes' => $row['likes']
        ];
    }

    $response = [
        'status' => 'success',
        'job' => [
            'title' => $jobData['title'],
            'description' => $jobData['description'],
            'license' => $jobData['license'],
            'likes' => $jobData['likes'],
            'layer_thickness' => $jobData['layer_thickness'],
            'creation_date' => $jobData['creation_date'],
            'color' => $jobData['color'],
            'owner' => $jobData['owner'],
            'images' => $images,
            'comments' => $comments,
            'customer' => $jobData['customer_name'],
	    'img_format' => $jobData['img_format']
        ],
        'otherJobs' => $otherJobs
    ];

    header('Content-Type: application/json');
    echo json_encode($response);

    $stmtJob->close();
    $stmtImages->close();
    $stmtComments->close();
    $stmtOtherJobs->close();
}/**
 * Gets the job file by the username of the user
 */
function getJobByUsername($conn, $username){
	$username = htmlspecialchars(strip_tags($username));
	 $sql = "
            SELECT 
                jobs.id, 
                jobs.project_name, 
                jobs.likes, 
                jobs.creation_date, 
                jobs.layer_thickness, 
                jobs.img_format, 
                users.username,
                COALESCE(SUM(files.physical_weight), 0) AS total_physical_weight
            FROM jobs
            LEFT JOIN users ON jobs.user_id = users.id
            LEFT JOIN job_tag ON jobs.id = job_tag.id_job
            LEFT JOIN tags ON job_tag.id_tag = tags.id
            LEFT JOIN customers ON jobs.customer_id = customers.id
            LEFT JOIN files ON files.job_id = jobs.id
            WHERE users.username = ?
        ";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param("s",$username);
	$stmt->execute();
	$result = $stmt->get_result();
	$items = [];
	while ($row = $result->fetch_assoc()) {
		$items[] = $row;
	}
	$stmt->close();

        header('Content-Type: application/json');
        echo json_encode($items);
        exit;
	
}

/**
 * Gets all the jobs from the database that have the specified filters
 * @param $conn: the connection to the database
 * @param $textname: the name of the job
 * @param $date: the date of the job
 * @param $tags: the tags of the job
 * @param $colors: the colors of the job
 * @param $customer: the customer of the job
 * @param $material: the material of the job
 * @param $maxlayerthickness: the maximum layer thickness of the job
 * @param $minlayerthickness: the minimum layer thickness of the job
 * @param $order: the order of the job
 * @param $orderDirection: the order direction of the job
 */
function getFilteredItems($conn, $textname, $date, $tags, $colors, $customer, $material, $maxlayerthickness, $minlayerthickness, $order, $orderDirection ) {
    if ($order === "name") {
        $order = "jobs.project_name";
    } elseif ($order === "username") {
        $order = "users.username";
    } elseif ($order === "date") {
        $order = "jobs.creation_date";
    } elseif ($order === "likes") {
        $order = "jobs.likes";
    } elseif ($order === "layerthickness") {
        $order = "jobs.layer_thickness";
    } elseif ($order === "weight") {
        $order = "total_physical_weight";
    } else {
        $order = "";
    }

    $orderDirection = strtoupper($orderDirection);
    if ($orderDirection !== 'ASC' && $orderDirection !== 'DESC') {
        $orderDirection = 'ASC'; 
    }

    try {
        $query = "
            SELECT 
                jobs.id, 
                jobs.project_name,
	      jobs.license, 
                jobs.likes, 
                jobs.creation_date, 
                jobs.layer_thickness, 
                jobs.img_format, 
                users.username,
                COALESCE(SUM(files.physical_weight), 0) AS total_physical_weight
            FROM jobs
            LEFT JOIN users ON jobs.user_id = users.id
            LEFT JOIN job_tag ON jobs.id = job_tag.id_job
            LEFT JOIN tags ON job_tag.id_tag = tags.id
            LEFT JOIN customers ON jobs.customer_id = customers.id
            LEFT JOIN files ON files.job_id = jobs.id
            WHERE 1=1
        ";

        $params = [];
        $types = '';

        // Sanitize and validate inputs
        $textname = htmlspecialchars(strip_tags(trim($textname)));
        $date = htmlspecialchars(strip_tags(trim($date)));
        $colors = htmlspecialchars(strip_tags(trim($colors)));
        $material = htmlspecialchars(strip_tags(trim($material)));
        $customer_name = htmlspecialchars(strip_tags(trim($customer)));

        // Handle customer ID
        $customer_id = null;
        if (!empty($customer_name)) {
            $stmt_customer = $conn->prepare("SELECT id FROM customers WHERE customer_name = ?");
            $stmt_customer->bind_param('s', $customer_name);
            $stmt_customer->execute();
            $result_customer = $stmt_customer->get_result();
            if ($row_customer = $result_customer->fetch_assoc()) {
                $customer_id = $row_customer['id'];
            } else {
                header('Content-Type: application/json');
                echo json_encode([]);
                exit;
            }
            $stmt_customer->close();
        }

        // Build WHERE conditions
        if (!empty($textname)) {
            $query .= " AND jobs.project_name LIKE ?";
            $params[] = '%' . $textname . '%';
            $types .= 's';
        }

        if (!empty($date)) {
            if (DateTime::createFromFormat('Y-m-d', $date) !== false) {
                $query .= " AND DATE(jobs.creation_date) = ?";
                $params[] = $date;
                $types .= 's';
            } else {
                throw new Exception('Invalid date format. Expected YYYY-MM-DD.');
            }
        }

        if (!empty($tags) && is_array($tags)) {
            $sanitizedTags = [];
            foreach ($tags as $tag) {
                $sanitizedTag = htmlspecialchars(strip_tags(trim($tag)));
                if (!empty($sanitizedTag)) {
                    $sanitizedTags[] = $sanitizedTag;
                }
            }
            if (!empty($sanitizedTags)) {
                $tagPlaceholders = implode(',', array_fill(0, count($sanitizedTags), '?'));
                $query .= " AND tags.name_tag IN ($tagPlaceholders)";
                foreach ($sanitizedTags as $tag) {
                    $params[] = $tag;
                    $types .= 's';
                }
            }
        }

        if (!empty($colors)) {
            $query .= " AND jobs.color = ?";
            $params[] = $colors;
            $types .= 's';
        }

        if (!empty($customer_id)) {
            $query .= " AND jobs.customer_id = ?";
            $params[] = $customer_id;
            $types .= 'i';
        }

        if (!empty($material)) {
            $query .= " AND jobs.material LIKE ?";
            $params[] = '%' . $material . '%';
            $types .= 's';
        }

        if (!empty($minlayerthickness)) {
            $minlayerthickness = floatval($minlayerthickness);
            $query .= " AND jobs.layer_thickness >= ?";
            $params[] = $minlayerthickness;
            $types .= 'd';
        }

        if (!empty($maxlayerthickness)) {
            $maxlayerthickness = floatval($maxlayerthickness);
            $query .= " AND jobs.layer_thickness <= ?";
            $params[] = $maxlayerthickness;
            $types .= 'd';
        }

        $query .= " GROUP BY jobs.id";

        // Append ORDER BY clause if $order is not empty
        if (!empty($order)) {
            $query .= " ORDER BY " . $order . " " . $orderDirection;
        }

        $stmt = $conn->prepare($query);
        if ($stmt === false) {
            throw new Exception('Prepare error: ' . $conn->error);
        }

        if (!empty($params)) {
            $bind_params = [];
            $bind_params[] = & $types;
            for ($i = 0; $i < count($params); $i++) {
                $bind_params[] = & $params[$i];
            }
            call_user_func_array([$stmt, 'bind_param'], $bind_params);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        $stmt->close();

        header('Content-Type: application/json');
        echo json_encode($items);
        exit;

    } catch (Exception $e) {
        header('Content-Type: application/json', true, 500);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

/**
 * This function saves a comment in the database
 * @param $conn: the connection to the database
 * @param $jobId: the id of the job
 * @param $commentText: the text of the comment
 * @param $date: the date of the comment
 * 
 */
function saveComment($conn, $jobId, $commentText, $date) {
    if (!isset($_SESSION['username'])) {
        echo json_encode(['status' => 'error', 'message' => 'You have to be logged in to comment']);
        return;
    }

    $username = $_SESSION['username'];
    $date = date('Y-m-d');


    if (empty($jobId) || empty($commentText)) {
        echo json_encode(['status' => 'error', 'message' => 'There are missing fields']);
        return;
    }

    $query = $conn->prepare("INSERT INTO job_comments (id_job, id_user, pr_comment, date_comment) VALUES (?, (SELECT id FROM users WHERE username = ?), ?, ?)");
    if (!$query) {
        echo json_encode(['status' => 'error', 'message' => 'Error. ' . $conn->error]);
        return;
    }
    $query->bind_param("isss", $jobId, $username, $commentText, $date);

    if ($query->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error. ' . $query->error]);
    }
}

function getUserSession($conn) {
    if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
        echo json_encode([
            'status' => 'success',
            'user' => [
                'user_id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'is_admin' => $_SESSION['is_admin'] ?? 0 
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No active session']);
    }
}

/**
 * Function to toggle a like on a job
 * @param $conn: the connection to the database
 * @param $jobId: the id of the job
 */
function toggleLike($conn, $jobId) {
    try {
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'You have to be logged in to like a job']);
            return;
        }

        $userId = $_SESSION['user_id'];

        $checkQuery = "SELECT * FROM user_likes WHERE user_id = ? AND job_id = ?";
        $stmtCheck = $conn->prepare($checkQuery);
        $stmtCheck->bind_param("ii", $userId, $jobId);
        $stmtCheck->execute();
        $result = $stmtCheck->get_result();

        if ($result->num_rows > 0) {
            error_log("Eliminando like para el usuario $userId en job $jobId");

            $deleteLikeQuery = "DELETE FROM user_likes WHERE user_id = ? AND job_id = ?";
            $stmtDelete = $conn->prepare($deleteLikeQuery);
            $stmtDelete->bind_param("ii", $userId, $jobId);
            $stmtDelete->execute();

            $updateJobLikesQuery = "UPDATE jobs SET likes = likes - 1 WHERE id = ?";
            $stmtUpdate = $conn->prepare($updateJobLikesQuery);
            $stmtUpdate->bind_param("i", $jobId);
            $stmtUpdate->execute();

            echo json_encode(['status' => 'success', 'message' => 'Like deleted successfully.']);
        } else {
            error_log("Anadiendo like para el usuario $userId al job $jobId");

            $insertLikeQuery = "INSERT INTO user_likes (user_id, job_id) VALUES (?, ?)";
            $stmtInsert = $conn->prepare($insertLikeQuery);
            $stmtInsert->bind_param("ii", $userId, $jobId);
            $stmtInsert->execute();

            $updateJobLikesQuery = "UPDATE jobs SET likes = likes + 1 WHERE id = ?";
            $stmtUpdate = $conn->prepare($updateJobLikesQuery);
            $stmtUpdate->bind_param("i", $jobId);
            $stmtUpdate->execute();

            echo json_encode(['status' => 'success', 'message' => 'Like added successfully.']);
        }

        $stmtCheck->close();
    } catch (Exception $e) {
        error_log("Error en toggleLike: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    }
}

/**
 * Function to check if the user has liked a job
 * @param $conn: the connection to the database
 * @param $jobId: the id of the job
 */
function checkUserLike($conn, $jobId) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'You have to be logged in to like a job']);
        return;
    }

    $userId = $_SESSION['user_id'];

    $checkQuery = "SELECT * FROM user_likes WHERE user_id = ? AND job_id = ?";
    $stmtCheck = $conn->prepare($checkQuery);
    $stmtCheck->bind_param("ii", $userId, $jobId);
    $stmtCheck->execute();
    $result = $stmtCheck->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'success', 'liked' => true]);
    } else {
        echo json_encode(['status' => 'success', 'liked' => false]);
    }

    $stmtCheck->close();
}

/**
 * Function to get the files of a job
 */
function getJobFiles($conn, $jobId) {
    $jobId = htmlspecialchars(strip_tags($jobId));

    $sql = "SELECT id, file_path, color, scale, physical_weight, file_weight, material 
            FROM printer_archive.files 
            WHERE job_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $jobId);
    $stmt->execute();
    $result = $stmt->get_result();
    $files = [];

    while ($row = $result->fetch_assoc()) {
        $files[] = [
            'id' => $row['id'],
            'file_path' => $row['file_path'],
            'color' => $row['color'],
            'scale' => $row['scale'],
            'physical_weight' => $row['physical_weight'],
            'file_weight' => $row['file_weight'],
            'material' => $row['material'],
        ];
    }

    header('Content-Type: application/json');
    if (count($files) > 0) {
        echo json_encode(['status' => 'success', 'files' => $files]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No files found for this job']);
    }

    $stmt->close();
}
/**
 * Function to create a new job
 * @param $conn: the connection to the database
 * @param $username: the username of the user
 * @param $customer_name: the name of the customer
 * @param $name: the name of the job
 * @param $desc: the description of the job
 * @param $license: the license of the job
 * @param $layer_thickness: the layer thickness of the job
 * @param $img_format: the image format of the job
 * @param $scale: the scale of the job
 * @param $color: the color of the job
 * @param $material: the material of the job
 * @param $tags: an array with the tags of a job
 * @param $files: an array with the file details of the job
 */
function setNewJob($conn, $username, $customer_name, $name, $desc, $license, $layer_thickness, $img_format, $scale, $color, $material, $tags, $files) {
    try {
        // Sanitize input fields to prevent script injections
        $name = htmlspecialchars(trim($name));
        $desc = htmlspecialchars(trim($desc));
        $color = htmlspecialchars(trim($color));
        $material = htmlspecialchars(trim($material));
        $customer_name = htmlspecialchars(trim($customer_name));

        // Validate required fields
        if (empty($files) || count($files) === 0) {
            echo json_encode(['success' => false, 'message' => 'You must upload at least one file.']);
            return;
        }
        if (empty($name) || trim($name) == "") {
            echo json_encode(['success' => false, 'message' => 'Missing required field name']);
            return;
        } else if (empty($layer_thickness) || trim($layer_thickness) == "") {
            echo json_encode(['success' => false, 'message' => 'Missing required field layer thickness']);
            return;
        }else if (empty($tags) || count($tags) === 0 || $tags.length === 0) {
            echo json_encode(['success' => false, 'message' => 'You must select at least one tag.']);
            return;
        }else if (empty($scale) || trim($scale) == "") {
            echo json_encode(['success' => false, 'message' => 'Missing required field scale']);
            return;
        } else if (empty($material) || trim($material) == "") {
            $material = "undefined";
        } else if (empty($color) || trim($color) == "") {
            $color = "undefined";
        }

        // Validate and sanitize img_format
        $allowed_img_formats = ['png', 'jpg', 'jpeg', '.png', '.jpg', '.jpeg'];
        if (trim($img_format) != "") {
            if (!in_array(strtolower($img_format), $allowed_img_formats)) {
                echo json_encode(['success' => false, 'message' => 'Incorrect image format, ' . $img_format]);
                return;
            }
        }

        // Validate and constrain layer thickness
        $layer_thickness = floatval($layer_thickness);
        if ($layer_thickness < 0.01) $layer_thickness = 0.01;
        if ($layer_thickness > 1) $layer_thickness = 1;

        // Validate and constrain scale
        $scale = floatval($scale);
        if ($scale < 0.1) $scale = 0.1;

        $creation_date = date("Y-m-d");

        // Get user ID and validate existence
        $user_id = getUserID($conn, $username);
        if ($user_id === null) {
            throw new Exception("User not found");
        }

        // Get customer ID and validate existence
        $customer_id = getCustomerID($conn, $customer_name);
        if ($customer_id === null) {
            throw new Exception("Customer not found");
        }

        // **Validate file extensions**
        $allowed_file_extensions = ['stl', '3mf'];
        foreach ($files as $file) {
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($extension, $allowed_file_extensions)) {
                echo json_encode(['success' => false, 'message' => 'Invalid file extension: ' . $extension . '. Only .stl and .3mf files are allowed.']);
                return;
            }
        }

        // Insert job details into jobs table
        $stmt = $conn->prepare("INSERT INTO jobs (user_id, customer_id, project_name, project_description, license, layer_thickness, creation_date, color, img_format, material) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iissidssss", $user_id, $customer_id, $name, $desc, $license, $layer_thickness, $creation_date, $color, $img_format, $material);

        if ($stmt->execute()) {
            $job_id = $conn->insert_id;

            // Insert tags if they exist
            if (!empty($tags)) {
                $tagStmt = $conn->prepare("INSERT INTO job_tag (id_job, id_tag) VALUES (?, ?)");
                foreach ($tags as $tag_id) {
                    $tag_id = intval($tag_id); // Ensure it's an integer
                    $tagStmt->bind_param("ii", $job_id, $tag_id);
                    $tagStmt->execute();
                }
                $tagStmt->close();
            }

            // Insert file details for each file
            $fileStmt = $conn->prepare("INSERT INTO files (job_id, file_path, color, scale, physical_weight, file_weight, material, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            if (!$fileStmt) {
                echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
                return;
            }
            foreach ($files as $index => $file) {
                // Generate file path
                $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $file_path = "job_{$job_id}_file_" . ($index + 1) . "." . $file_extension;

                // Constrain and sanitize file-specific fields
                $file_color = htmlspecialchars(!empty($file['color']) ? $file['color'] : $color);
                $file_scale = floatval(!empty($file['scale']) ? $file['scale'] : $scale);
                if ($file_scale < 0.1) $file_scale = 0.1;

                $physical_weight = floatval(!empty($file['weight']) ? $file['weight'] : 1);
                if ($physical_weight < 0.1) $physical_weight = 0.1;

                $file_weight = 1;  // Fixed value as specified
                $file_name = htmlspecialchars(!empty($file['name']) ? $file['name'] : 'unknown');

                if (!$fileStmt->bind_param("issdddss", $job_id, $file_path, $file_color, $file_scale, $physical_weight, $file_weight, $material, $file_name)) {
                    echo json_encode(['success' => false, 'message' => 'Failed to bind parameters: ' . $fileStmt->error]);
                    return;
                }

                if (!$fileStmt->execute()) {
                    echo json_encode(['success' => false, 'message' => 'Failed to execute statement: ' . $fileStmt->error]);
                    return;
                }
            }
            $fileStmt->close();

            echo json_encode(['success' => true, 'message' => 'Project created successfully', 'generated_id' => $job_id]);
        } else {
            error_log("Failed to insert project: " . $stmt->error);
            echo json_encode(['success' => false, 'message' => 'Failed to insert project: ' . $stmt->error]);
        }

    } catch (Exception $e) {
        error_log("Error in setNewJob: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}
/**
 * Function to get the id of the user
 * @param $conn: the connection to the database
 * @param $username: the username of the user
 */
function getUserID($conn,$username) {
    
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    return $user ? $user['id'] : null; 
}

/**
 * Function to get the id of the customer
 * @param $conn: the connection to the database
 * @param $customer: the name of the customer
 */
function getCustomerID($conn,$customer) {
    
    $stmt = $conn->prepare("SELECT id FROM customers WHERE customer_name = ?");
    $stmt->bind_param("s", $customer);
    $stmt->execute();
    $result = $stmt->get_result();
    $customer = $result->fetch_assoc();

    return $customer ? $customer['id'] : null; 
}

/**
 * Function to upload a file
 * @param $file: the file to upload
 * @param $allowedExtensions: the allowed extensions for the file
 * @param $uploadDir: the directory to upload the file
 */
function uploadFile($file, $allowedExtensions, $uploadDir) {
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($fileExtension, $allowedExtensions)) {
        throw new Exception("Invalid file extension");
    }
    $uploadPath = $uploadDir . basename($file['name']);
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception("FIle upload failed");
    }
    return $uploadPath;
}
/**
 * Function to extract and filter a zip file
 * @param $file: the file to extract and filter
 * @param $allowedExtensions: the allowed extensions for the file
 */
function extractAndFilterZip($file, $allowedExtensions) {
    $file = htmlspecialchars(strip_tags($file));
    
    $zip = new ZipArchive;
    $filePaths = [];
    if ($zip->open($file['tmp_name']) === TRUE) {
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            $fileExtension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            if (in_array($fileExtension, $allowedExtensions)) {
                $zip->extractTo('models/', $filename);
                $filePaths[] = 'models/' . $filename;
            }
        }
        $zip->close();
    } else {
        throw new Exception("Unable to open ZIP file.");
    }
    return $filePaths;
}
/**
 * Function to get the job file by its id
 * @param $conn: the connection to the database
 * @param $jobId: the id of the job
 * @param $fileId: the id of the file
 */
function getJobFileById($conn, $jobId, $fileId) {
    $sql = "SELECT file_path FROM files WHERE job_id = ? AND id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $jobId, $fileId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $fileExtension = pathinfo($row['file_path'], PATHINFO_EXTENSION); // Obtén la extensión
        $fileName = "job_" . $jobId . "_file_" . $fileId . "." . $fileExtension;

        header('Content-Type: application/json');
        echo json_encode(array(
            'status' => 'success',
            'file_name' => $fileName,
            'file_path' => "/3D_printer/Files/slt/" . $fileName
        ));
    } else {
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'error', 'message' => 'File not found'));
    }
}
/**
 * Function to delete a job by its id
 * @param $conn: the connection to the database
 * @param $jobId: the id of the job
 */
function deleteJobById( $conn, $jobId) {
    error_log("Enters function");
    $sql = 'DELETE FROM jobs WHERE id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $jobId);
    if($stmt->execute()){
        $result = array('status' => 'success');
        error_log("Delete succesful");
    }else{
        $result = array('status'=> 'error', 'message'=> 'error on sql delete');
        error_log("Delete failed");
        echo json_encode($result);
        exit;
    }

    $filesDir = "/var/www/html/3D_printer/Files/3d_files/";
    $imgDir = "/var/www/html/3D_printer/Files/img/jobs/";

    $filePattern = $filesDir . "job_" . $jobId . "_file_*.*";

    $filesToDelete = glob($filePattern);

    foreach( $filesToDelete as $file ) {
        if(is_file($file)){
            error_log("File exists");
            if(unlink($file)){
                error_log("File delete succesful");
            }else{
                error_log("File delete failed");
            }
            
        }else{
            error_log("File does not exist");
        }
    }

    $imgPattern = $imgDir . $jobId .".*";

    $imgToDelete = glob($imgPattern);

    foreach($imgToDelete as $img){
        if(is_file($img)){
            error_log("Image exists");
            if(unlink($img)){
                error_log("Image delete succesful");
            }else{
                error_log("Image delete failed");
            }
        }else{
            error_log("Image does not exist");
        }
    }
    echo json_encode($result);
}

function getJobFilesZip($conn, $jobId) {
    $jobId = htmlspecialchars(strip_tags($jobId));
    $sql = "SELECT file_path FROM printer_archive.files WHERE job_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $jobId);
    $stmt->execute();
    $result = $stmt->get_result();
    $files = [];

    $count = 1;
    while ($row = $result->fetch_assoc()) {
        // Cambia la ruta del archivo al URL público
        $filePath = "/3D_printer/Files/3d_files/" . $row['file_path'];
        $files[] = [
            'file_url' => $filePath,
            'file_name' => "job_" . $jobId . "_file_" . $count . "." . pathinfo($row['file_path'], PATHINFO_EXTENSION)
        ];
        $count++;
    }
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'files' => $files]);

    $stmt->close();
}

function getTagsByJobId($conn, $jobId) {
    $jobId = htmlspecialchars(strip_tags($jobId)); 

    $sql = "SELECT tags.id, tags.name_tag 
            FROM tags 
            JOIN job_tag ON tags.id = job_tag.id_tag 
            WHERE job_tag.id_job = ? AND accepted = 1";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $jobId);
    $stmt->execute();
    $result = $stmt->get_result();

    $tags = [];
    while ($row = $result->fetch_assoc()) {
        $tags[] = $row;
    }

    $stmt->close();

    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'tags' => $tags]);
}

function addNewTag($conn, $isAdmin, $tagName){
    $tagName = htmlspecialchars(strip_tags($tagName));
    $accepted = $isAdmin == true ? 1 : 0;

    $sql = "INSERT INTO tags(name_tag,accepted) VALUES (?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si",$tagName,$accepted);

    if($stmt->execute()){
        echo json_encode(['success' => true, 'message' => "New tag suggested correctly"]);
    }
}

function getUnacceptedTags($conn){

    $sql = "SELECT * FROM tags ORDER BY accepted";
    $result = $conn->query($sql);
    $value = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $value[] = $row;
        }
    }
    header('Content-Type: application/json');
    echo json_encode($value);
}

function modifyTags($conn,$id,$action){
    if($action == 'decline' || $action == 'delete'){
        error_log("Entra en eliminar");
        $sql = 'DELETE FROM tags WHERE id = ?';
        $msg = "Tag deleted";
    }else if($action == 'disable'){
        $sql = 'UPDATE tags SET accepted = 0 WHERE id = ?';
        $msg = "Tag disabled";
    }else if($action == 'accept'){
        $sql = 'UPDATE tags SET accepted = 1 WHERE id = ?';
        $msg = "Tag accepted";
    }else{
        return;
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$id);

    if($stmt->execute()){
        echo json_encode(["success" => true,"message" => $msg]);
    }else{
        echo json_encode(["success" => false,"message" => "ERROR modifying the query"]);
    }
}

function addNewCustomer($conn, $isAdmin, $customerName, $customerMail, $customerPhone, $customerDesc){

    $customerName = htmlspecialchars(strip_tags($customerName));
    $customerMail = htmlspecialchars(strip_tags($customerMail));
    $customerPhone = htmlspecialchars(strip_tags($customerPhone));
    $customerDesc = htmlspecialchars(strip_tags($customerDesc));
    $isAdmin = $isAdmin == true ? 1 : 0;

    $sql = "INSERT INTO customers(customer_name, email, phone, short_desc, accepted) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $customerName, $customerMail, $customerPhone, $customerDesc, $isAdmin);

    if($stmt->execute()){
        echo json_encode(['success' => true, 'message' => "New customer added correctly"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Error adding new customer"]);
    }
}

function getCustomers($conn){

    $sql = "SELECT * FROM customers ORDER BY accepted";
    $result = $conn->query($sql);
    $value = array();

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $value[] = $row;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($value);
}

function modifyCustomers($conn,$id,$action){

    error_log("Entra en modify customers");
    if($action == 'decline' || $action == 'delete'){

	error_log("Entra en eliminar customers");
        $sql = 'DELETE FROM customers  WHERE id = ?';
        $msg = "Customer ".$action."d";
    }else if($action == 'disable'){
        error_log("Entra en disable customers");
        $sql = 'UPDATE customers SET accepted = 0 WHERE id = ?';
        $msg = "Customer disabled";
    }else if($action == 'accept'){
        error_log("Entra en accept customers");
        $sql = 'UPDATE customers SET accepted = 1 WHERE id = ?';
        $msg = "Customer accepted";
    }else{
        return;
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$id);

    if($stmt->execute()){
        echo json_encode(["success" => true,"message" => $msg]);
    }else{
        echo json_encode(["success" => false,"message" => "ERROR modifying the query"]);
    }
}

function toggleAdmin($conn,$id){
    $sql = "UPDATE users SET admin = admin XOR 1 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt -> bind_param("i",$id);
    
    if($stmt->execute()){
        echo json_encode(["success" => true,"message" => "Admin updated succesfully"]);
    }else{
        echo json_encode(["success" => false,"message" => "ERROR modifying the query"]);
    }

}

$conn->close();

?>