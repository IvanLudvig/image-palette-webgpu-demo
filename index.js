import { extractDominantColors } from './node_modules/image-palette-webgpu/index.js';
import { renderColors, setupImageUploadListener } from './utils.js';

const image = document.getElementById('image-preview');
const imageUpload = document.getElementById('image-upload');
const palette = document.getElementById('color-palette');
const algorithmSelect = document.getElementById('algorithm-select');
const kInput = document.getElementById('k-input');

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
