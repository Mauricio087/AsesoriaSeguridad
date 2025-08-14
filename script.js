// Configuración y variables globales
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar todas las funcionalidades
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initScrollToTop();
    initNavbarScroll();
    initServiceButtons();
    initLazyLoading();
}

// ===== MENÚ MÓVIL =====
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer click fuera de él
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===== NAVEGACIÓN SUAVE =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMACIONES AL HACER SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animatedElements = document.querySelectorAll(
        '.service-card, .value-card, .testimonial-card, .about-content, .hero-content'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Cambiar opacidad del header basado en scroll
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#ffffff';
            header.style.backdropFilter = 'none';
        }

        // Ocultar/mostrar navbar en scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Validar campos
            if (!validateForm(name, email, service, message)) {
                return;
            }
            
            // Crear mensaje para WhatsApp
            const whatsappMessage = createWhatsAppMessage(name, email, phone, service, message);
            
            // Abrir WhatsApp
            const whatsappUrl = `https://wa.me/56989956454?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Limpiar formulario
            contactForm.reset();
        });
    }
}

function validateForm(name, email, service, message) {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!email || !isValidEmail(email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!service) {
        errors.push('Por favor selecciona un servicio');
    }
    
    if (!message || message.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join('\n'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function createWhatsAppMessage(name, email, phone, service, message) {
    const serviceNames = {
        'acreditacion': 'Acreditación OS10',
        'asesor': 'Asesor de Seguridad',
        'consultoria': 'Consultoría en Seguridad',
        'formacion': 'Formación Especializada',
        'carabineros': 'Asesoría ante Carabineros',
        'personal': 'Contratación de Personal',
        'sociedades': 'Constitución de Sociedades'
    };
    
    let whatsappMessage = `🔒 *CONSULTA DESDE WEB - ASESORIASEGURIDAD*\n\n`;
    whatsappMessage += `👤 *Nombre:* ${name}\n`;
    whatsappMessage += `📧 *Email:* ${email}\n`;
    
    if (phone) {
        whatsappMessage += `📱 *Teléfono:* ${phone}\n`;
    }
    
    whatsappMessage += `🛡️ *Servicio de interés:* ${serviceNames[service] || service}\n\n`;
    whatsappMessage += `💬 *Mensaje:*\n${message}\n\n`;
    whatsappMessage += `⏰ *Horario de atención:* Lunes a viernes de 09:00 a 20:00 hrs.`;
    
    return whatsappMessage;
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-check-circle"></i>
            <p>¡Mensaje enviado correctamente! Te contactaremos pronto.</p>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

function showErrorMessage(errors) {
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${errors}</p>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// ===== BOTONES DE SERVICIOS =====
function initServiceButtons() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Agregar efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Abrir WhatsApp después del efecto
            setTimeout(() => {
                window.open(this.href, '_blank');
            }, 200);
        });
    });
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    // Crear botón de scroll to top
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollToTopBtn);
    
    // Mostrar/ocultar botón basado en scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Funcionalidad del botón
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LAZY LOADING PARA IMÁGENES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== UTILIDADES =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== EFECTOS ADICIONALES =====
document.addEventListener('DOMContentLoaded', function() {
    // Agregar efectos de hover a las tarjetas
    const cards = document.querySelectorAll('.service-card, .value-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Efecto de typing en el hero title (opcional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Iniciar efecto después de un pequeño delay
        setTimeout(typeWriter, 1000);
    }
});

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Medir tiempo de carga
    const loadTime = performance.now();
    console.log(`Página cargada en ${Math.round(loadTime)}ms`);
    
    // Optimizar imágenes después de la carga
    setTimeout(() => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
            }
        });
    }, 100);
});

// ===== ACCESIBILIDAD =====
document.addEventListener('keydown', function(e) {
    // Navegación con teclado
    if (e.key === 'Escape') {
        // Cerrar menú móvil si está abierto
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenu && navMenu && navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ===== ANALYTICS Y TRACKING =====
function trackEvent(eventName, eventData = {}) {
    // Aquí se puede integrar con Google Analytics, Facebook Pixel, etc.
    console.log('Event tracked:', eventName, eventData);
    
    // Ejemplo de integración con Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Trackear clicks en servicios
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('service-btn')) {
        const serviceName = e.target.closest('.service-card').querySelector('h3').textContent;
        trackEvent('service_click', {
            service_name: serviceName,
            click_source: 'service_card'
        });
    }
    
    if (e.target.closest('.whatsapp-link, .btn-secondary')) {
        trackEvent('whatsapp_click', {
            click_source: e.target.closest('.whatsapp-link') ? 'contact_info' : 'hero_button'
        });
    }
});

// ===== ESTILOS DINÁMICOS PARA MENSAJES =====
const messageStyles = `
    .success-message, .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    }
    
    .success-message {
        background-color: #10b981;
        color: white;
    }
    
    .error-message {
        background-color: #ef4444;
        color: white;
    }
    
    .message-content {
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .message-content i {
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .message-content p {
        margin: 0;
        font-weight: 500;
    }
    
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        z-index: 1000;
    }
    
    .scroll-to-top.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .scroll-to-top:hover {
        background-color: var(--secondary-color);
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .success-message, .error-message {
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = messageStyles;
document.head.appendChild(styleSheet);