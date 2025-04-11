
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
    const text = document.getElementById('outputText').innerText;
    if (!text.trim()) {
        showMessage('No text to download.');
        return;
    }

    if (format === 'txt') {
        try {
            const blob = new Blob([text], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'converted_text.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showMessage('Text downloaded as TXT.');
        } catch (error) {
            showMessage('Error downloading TXT: ' + error);
        }
    } else if (format === 'pdf') {
        try {
            const doc = new window.jspdf.jsPDF();
            const lines = doc.splitTextToSize(text, 180);
            doc.text(lines, 10, 10);
            doc.save('converted_text.pdf');
            showMessage('Text downloaded as PDF.');
        } catch (error) {
            showMessage('Error creating PDF: ' + error);
        }
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
        ctx.fillText(text, 20, 40);
        canvas.toBlob(blob => {
            if (blob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `converted_text.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showMessage(`Text downloaded as ${format.toUpperCase()}.`);
            } else {
                showMessage('Error creating image.');
            }
        }, `image/${format}`);
    }
}

function handleDownload() {
    const format = document.getElementById('downloadFormat').value;
    downloadText(format);
}

let isSpeaking = false;
function speakText() {
    if (isSpeaking) return;
    const text = document.getElementById('outputText').innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeaking = true;
    utterance.onend = () => {
        isSpeaking = false;
        showMessage('Speech stopped.');
    };
    utterance.onerror = (event) => {
        showMessage('Error speaking text: ' + event.error);
        isSpeaking = false;
    };
    speechSynthesis.speak(utterance);
    showMessage('Speaking text...');
}

function goBack() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('imageInput').value = '';
    closePreview();
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
    }
}

function copyText() {
    const text = document.getElementById('outputText').innerText;
    navigator.clipboard.writeText(text)
        .then(() => showMessage('Text copied to clipboard!'))
        .catch(err => {
            if (err.name === 'NotAllowedError') {
                showMessage('Copy failed. Please use Ctrl+C/Cmd+C to copy.');
            } else {
                showMessage('Failed to copy text: ' + err);
            }
        });
}

function shareText() {
    const text = document.getElementById('outputText').innerText;
    if (navigator.share) {
        navigator.share({ title: 'Converted Text', text: text })
            .then(() => showMessage('Shared successfully!'))
            .catch((error) => {
                if (error.name === 'AbortError') {
                    showMessage('Sharing was cancelled.');
                } else if (error.name === 'NotAllowedError') {
                    showMessage('Sharing failed due to permissions.');
                } else {
                    showMessage('Sharing failed: ' + error.message);
                }
            });
    } else {
        navigator.clipboard.writeText(text)
            .then(() => showMessage('Text copied! Paste to share.'))
            .catch(err => showMessage('Failed to copy text: ' + err.message));
    }
}

function showMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    msgDiv.textContent = message;
    document.body.appendChild(msgDiv);
    setTimeout(() => {
        msgDiv.classList.add('fade-out');
        setTimeout(() => {
            msgDiv.remove();
        }, 300);
    }, 2000);
}
