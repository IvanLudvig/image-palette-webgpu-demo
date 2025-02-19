import { extractDominantColors } from './image-palette-webgpu/index.js';

const image = document.getElementById('image-preview');
const imageUpload = document.getElementById('image-upload');
const palette = document.getElementById('color-palette');
const algorithmSelect = document.getElementById('algorithm-select');
const kInput = document.getElementById('k-input');

function renderColors(palette, colors) {
    palette.innerHTML = '';
    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.title = 'Click to copy color';
        colorBox.style.cursor = 'copy';

        const colorSquare = document.createElement('div');
        colorSquare.className = 'color-square';
        colorSquare.style.backgroundColor = color;

        const colorLabel = document.createElement('div');
        colorLabel.className = 'color-label';
        colorLabel.textContent = color.toUpperCase();

        colorBox.appendChild(colorSquare);
        colorBox.appendChild(colorLabel);
        palette.appendChild(colorBox);

        colorBox.addEventListener('click', () => {
            navigator.clipboard.writeText(color.toUpperCase()).then(() => {
                alert(`Color ${color.toUpperCase()} copied to clipboard`);
            }).catch(err => {
                console.error('Failed to copy color: ', err);
            });
        });
    });
}

function setupImageUploadListener(imageUpload, image) {
    imageUpload.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                const imageUrl = URL.createObjectURL(file);
                image.src = imageUrl;
                await new Promise(resolve => image.onload = resolve);
                URL.revokeObjectURL(imageUrl);
            } else {
                alert('Not an image file');
            }
        }
    });
}

async function run() {
    palette.innerHTML = '';

    const K = parseInt(kInput.value);
    if (isNaN(K) || K < 1 || K > 16) {
        alert('Invalid number of colors');
        return;
    }
    const algorithm = algorithmSelect.value;
    const colors = await extractDominantColors(image, K, algorithm);
    renderColors(palette, colors);
}

kInput.addEventListener('input', run);
imageUpload.addEventListener('change', run);
algorithmSelect.addEventListener('change', run);

setupImageUploadListener(imageUpload, image);
run();
