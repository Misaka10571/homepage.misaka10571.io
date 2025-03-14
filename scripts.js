// 涟漪效果
document.querySelectorAll('.m3-button').forEach(button => {
    button.addEventListener('click', function(e) {
        let ripple = document.createElement('span'); // 创建涟漪元素
        ripple.className = 'ripple';
        ripple.style.left = e.offsetX + 'px'; // 设置涟漪起始位置
        ripple.style.top = e.offsetY + 'px';
        this.appendChild(ripple); // 添加到按钮中
        setTimeout(() => ripple.remove(), 600); // 动画结束后移除涟漪
    });
});
// 粒子系统
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.maxParticles = 300;

        this.init();
        this.animate();
    }

    init() {
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            color: `rgba(255, 255, 255, ${Math.random() * 0.5})`
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.particles.length < this.maxParticles) {
            this.particles.push(this.createParticle());
        }

        this.particles.forEach(p => {
            let dx = this.mouse.x - p.x;
            let dy = this.mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                p.x += dx * 0.01;
                p.y += dy * 0.01;
            }

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x > this.canvas.width + 20 || p.x < -20) p.speedX *= -1;
            if (p.y > this.canvas.height + 20 || p.y < -20) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

new ParticleSystem();

// 音乐播放控制
const audio = document.getElementById('bgm');
const playBtn = document.getElementById('playBtn');

audio.addEventListener('canplaythrough', () => {
    // 音乐加载完成后可以播放
});

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(() => {
            console.log('播放失败，可能受浏览器策略限制');
        });
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶';
    }
});

// 座右铭交互
const mottoContainer = document.querySelector('.motto-container');
const glassLayer = document.querySelector('.glass-layer');
const heroSection = document.querySelector('.hero-section');

function activateBlur() {
    glassLayer.classList.add('active');
}

function deactivateBlur() {
    glassLayer.classList.remove('active');
}

heroSection.addEventListener('click', activateBlur);

mottoContainer.addEventListener('click', function(e) {
    e.stopPropagation();
    activateBlur();
    this.classList.toggle('active');
    this.animate([
        { transform: 'translateX(-50%) scale(1)' },
        { transform: 'translateX(-50%) scale(0.98)' },
        { transform: 'translateX(-50%) scale(1)' }
    ], {
        duration: 300,
        easing: 'ease-out'
    });
});

document.addEventListener('click', function(e) {
    if (!heroSection.contains(e.target) && !mottoContainer.contains(e.target)) {
        deactivateBlur();
        mottoContainer.classList.remove('active');
    }
});

// 自动播放处理
document.addEventListener('click', function initAudio() {
    audio.play().catch(() => {
        console.log('自动播放失败，可能需要用户交互');
    });
    document.removeEventListener('click', initAudio);
});