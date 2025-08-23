// ===== MODAL FUNCTIONS =====
// Modal Functions
function openModal(modalId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
});

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
    initModals();
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
    const serviceButtons = document.querySelectorAll('.service-btn:not(.btn-info)');
    
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
// Función debounce eliminada - no se estaba utilizando

// ===== EFECTOS ADICIONALES =====
// Efectos adicionales movidos a initializeApp para evitar duplicación

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
// Funcionalidad de teclado movida al listener principal para evitar duplicación

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
    if (e.target.classList.contains('service-btn') && !e.target.classList.contains('btn-info')) {
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

// ===== ESTILOS DINÁMICOS =====
// Estilos CSS movidos al archivo styles.css para mejor organización

// ===== MODAL FUNCTIONALITY =====
function initModals() {
    // Modal event listeners are handled by the global functions above
    console.log('Modal functionality initialized');
}