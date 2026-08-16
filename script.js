const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');


window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


if (menuToggle && menu) {

    menuToggle.addEventListener('click', () => {

        const open = menu.classList.toggle('open');

        menuToggle.setAttribute(
            'aria-expanded',
            open ? 'true' : 'false'
        );

    });

}

document.querySelectorAll('.menu a').forEach(link => {

    link.addEventListener('click', () => {

        menu.classList.remove('open');

        menuToggle.setAttribute(
            'aria-expanded',
            'false'
        );

    });

});



const slides = [
    ...document.querySelectorAll('.project-slide')
];

const dots = [
    ...document.querySelectorAll('.project-dot')
];

const prev = document.getElementById('projectPrev');
const next = document.getElementById('projectNext');

const current = document.getElementById('projectCurrent');
const total = document.getElementById('projectTotal');

const stage = document.getElementById('projectStage');


if (
    slides.length &&
    dots.length &&
    prev &&
    next &&
    current &&
    total &&
    stage
) {

    let index = 0;

    let timer;

    let animating = false;

    const intervalTime = 5000;

    total.textContent = String(slides.length).padStart(2, '0');




    const progress = document.createElement('div');

    progress.classList.add('slider-progress');

    stage.appendChild(progress);


   

    function updateIndicators() {

        current.textContent =
            String(index + 1).padStart(2, '0');


        dots.forEach((dot, i) => {

            dot.classList.toggle(
                'active',
                i === index
            );

        });

    }



    function startProgress() {

        progress.classList.remove('running');

        void progress.offsetWidth;

        progress.classList.add('running');

    }


    

    function showSlide(newIndex, direction = 1) {

        if (animating || newIndex === index) {
            return;
        }

        animating = true;


        const oldSlide = slides[index];

        const newSlide = slides[newIndex];


        // Remove estado anterior
        oldSlide.classList.remove('active');

        oldSlide.classList.add('leaving');


        // Define posição inicial
        newSlide.style.transform =
            `translateX(${direction > 0 ? 100 : -100}px) scale(.96)`;

        newSlide.style.opacity = '0';

        newSlide.classList.add('active');


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                newSlide.style.transform =
                    'translateX(0) scale(1)';

                newSlide.style.opacity = '1';

            });

        });


   
        index = newIndex;

        updateIndicators();


        // Reinicia barra
        startProgress();


        setTimeout(() => {

            oldSlide.classList.remove('leaving');

            oldSlide.style.transform = '';

            oldSlide.style.opacity = '';

            newSlide.style.transform = '';

            newSlide.style.opacity = '';

            animating = false;

        }, 700);

    }


    

    function nextSlide() {

        const nextIndex =
            (index + 1) % slides.length;

        showSlide(nextIndex, 1);

    }


 

    function prevSlide() {

        const prevIndex =
            (index - 1 + slides.length) %
            slides.length;

        showSlide(prevIndex, -1);

    }


    
    function restartTimer() {

        clearInterval(timer);

        timer = setInterval(() => {

            nextSlide();

        }, intervalTime);

        startProgress();

    }



    next.addEventListener('click', () => {

        nextSlide();

        restartTimer();

    });


    

    prev.addEventListener('click', () => {

        prevSlide();

        restartTimer();

    });


    // ==============================
    // DOTS
    // ==============================

    dots.forEach((dot, dotIndex) => {

        dot.addEventListener('click', () => {

            if (dotIndex === index) {
                return;
            }

            const direction =
                dotIndex > index ? 1 : -1;

            showSlide(
                dotIndex,
                direction
            );

            restartTimer();

        });

    });


    // ==============================
    // PAUSAR COM MOUSE
    // ==============================

    stage.addEventListener(
        'mouseenter',
        () => {

            clearInterval(timer);

            progress.classList.remove('running');

        }
    );


    stage.addEventListener(
        'mouseleave',
        () => {

            restartTimer();

        }
    );


    // ==============================
    // TOUCH / CELULAR
    // ==============================

    let touchStartX = 0;

    let touchEndX = 0;


    stage.addEventListener(
        'touchstart',
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

            clearInterval(timer);

        },
        {
            passive: true
        }
    );


    stage.addEventListener(
        'touchend',
        event => {

            touchEndX =
                event.changedTouches[0].screenX;


            const distance =
                touchEndX - touchStartX;


            if (Math.abs(distance) > 45) {

                if (distance < 0) {

                    nextSlide();

                } else {

                    prevSlide();

                }

            }


            restartTimer();

        },
        {
            passive: true
        }
    );


    // ==============================
    // TECLADO
    // ==============================

    document.addEventListener(
        'keydown',
        event => {

            if (event.key === 'ArrowRight') {

                nextSlide();

                restartTimer();

            }


            if (event.key === 'ArrowLeft') {

                prevSlide();

                restartTimer();

            }

        }
    );


    // ==============================
    // INICIALIZAÇÃO
    // ==============================

    updateIndicators();

    restartTimer();

}


// ==============================
// ANIMAÇÃO DAS SEÇÕES
// ==============================

const revealElements =
    document.querySelectorAll('.reveal');


if (revealElements.length) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            'visible'
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        observer.observe(element);

    });

}


// ==============================
// MENU ATIVO
// ==============================

const sections =
    [...document.querySelectorAll('main section[id]')];


