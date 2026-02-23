// colors to lerp between
const colorA = { r: 79, g: 172, b: 254 };
const colorB = { r: 0, g: 242, b: 254 };

// helper function for lerping between two colors
function lerpColor(a, b, t) {
    const r = Math.floor(a.r + (b.r - a.r) * t);
    const g = Math.floor(a.g + (b.g - a.g) * t);
    const bl = Math.floor(a.b + (b.b - a.b) * t);
    return { r, g, b: bl };
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('orb-lines'); // get canvas by id
    if (!canvas) return; // return if canvas isn't found

    const ctx = canvas.getContext('2d'); // get drawing context

    // settings for lines
    const bigScreenLineConfigs = [
        { speed: 4, amp: 25, freq: 0.01, offset: 0, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 5, amp: 35, freq: 0.015, offset: 10, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 3, amp: 45, freq: 0.008, offset: -10, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 6, amp: 15, freq: 0.02, offset: 5, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 2.5, amp: 40, freq: 0.005, offset: -5, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 }
    ];

    const smallScreenLineConfigs = [
        { speed: 4, amp: 25, freq: 0.01, offset: 0, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 5, amp: 35, freq: 0.015, offset: 10, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 },
        { speed: 3, amp: 45, freq: 0.008, offset: -10, progress: 0, trail: [], colorFactor: Math.random(), noise: Math.random() * 100 }
    ];

    let lineConfigs = window.innerWidth > 600 ? bigScreenLineConfigs : smallScreenLineConfigs;

    // function to resize canvas to fill width and maintain height
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = canvas.offsetHeight || 200;

        lineConfigs = window.innerWidth > 900 ? bigScreenLineConfigs : smallScreenLineConfigs;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // resize canvas on window resize
    window.addEventListener('resize', resize);
    // resize canvas initially
    resize();

    let time = 0;

    // animation loop for lines
    function animate() {
        // time step for animation, controls speed of movement and color changes
        time += 0.01;

        // clear canvas every frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        lineConfigs.forEach((config, i) => {

            config.progress += config.speed;
            config.noise += 0.005;

            if (config.progress > canvas.width + 50) {
                config.progress = -50;
                // config.trail = []; // optionally clear trail when resetting position
            }

            const t = (Math.sin(time + config.colorFactor * 10) + 1) / 2;
            const rgb = lerpColor(colorA, colorB, t);
            const x = config.progress;

            const centerY = ((canvas.height / lineConfigs.length) * (i + 0.5)) + config.offset;
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

            // 3. Draw logic
            for (let j = 0; j < config.trail.length - 1; j++) {
                const p1 = config.trail[j];
                const p2 = config.trail[j + 1];

                // Skip drawing if the line wraps around
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