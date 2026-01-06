<?php
/**
 * Simple PHP Minifier for Hostinger
 * Place in root folder and access via browser
 */

// Configuration
$minify_css = true;
$minify_js = true;

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'css':
            if ($minify_css) minifyCSS();
            break;
        case 'js':
            if ($minify_js) minifyJS();
            break;
        case 'all':
            if ($minify_css) minifyCSS();
            if ($minify_js) minifyJS();
            break;
    }
}

function minifyCSS() {
    $cssDir = 'css/';
    $files = glob($cssDir . '*.css');
    
    foreach ($files as $file) {
        // Skip already minified files
        if (strpos($file, '.min.css') !== false) continue;
        
        $content = file_get_contents($file);
        
        // Remove comments
        $content = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $content);
        
        // Remove whitespace
        $content = str_replace(["\r\n", "\r", "\n", "\t", '  ', '    ', '    '], '', $content);
        
        // Remove space after colons
        $content = str_replace(': ', ':', $content);
        
        // Remove unnecessary semicolons
        $content = str_replace(';}', '}', $content);
        
        // Create minified filename
        $minFile = str_replace('.css', '.min.css', $file);
        
        // Save minified file
        file_put_contents($minFile, $content);
        
        echo "Minified: " . basename($file) . " → " . basename($minFile) . "<br>";
    }
}

function minifyJS() {
    $jsDir = 'js/';
    $files = glob($jsDir . '*.js');
    
    foreach ($files as $file) {
        // Skip already minified files
        if (strpos($file, '.min.js') !== false) continue;
        
        $content = file_get_contents($file);
        
        // Remove single-line comments
        $content = preg_replace('!/\*.*?\*/!s', '', $content);
        $content = preg_replace('!//.*?\n!', '', $content);
        
        // Remove whitespace
        $content = preg_replace('/\s+/', ' ', $content);
        
        // Remove space around operators
        $content = preg_replace('/\s*([=+\-*\/%<>!&|^~,;?:])\s*/', '$1', $content);
        
        // Create minified filename
        $minFile = str_replace('.js', '.min.js', $file);
        
        // Save minified file
        file_put_contents($minFile, $content);
        
        echo "Minified: " . basename($file) . " → " . basename($minFile) . "<br>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Minify Assets</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        .btn { 
            background: #276cf5; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 5px;
        }
        .btn:hover { background: #1a56db; }
    </style>
</head>
<body>
    <h2>Minify CSS & JavaScript Files</h2>
    
    <button class="btn" onclick="window.location='?action=css'">Minify CSS Only</button>
    <button class="btn" onclick="window.location='?action=js'">Minify JS Only</button>
    <button class="btn" onclick="window.location='?action=all'">Minify All</button>
    
    <p><strong>Note:</strong> This will create .min.css and .min.js files. Remember to update your HTML to use the minified versions.</p>
</body>
</html>
