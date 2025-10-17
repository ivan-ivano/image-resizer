const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileInfo = document.getElementById('fileInfo');
const submitBtn = document.getElementById('submitBtn');
const resizeForm = document.getElementById('resizeForm');
const preview = document.getElementById('preview');
const resultImg = document.getElementById('resultImg');
const loading = document.getElementById('loading');
let selectedFile = null;

// URL backend API
const API_URL = 'http://localhost:5555';

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
    }
});

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    if (fileInput.files.length > 0) {
        selectedFile = fileInput.files[0];
        fileInfo.textContent = `Вибрано: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`;
        submitBtn.disabled = false;
        preview.style.display = 'none';
    }
}

resizeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;

    submitBtn.disabled = true;
    loading.style.display = 'block';
    preview.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/resize/?width=${width}&height=${height}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            resultImg.src = url;
            preview.style.display = 'block';

            // Download link
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resized_' + selectedFile.name;
            a.click();
        } else {
            alert('Помилка при обробці зображення');
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    } finally {
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
});