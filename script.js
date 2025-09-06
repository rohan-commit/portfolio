document.addEventListener('DOMContentLoaded', () => {
    // Music control variables and elements
    const bgMusic = document.getElementById("birthdayAudio");
    const musicBtn = document.getElementById("musicBtn");
    const reloadBtn = document.getElementById("reloadBtn");
    let isPlaying = false;

    // Check localStorage for saved music state on page load
    const savedTime = localStorage.getItem('musicTime');
    const wasPlaying = localStorage.getItem('musicPlaying');

    if (savedTime && wasPlaying === 'true') {
        bgMusic.currentTime = parseFloat(savedTime);
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = "⏸ Pause Music";
        }).catch(() => {
            isPlaying = false;
            musicBtn.textContent = "🎵 Play Music";
        });
    } else {
        window.addEventListener("load", () => {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.textContent = "⏸ Pause Music";
            }).catch(() => {
                isPlaying = false;
                musicBtn.textContent = "🎵 Play Music";
            });
        });
    }

    // Handle play/pause on button click
    musicBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.textContent = "🎵 Play Music";
        } else {
            bgMusic.play();
            musicBtn.textContent = "⏸ Pause Music";
        }
        isPlaying = !isPlaying;
    });

    // Handle reload button click
    reloadBtn.addEventListener('click', () => {
        //localStorage.setItem('musicTime', bgMusic.currentTime);
        //localStorage.setItem('musicPlaying', !bgMusic.paused);
        window.location.reload();
    });

    // The rest of your existing code for circles
    const circlesContainer = document.querySelector('.circles-container');
    const imageNames = [
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg',
        'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg'
    ];

    const circles = [];
    const speed = 1.5;

    const createCircle = (imageName) => {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundImage = `url('images/${imageName}')`;
        const size = Math.random() * 90 + 120;
        const x = Math.random() * (window.innerWidth - size);
        const y = Math.random() * (window.innerHeight - size);
        let vx = (Math.random() - 0.5) * 2 * speed;
        let vy = (Math.random() - 0.5) * 2 * speed;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        circlesContainer.appendChild(circle);
        circles.push({
            element: circle, x: x, y: y, vx: vx, vy: vy, size: size
        });
    };

    imageNames.forEach(imageName => createCircle(imageName));

    const animate = () => {
        circles.forEach(circle => {
            circle.x += circle.vx;
            circle.y += circle.vy;
            if (circle.x + circle.size > window.innerWidth || circle.x < 0) {
                circle.vx *= -1;
            }
            if (circle.y + circle.size > window.innerHeight || circle.y < 0) {
                circle.vy *= -1;
            }
            // Removed the collision detection with the message box
            circles.forEach(otherCircle => {
                if (circle !== otherCircle) {
                    const dx = circle.x - otherCircle.x;
                    const dy = circle.y - otherCircle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = circle.size / 2 + otherCircle.size / 2;
                    if (distance < minDistance) {
                        const angle = Math.atan2(dy, dx);
                        const newVx1 = otherCircle.vx;
                        const newVy1 = otherCircle.vy;
                        const newVx2 = circle.vx;
                        const newVy2 = circle.vy;
                        circle.vx = newVx1;
                        circle.vy = newVy1;
                        otherCircle.vx = newVx2;
                        otherCircle.vy = newVy2;
                        const overlap = minDistance - distance;
                        circle.x += Math.cos(angle) * overlap / 2;
                        circle.y += Math.sin(angle) * overlap / 2;
                        otherCircle.x -= Math.cos(angle) * overlap / 2;
                        otherCircle.y -= Math.sin(angle) * overlap / 2;
                    }
                }
            });
            circle.element.style.left = `${circle.x}px`;
            circle.element.style.top = `${circle.y}px`;
        });
        requestAnimationFrame(animate);
    };

    animate();
});
