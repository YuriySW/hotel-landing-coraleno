<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact.html');
    exit;
}

function crl_clean($value, $max)
{
    $value = trim((string) $value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return mb_substr($value, 0, $max);
}

$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

function crl_reply($ok, $wantsJson)
{
    if ($wantsJson) {
        http_response_code($ok ? 200 : 422);
        header('Content-Type: application/json');
        echo json_encode(['ok' => $ok]);
    } else {
        header('Location: ' . ($ok ? '/thanks.html' : '/contact.html'));
    }
    exit;
}

if (!empty($_POST['website'])) {
    crl_reply(true, $wantsJson);
}

$name = crl_clean(isset($_POST['name']) ? $_POST['name'] : '', 120);
$email = crl_clean(isset($_POST['email']) ? $_POST['email'] : '', 160);
$topic = crl_clean(isset($_POST['topic']) ? $_POST['topic'] : 'General', 60);
$message = trim(isset($_POST['message']) ? (string) $_POST['message'] : '');
$message = mb_substr($message, 0, 4000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    crl_reply(false, $wantsJson);
}

$subject = 'Coraleno enquiry: ' . $topic;
$body = "Name: $name\nEmail: $email\nTopic: $topic\n\n$message\n";
$headers = "From: hello@coraleno.com\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

@mail('hello@coraleno.com', $subject, $body, $headers);

crl_reply(true, $wantsJson);
