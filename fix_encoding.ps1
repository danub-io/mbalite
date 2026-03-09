$corrections = @{
    "ðŸŽ“" = "🎓"; "Ã " = "à"; "Ã§" = "ç"; "Ã£" = "ã";
    "Ã­" = "í"; "Ãµ" = "õ"; "Ã©" = "é"; "Ãª" = "ê";
    "Ã³" = "ó"; "Ã¡" = "á"; "Ãº" = "ú"; "ðŸ“Š" = "📊";
    "ðŸ †" = "🏆"; "ðŸ§ " = "🧠"; "ðŸš€" = "🚀"; "âž”" = "➔";
    "ðŸ’¡" = "💡"; "ðŸ’Ž" = "💎"; "æ‚Ÿã‚Š" = "悟り"; "Ãš" = "Ú";
    "Ã " = "à"; "Ã¢" = "â"; "Ã" = "í"
}
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$files = Get-ChildItem -Path "." -Recurse -Include *.mdx, *.tsx, *.json, index.html | Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.next*" }
Write-Host "🛠️ Restaurando textos corrompidos..." -ForegroundColor Cyan
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $original = $content
    foreach ($key in $corrections.Keys) {
        if ($content.Contains($key)) { $content = $content.Replace($key, $corrections[$key]) }
    }
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($f.FullName, $content, $utf8NoBom)
        Write-Host "✅ Corrigido: $($f.Name)" -ForegroundColor Green
    }
}
