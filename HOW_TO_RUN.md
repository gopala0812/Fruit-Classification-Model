# 🚀 How to Run the Fruit Classifier Locally

Step-by-step guide to run the **Fruit Classification Web Application** on your local machine.

---

## 📍 Project Folder Path

Make sure your terminal is opened in the project root directory:

```powershell
cd "c:\Users\Gopala Krishna HK\OneDrive\Desktop\Career\Projects\Fruit-Classification Model"
```

---

## ⚡ Option 1: 1-Click Launch (Easiest Method)

Simply run one of the included startup scripts:

**In PowerShell:**
```powershell
.\run.ps1
```

**Or in Command Prompt / Double-Click in File Explorer:**
```cmd
run.bat
```

Or run directly with the installed environment:
```powershell
C:\Users\Public\venv_torch\Scripts\python.exe app.py
```

Then open your browser at 👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🛠️ Option 2: Run with Global Python

### Step 2: Install Required Packages
Run this command in your terminal:
```powershell
pip install -r requirements.txt
```

> **Note:** If you want a lightweight installation without heavy GPU binaries, you can also run:
> ```powershell
> pip install torch --index-url https://download.pytorch.org/whl/cpu
> pip install keras flask flask-cors pillow numpy waitress
> ```

### Step 3: Start the Application
Run:
```powershell
python app.py
```

### Step 4: Open in Web Browser
Open your browser (Chrome, Edge, Firefox, Brave) and visit:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🛡️ Option 2: Clean Setup with Virtual Environment (Recommended)

Using a virtual environment keeps dependencies isolated and avoids version conflicts.

### Windows (PowerShell):

```powershell
# 1. Navigate to the project directory
cd "c:\Users\Gopala Krishna HK\OneDrive\Desktop\Career\Projects\Fruit-Classification Model"

# 2. Create a virtual environment (.venv)
py -3.12 -m venv .venv
# (or: python -m venv .venv)

# 3. Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the web server
python app.py
```

### macOS / Linux:

```bash
# 1. Navigate to the project directory
cd /path/to/Fruit-Classification\ Model

# 2. Create a virtual environment
python3 -m venv .venv

# 3. Activate the virtual environment
source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the web server
python app.py
```

---

## 🐳 Option 3: Run with Docker (No Python installation required)

If you have Docker Desktop installed:

```bash
# 1. Build the Docker container
docker build -t fruit-classifier .

# 2. Run the container
docker run -p 5000:5000 fruit-classifier
```

Then open: **[http://localhost:5000](http://localhost:5000)**

---

## 🍎 How to Use the Web App

1. **Upload an Image**:
   - Drag and drop any fruit image (Apple, Banana, Grape, Mango, Strawberry) into the upload box.
   - Or click **"Choose Image"** to browse your computer.
   - Or click **"Use Camera"** to snap a photo with your webcam / phone camera.
2. **Or Test with 1-Click Samples**:
   - Click any sample fruit button below the upload box (🍎 Apple, 🍌 Banana, 🍇 Grape, 🥭 Mango, 🍓 Strawberry) for instant evaluation.
3. **View Results**:
   - Click **"Classify Fruit"**.
   - See the top predicted fruit with its **Confidence Score (e.g. 99.9%)**.
   - View the confidence breakdown bar chart for all 5 fruits.
   - Check out nutritional facts and botanical trivia.

---

## 🛑 How to Stop the Server

In the terminal where `python app.py` is running, press:
```
Ctrl + C
```
