cd "d:\Acess meditech\Angular-Frontend-Development"
$root = (Get-Location).Path
$files = @()

# Get all files recursively
Get-ChildItem -Recurse -File | ForEach-Object {
    $fullPath = $_.FullName
    $relPath = $fullPath.Substring($root.Length + 1)
    
    # Check if should be excluded
    $exclude = $false
    if ($relPath -like ".git*") { $exclude = $true }
    if ($relPath -like "*\bin\*") { $exclude = $true }
    if ($relPath -like "*\obj\*") { $exclude = $true }
    if ($relPath -like "*\node_modules\*") { $exclude = $true }
    if ($relPath -like "*\dist\*") { $exclude = $true }
    if ($relPath -like "*\.angular\*") { $exclude = $true }
    if ($relPath -like "*\.vscode\*") { $exclude = $true }
    if ($relPath -like "*\.idea\*") { $exclude = $true }
    
    if (-not $exclude) {
        $files += $relPath
    }
}

$files = $files | Sort-Object
$total = $files.Count
Write-Host "Total files to process: $total" -ForegroundColor Green

$counter = 0
$successCount = 0
$failCount = 0

foreach ($file in $files) {
    $counter++
    
    # Add file
    git add $file 2>&1 > $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[$counter/$total] ADD FAILED: $file" -ForegroundColor Red
        $failCount++
        continue
    }
    
    # Commit file
    git commit -m "[Sohil khan] Add. FundooNotes" 2>&1 > $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[$counter/$total] COMMIT FAILED: $file" -ForegroundColor Red
        $failCount++
        continue
    }
    
    # Push file
    git push origin fundoo 2>&1 > $null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[$counter/$total] PUSH FAILED: $file" -ForegroundColor Red
        $failCount++
        continue
    }
    
    $successCount++
    if ($counter % 50 -eq 0) {
        Write-Host "[$counter/$total] Progress: $successCount succeeded, $failCount failed" -ForegroundColor Cyan
    }
}

Write-Host "Completed!" -ForegroundColor Green
Write-Host "Total: $total files"
Write-Host "Successful: $successCount"
Write-Host "Failed: $failCount"
