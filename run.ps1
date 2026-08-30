Write-Host "🍎 Starting Fruit Classification Web Application..." -ForegroundColor Green

if (Test-Path "C:\Users\Public\venv_torch\Scripts\python.exe") {
    & "C:\Users\Public\venv_torch\Scripts\python.exe" app.py
} elseif (Test-Path ".\.venv\Scripts\python.exe") {
    & ".\.venv\Scripts\python.exe" app.py
} else {
    python app.py
}
