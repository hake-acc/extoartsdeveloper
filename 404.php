<?php
declare(strict_types=1);
// Tell the server this is officially a 404 error
header("HTTP/1.0 404 Not Found");

$page_title = "404, Page Not Found | ExtoArts";
include 'header.php'; 
?>

<style>
    .error-container { height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; }
    .error-code { font-size: clamp(6rem, 15vw, 12rem); font-weight: 900; line-height: 1; margin-bottom: 10px; background: linear-gradient(135deg, var(--primary), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(0, 210, 255, 0.4)); animation: glitch 2s infinite alternate; }
    @keyframes glitch {
        0% { transform: translate(0); text-shadow: 0 0 10px var(--primary); }
        20% { transform: translate(-2px, 2px); text-shadow: -2px 0 red, 2px 0 var(--primary); }
        40% { transform: translate(2px, -2px); text-shadow: 2px 0 var(--primary), -2px 0 var(--purple); }
        60% { transform: translate(0); text-shadow: 0 0 20px var(--primary); }
        100% { transform: translate(0); }
    }
</style>

<div class="error-container">
    <div class="error-code">404</div>
    <h1 style="font-size: 2rem; margin-bottom: 15px;">Footage Not Found</h1>
    <p style="color: var(--text-soft); font-size: 1.1rem; max-width: 500px; margin-bottom: 40px;">Looks like this page got cut in post-production. Let's get you back to the main timeline.</p>
    <a href="/" class="btn btn-main transition-link"><i class="ti ti-home"></i> Back to Hub</a>
</div>

<?php include 'footer.php'; ?>
