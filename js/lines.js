// Keep your constants and lerp function at the top
const colorA = { r: 79, g: 172, b: 254 };
const colorB = { r: 0, g: 242, b: 254 };

function lerpColor(a, b, t) {
    const r = Math.floor(a.r + (b.r - a.r) * t);
    const g = Math.floor(a.g + (b.g - a.g) * t);
    const bl = Math.floor(a.b + (b.b - a.b) * t);
    return { r, g, b: bl };
}

// Wrap the rest in this listener
document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.line-canvas');
    if (canvases.length === 0) return; // Exit if canvases aren't found

    const ctxs = Array.from(canvases).map(canvas => canvas.getContext('2d'));

    const lineConfigs = [
        { speed: 4, amp: 25, freq: 0.01, offset: 0, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 5, amp: 35, freq: 0.015, offset: 10, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 3, amp: 45, freq: 0.008, offset: -10, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 6, amp: 15, freq: 0.02, offset: 5, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 2.5, amp: 40, freq: 0.005, offset: -5, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 }
    ];

    function resize() {
        canvases.forEach(canvas => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.offsetHeight;
        });
    }

    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    function animate() {
        time += 0.01;
        ctxs.forEach((ctx, i) => {
            const config = lineConfigs[i];
            const canvas = canvases[i];
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            config.progress += config.speed;
            config.noise += 0.005;

            if (config.progress > canvas.width + 50) {
                config.progress = -50;
            }

            const t = (Math.sin(time + config.colorFactor * 10) + 1) / 2;
            const rgb = lerpColor(colorA, colorB, t);
            const x = config.progress;

            const centerY = (canvas.height / 2) + config.offset;
            const maxAllowedDist = (canvas.height / 2) - 10;

            const rawWobble = (Math.sin(x * config.freq + time) * config.amp) +
                (Math.sin(x * 0.002 + config.noise) * (config.amp * 0.5));

            const actualWobble = Math.abs(rawWobble) > maxAllowedDist
                ? (rawWobble / Math.abs(rawWobble)) * maxAllowedDist
                : rawWobble;

            const y = centerY + actualWobble;
            config.trail.push({ x, y, rgb });

            const maxPoints = (canvas.width / config.speed) * 2;
            while (config.trail.length > maxPoints) {
                config.trail.shift();
            }

            for (let j = 0; j < config.trail.length - 1; j++) {
                const p1 = config.trail[j];
                const p2 = config.trail[j + 1];
                if (p2.x < p1.x) continue;

                const opacity = j / config.trail.length;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${p1.rgb.r}, ${p1.rgb.g}, ${p1.rgb.b}, ${opacity * 0.7})`;
                ctx.lineWidth = 30;
                ctx.lineCap = 'round';
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
});