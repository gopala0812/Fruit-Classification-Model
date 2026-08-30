@echo off
echo Starting Fruit Classification Web Application...
if exist "C:\Users\Public\venv_torch\Scripts\python.exe" (
    "C:\Users\Public\venv_torch\Scripts\python.exe" app.py
) else if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" app.py
) else (
    python app.py
)
pause
