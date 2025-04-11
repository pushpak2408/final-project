document.getElementById('imageInput').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById('previewImage').src = reader.result;
        document.getElementById('previewWrapper').style.display = 'flex';
    };
    reader.readAsDataURL(file);
});

function closePreview() {
    document.getElementById('previewWrapper').style.display = 'none';
}

function showDownloadSection() {
    const file = document.getElementById('imageInput').files[0];
    if (!file) return alert("Please upload an image first.");

    document.getElementById('progressBar').style.display = 'block';

    setTimeout(() => {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'flex';
        document.getElementById('progressBar').style.display = 'none';
    }, 3003);
}

function downloadText(format) {
    const sampleText = document.getElementById('outputText').innerText;
    if (!sampleText.trim()) return alert("No text to download.");

    if (format === 'txt') {
        const blob = new Blob([sampleText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'converted_text.txt';
        link.click();
    } else if (format === 'pdf') {
        const doc = new window.jspdf.jsPDF();
        const lines = doc.splitTextToSize(sampleText, 180);
        doc.text(lines, 10, 10);
        doc.save('converted_text.pdf');
    } else if (format === 'jpg' || format === 'png') {
        const canvas = document.createElement('canvas');
        const box = document.querySelector('.preview-box');
        canvas.width = box.offsetWidth;
        canvas.height = box.offsetHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2c5364';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '18px sans-serif';
        ctx.fillText(sampleText, 20, 40);
        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `converted_text.${format}`;
            link.click();
        }, `image/${format}`);
    }
}

function handleDownload() {
    const format = document.getElementById('downloadFormat').value;
    downloadText(format);
}

function speakText() {
    const text = document.getElementById('outputText').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

function goBack() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('imageInput').value = '';
    closePreview();
}
