const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
});

menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
});

const slides = [...document.querySelectorAll('.project-slide')];
const dots = [...document.querySelectorAll('.project-dot')];
const prev = document.getElementById('projectPrev');
const next = document.getElementById('projectNext');
const current = document.getElementById('projectCurrent');
const total = document.getElementById('projectTotal');
const stage = document.getElementById('projectStage');

let index = 0;
let timer;
let animating = false;

total.textContent = String(slides.length).padStart(2, '0');

function showSlide(newIndex, direction = 1) {
    if (animating || newIndex === index) return;
    animating = true;

    const oldSlide = slides[index];
    const newSlide = slides[newIndex];

    oldSlide.classList.remove('active');
    oldSlide.classList.add('leaving');

    newSlide.style.transform = `translateX(${direction > 0 ? 80 : -80}px)`;
    newSlide.style.opacity = '0';
    newSlide.classList.add('active');

    requestAnimationFrame(() => {
        newSlide.style.transform = 'translateX(0) scale(1)';
        newSlide.style.opacity = '1';
    });

    dots.forEach(dot => dot.classList.remove('active'));
    dots[newIndex].classList.add('active');
    current.textContent = String(newIndex + 1).padStart(2, '0');

    setTimeout(() => {
        oldSlide.classList.remove('leaving');
        oldSlide.style.transform = '';
        oldSlide.style.opacity = '';
        newSlide.style.transform = '';
        newSlide.style.opacity = '';
        index = newIndex;
        animating = false;
    }, 680);
}

function nextSlide() {
    showSlide((index + 1) % slides.length, 1);
}

function prevSlide() {
    showSlide((index - 1 + slides.length) % slides.length, -1);
}

function restartTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 6000);
}

next.addEventListener('click', () => { nextSlide(); restartTimer(); });
prev.addEventListener('click', () => { prevSlide(); restartTimer(); });

dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
        const direction = dotIndex > index ? 1 : -1;
        showSlide(dotIndex, direction);
        restartTimer();
    });
});

stage.addEventListener('mouseenter', () => clearInterval(timer));
stage.addEventListener('mouseleave', restartTimer);

let touchStartX = 0;
let touchEndX = 0;

stage.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

stage.addEventListener('touchend', event => {
    touchEndX = event.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) > 45) {
        if (distance < 0) nextSlide();
        else prevSlide();
        restartTimer();
    }
}, { passive: true });

restartTimer();

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(element => observer.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.menu a')];

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.menu a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
    });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

document.getElementById('year').textContent = new Date().getFullYear();
