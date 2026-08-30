document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const dropzoneEmpty = document.getElementById('dropzone-empty');
  const previewState = document.getElementById('preview-state');
  const imagePreview = document.getElementById('image-preview');
  const btnBrowse = document.getElementById('btn-browse');
  const btnCamera = document.getElementById('btn-camera');
  const btnRemoveImage = document.getElementById('btn-remove-image');
  const btnClassify = document.getElementById('btn-classify');
  const classifySpinner = document.getElementById('classify-spinner');
  const statusIndicator = document.getElementById('status-indicator');
  
  // Results Elements
  const resultsEmpty = document.getElementById('results-empty');
  const resultsActive = document.getElementById('results-active');
  const predEmoji = document.getElementById('pred-emoji');
  const predEmojiCircle = document.getElementById('pred-emoji-circle');
  const predFruitName = document.getElementById('pred-fruit-name');
  const predConfidence = document.getElementById('pred-confidence');
  const predictionBanner = document.getElementById('prediction-banner');
  const probBarsList = document.getElementById('prob-bars-list');
  const factCalories = document.getElementById('fact-calories');
  const factNutrients = document.getElementById('fact-nutrients');
  const factHealth = document.getElementById('fact-health');
  const factFunText = document.getElementById('fact-fun-text');
  
  // Camera Modal Elements
  const cameraModal = document.getElementById('camera-modal');
  const cameraVideo = document.getElementById('camera-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  const btnCloseCamera = document.getElementById('btn-close-camera');
  const btnCancelCamera = document.getElementById('btn-cancel-camera');
  const btnSnapPhoto = document.getElementById('btn-snap-photo');
  
  // Sample buttons
  const sampleBtns = document.querySelectorAll('.sample-btn');
  const toastContainer = document.getElementById('toast-container');
  
  let currentFile = null;
  let currentDataUrl = null;
  let mediaStream = null;

  // Theme Management
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fruit_classifier_theme', theme);
    if (theme === 'light') {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark Mode';
    } else {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light Mode';
    }
  }

  const savedTheme = localStorage.getItem('fruit_classifier_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  // Author Pop-up Click Toggle Support
  const authorWrapper = document.getElementById('author-wrapper');
  if (authorWrapper) {
    authorWrapper.addEventListener('click', (e) => {
      if (e.target.closest('.popup-btn')) return; // Allow clicking links
      authorWrapper.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!authorWrapper.contains(e.target)) {
        authorWrapper.classList.remove('active');
      }
    });
  }

  // Mail button feedback & copy fallback
  const authorEmailBtn = document.getElementById('author-email-btn');
  if (authorEmailBtn) {
    authorEmailBtn.addEventListener('click', () => {
      const email = 'gopalakrish0826@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Email copied: ${email}`, 'success');
        }).catch(() => {});
      }
    });
  }

  // Toast Notification Helper
  function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'error' ? '⚠️' : '✅'}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Set Preview & Activate State
  function handleImageSelected(fileOrBlob, dataUrl) {
    if (fileOrBlob && !fileOrBlob.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    currentFile = fileOrBlob;
    currentDataUrl = dataUrl;

    imagePreview.src = dataUrl;
    dropzoneEmpty.classList.add('hidden');
    previewState.classList.remove('hidden');
    btnClassify.disabled = false;
    
    statusIndicator.textContent = 'Ready to Classify';
    statusIndicator.className = 'status-indicator ready';
  }

  // Read File as Data URL
  function loadFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Invalid file format. Please upload an image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      handleImageSelected(file, e.target.result);
    };
    reader.onerror = () => {
      showToast('Error reading the selected image file.');
    };
    reader.readAsDataURL(file);
  }

  // Clear Selected Image
  function resetImage() {
    currentFile = null;
    currentDataUrl = null;
    fileInput.value = '';
    imagePreview.src = '';
    
    previewState.classList.add('hidden');
    dropzoneEmpty.classList.remove('hidden');
    btnClassify.disabled = true;
    
    statusIndicator.textContent = 'Awaiting Input';
    statusIndicator.className = 'status-indicator';
  }

  // Browse Button Event
  btnBrowse.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // File Input Changed
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadFile(e.target.files[0]);
    }
  });

  // Remove Button
  btnRemoveImage.addEventListener('click', (e) => {
    e.stopPropagation();
    resetImage();
  });

  // Drag and Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      loadFile(files[0]);
    }
  });

  // Sample Buttons Click
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const src = btn.getAttribute('data-src');
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Could not fetch sample image');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
          handleImageSelected(blob, e.target.result);
          // Auto classify on sample click
          runClassification();
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        showToast('Sample image not available. Please upload your own image.');
      }
    });
  });

  // Camera Integration
  btnCamera.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      cameraVideo.srcObject = mediaStream;
      cameraModal.classList.remove('hidden');
    } catch (err) {
      showToast('Camera access denied or unavailable: ' + err.message);
    }
  });

  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    cameraModal.classList.add('hidden');
  }

  btnCloseCamera.addEventListener('click', stopCamera);
  btnCancelCamera.addEventListener('click', stopCamera);

  btnSnapPhoto.addEventListener('click', () => {
    if (!cameraVideo.videoWidth) return;
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    const ctx = cameraCanvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0);
    const dataUrl = cameraCanvas.toDataURL('image/jpeg', 0.9);
    
    // Convert to blob
    cameraCanvas.toBlob((blob) => {
      handleImageSelected(blob, dataUrl);
      stopCamera();
    }, 'image/jpeg', 0.9);
  });

  // Classification API Call
  async function runClassification() {
    if (!currentFile && !currentDataUrl) return;

    btnClassify.disabled = true;
    classifySpinner.classList.remove('hidden');
    statusIndicator.textContent = 'Classifying...';
    statusIndicator.className = 'status-indicator predicting';

    try {
      let response;
      if (currentFile instanceof Blob || currentFile instanceof File) {
        const formData = new FormData();
        formData.append('file', currentFile, 'fruit.jpg');
        response = await fetch('/predict', {
          method: 'POST',
          body: formData
        });
      } else if (currentDataUrl) {
        response = await fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_data: currentDataUrl })
        });
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Classification failed.');
      }

      displayResults(data);
      statusIndicator.textContent = 'Completed';
      statusIndicator.className = 'status-indicator ready';
    } catch (err) {
      showToast(err.message || 'Error communicating with the backend model.');
      statusIndicator.textContent = 'Error';
      statusIndicator.className = 'status-indicator';
    } finally {
      btnClassify.disabled = false;
      classifySpinner.classList.add('hidden');
    }
  }

  btnClassify.addEventListener('click', runClassification);

  // Render Results
  function displayResults(data) {
    resultsEmpty.classList.add('hidden');
    resultsActive.classList.remove('hidden');

    const fruit = data.predicted_fruit;
    const info = data.fruit_info || {};

    // Header highlights
    predEmoji.textContent = data.emoji || '🍎';
    predFruitName.textContent = fruit;
    predConfidence.textContent = data.confidence;
    
    // Dynamic glow and accent color
    const fruitColor = info.color || '#6366f1';
    predictionBanner.style.borderColor = fruitColor;
    predictionBanner.style.boxShadow = `0 8px 30px ${info.light_color || 'rgba(99, 102, 241, 0.2)'}`;
    predEmojiCircle.style.boxShadow = `0 0 25px ${fruitColor}`;

    // Render Probabilities Bar List
    probBarsList.innerHTML = '';
    (data.probabilities || []).forEach(item => {
      const isTop = item.fruit === fruit;
      const barItem = document.createElement('div');
      barItem.className = 'prob-item';
      
      barItem.innerHTML = `
        <div class="prob-header">
          <span class="prob-label">${item.emoji} ${item.fruit}</span>
          <span class="prob-pct" style="color: ${isTop ? '#4ade80' : 'var(--text-secondary)'}; font-weight: ${isTop ? '700' : '500'};">${item.percentage}</span>
        </div>
        <div class="prob-track">
          <div class="prob-fill" style="width: 0%; background: ${item.color || 'var(--primary)'};"></div>
        </div>
      `;
      
      probBarsList.appendChild(barItem);
      
      // Animate progress bar fill smoothly
      setTimeout(() => {
        const fill = barItem.querySelector('.prob-fill');
        if (fill) {
          fill.style.width = `${Math.max(item.score, 1)}%`;
        }
      }, 50);
    });

    // Populate Nutritional & Fun Facts
    factCalories.textContent = info.calories || 'N/A';
    factNutrients.textContent = info.key_nutrients || 'N/A';
    factHealth.textContent = info.health_benefit || 'N/A';
    factFunText.textContent = info.fun_fact || 'N/A';

    // Smooth scroll into view on mobile
    if (window.innerWidth < 900) {
      document.getElementById('results-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
