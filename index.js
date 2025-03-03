import { extractDominantColors } from './image-palette-webgpu/index.js';

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const palette = document.getElementById('color-palette');
const algorithmSelect = document.getElementById('algorithm-select');
const colorCountInput = document.getElementById('k-input');
const executionTime = document.getElementById('execution-time');

let imageUrl = './image.jpg';

const renderColors = (palette, colors) => {
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

        colorBox.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(color.toUpperCase());
                alert(`Color ${color.toUpperCase()} copied to clipboard`);
            } catch (err) {
                console.error('Failed to copy color: ', err);
            }
        });
    });
};

const run = async () => {
    palette.innerHTML = '';

    const colorCount = parseInt(colorCountInput.value);
    if (isNaN(colorCount) || colorCount < 1 || colorCount > 16) {
        alert('Invalid number of colors');
        return;
    }
    const algorithm = algorithmSelect.value;

    const image = new Image();
    image.src = imageUrl;
    await image.decode();
    const start = performance.now();
    const dominantColors = await extractDominantColors(image, colorCount, algorithm);
    const end = performance.now();
    executionTime.textContent = `Execution time: ${(end - start).toFixed(2)} ms`;
    renderColors(palette, dominantColors);
};

imageUpload.addEventListener('change', async (event) => {
    if (event.target.files.length === 0) return;
    const file = event.target.files[0];
    imageUrl = URL.createObjectURL(file);
    imagePreview.src = imageUrl;
    await run();
});
colorCountInput.addEventListener('change', run);
algorithmSelect.addEventListener('change', run);

run();