const navLinks =
    [...document.querySelectorAll('.menu a')];


if (sections.length && navLinks.length) {

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    navLinks.forEach(link => {

                        link.classList.remove(
                            'active'
                        );

                    });


                    const active =
                        document.querySelector(
                            `.menu a[href="#${entry.target.id}"]`
                        );


                    if (active) {

                        active.classList.add(
                            'active'
                        );

                    }

                });

            },
            {
                rootMargin:
                    '-35% 0px -55% 0px'
            }
        );


    sections.forEach(section => {

        sectionObserver.observe(section);

    });

}


// ==============================
// ANO AUTOMÁTICO
// ==============================

const year =
    document.getElementById('year');


if (year) {

    year.textContent =
        new Date().getFullYear();

}


// ==============================
// EFEITO DE PARALLAX NO HERO
// ==============================

const hero =
    document.querySelector('.hero');

const glowBlue =
    document.querySelector('.glow-blue');

const glowGold =
    document.querySelector('.glow-gold');


if (hero && glowBlue && glowGold) {

    hero.addEventListener(
        'mousemove',
        event => {

            const rect =
                hero.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const moveX =
                (x / rect.width - 0.5) * 20;

            const moveY =
                (y / rect.height - 0.5) * 20;


            glowBlue.style.transform =
                `translate(${moveX}px, ${moveY}px)`;


            glowGold.style.transform =
                `translate(${-moveX}px, ${-moveY}px)`;

        }
    );


    hero.addEventListener(
        'mouseleave',
        () => {

            glowBlue.style.transform =
                'translate(0,0)';

            glowGold.style.transform =
                'translate(0,0)';

        }
    );

}


// ==============================
// EFEITO DE MOVIMENTO NAS IMAGENS
// ==============================

document
    .querySelectorAll('.project-image-wrap')
    .forEach(image => {

        image.addEventListener(
            'mousemove',
            event => {

                const rect =
                    image.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;


                const rotateX =
                    ((y / rect.height) - 0.5) * -3;

                const rotateY =
                    ((x / rect.width) - 0.5) * 3;


                image.style.setProperty(
                    '--rotate-x',
                    `${rotateX}deg`
                );

                image.style.setProperty(
                    '--rotate-y',
                    `${rotateY}deg`
                );

            }
        );


        image.addEventListener(
            'mouseleave',
            () => {

                image.style.setProperty(
                    '--rotate-x',
                    '0deg'
                );

                image.style.setProperty(
                    '--rotate-y',
                    '0deg'
                );

            }
        );

    });

// ==============================
// FORMULÁRIO DE ORÇAMENTO -> WHATSAPP
// ==============================
const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');

if (quoteForm) {
    const requiredFields = [...quoteForm.querySelectorAll('[required]')];

    const clearFieldError = field => {
        field.closest('.form-field')?.classList.remove('is-invalid');
    };

    quoteForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => clearFieldError(field));
        field.addEventListener('change', () => clearFieldError(field));
    });

    quoteForm.addEventListener('submit', event => {
        event.preventDefault();

        let firstInvalid = null;
        requiredFields.forEach(field => {
            clearFieldError(field);
            if (!field.value.trim()) {
                field.closest('.form-field')?.classList.add('is-invalid');
                if (!firstInvalid) firstInvalid = field;
            }
        });

        const emailField = quoteForm.elements.email;
        if (emailField?.value && !emailField.validity.valid) {
            emailField.closest('.form-field')?.classList.add('is-invalid');
            firstInvalid = firstInvalid || emailField;
        }

        if (firstInvalid) {
            if (formStatus) formStatus.textContent = 'Confira os campos obrigatórios destacados antes de enviar.';
            firstInvalid.focus();
            return;
        }

        const data = new FormData(quoteForm);
        const nome = (data.get('nome') || '').trim();
        const empresa = (data.get('empresa') || '').trim();
        const telefone = (data.get('telefone') || '').trim();
        const email = (data.get('email') || '').trim();
        const servico = (data.get('servico') || '').trim();
        const cidade = (data.get('cidade') || '').trim();
        const mensagem = (data.get('mensagem') || '').trim();

        const lines = [
            'Olá! Vim pelo site da ESC e gostaria de solicitar um orçamento.',
            '',
            `*Nome:* ${nome}`,
            empresa ? `*Empresa:* ${empresa}` : null,
            `*Telefone:* ${telefone}`,
            email ? `*E-mail:* ${email}` : null,
            `*Serviço:* ${servico}`,
            cidade ? `*Cidade/UF:* ${cidade}` : null,
            '',
            '*Necessidade:*',
            mensagem
        ].filter(Boolean);

        // Mantém o mesmo número utilizado nos demais botões de WhatsApp do site.
        const whatsappLink = document.querySelector('a.whatsapp')?.getAttribute('href') || 'https://wa.me/5511999999999';
        const baseUrl = whatsappLink.split('?')[0];
        const url = `${baseUrl}?text=${encodeURIComponent(lines.join('\n'))}`;

        if (formStatus) formStatus.textContent = 'Abrindo o WhatsApp com sua solicitação...';

        const whatsappWindow = window.open(url, '_blank');
        if (!whatsappWindow) {
            window.location.href = url;
        }
    });
}
