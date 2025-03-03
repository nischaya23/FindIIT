<?php
session_start();
require 'db_config.php'; // Database connection file
require 'otp_service.php'; // OTP sending service (to be implemented)

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $fullName = trim($_POST["full-name"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone-number"]);
    $password = trim($_POST["password"]);
    
    // Basic validation
    if (empty($fullName) || empty($email) || empty($phone) || empty($password)) {
        die("All fields are required.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/@iitk\.ac\.in$/', $email)) {
        die("Invalid IITK email address.");
    }

    if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
        die("Invalid phone number.");
    }

    // Hash password for security
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Generate OTP (6-digit random number)
    $otp = rand(100000, 999999);

    // Store OTP in session for verification later
    $_SESSION["otp"] = $otp;
    $_SESSION["email"] = $email;

    // Send OTP via email (Implement in `otp_service.php`)
    if (!sendOTP($email, $otp)) {
        die("Failed to send OTP. Please try again.");
    }

    // Store user details in the database (without OTP)
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $fullName, $email, $phone, $hashedPassword);

    if ($stmt->execute()) {
        // Redirect to OTP verification page
        header("Location: otp.html?email=" . urlencode($email));
        exit();
    } else {
        die("Error: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} else {
    die("Invalid request.");
}
?>

<!--OTP sending can be sort of done as follows  -->
<!-- 
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require 'vendor/autoload.php'; // PHPMailer Library

// function sendOTP($email, $otp) {
//     $mail = new PHPMailer(true);

//     try {
//         // SMTP configuration
//         $mail->isSMTP();
//         $mail->Host = 'smtp.gmail.com'; // SMTP server
//         $mail->SMTPAuth = true;
//         $mail->Username = 'your-email@gmail.com'; // Your email
//         $mail->Password = 'your-email-password'; // App password
//         $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
//         $mail->Port = 587;

//         // Email settings
//         $mail->setFrom('your-email@gmail.com', 'Find IIT');
//         $mail->addAddress($email);
//         $mail->Subject = "Your OTP Code";
//         $mail->Body = "Your OTP is: $otp. It is valid for 10 minutes.";

//         return $mail->send();
//     } catch (Exception $e) {
//         return false;
//     }
// }
//

 -->
