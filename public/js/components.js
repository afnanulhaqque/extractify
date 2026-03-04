/**
 * Extractify Components Injector
 * Handles loading common components across all pages
 */

// Unregister rogue service workers from other localhost:5000 projects that might strip .html
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log("Unregistered rogue service worker:", registration);
        }
    });
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/solutions/') || path.includes('/admin_app/')) {
        return '../';
    }
    return '';
}

async function loadComponent(element, componentPath, basePath = '') {
    try {
        // Ensure componentPath starts with / if not absolute
        const fullPath = componentPath.startsWith('/') ? componentPath : (basePath + componentPath);
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error(`Failed to load component: ${fullPath}`);
        let html = await response.text();
        
        // Fix internal links if we are in a subfolder
        if (basePath) {
            html = html.replace(/(href|src)=["']([^"']+)["']/g, (match, attr, path) => {
                if (path.startsWith('http') || path.startsWith('//') || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('data:') || path.startsWith('/')) {
                    return match;
                }
                return `${attr}="${basePath}${path}"`;
            });
        }
        
        if (typeof element === 'string') {
            const target = document.getElementById(element);
            if (target) target.innerHTML = html;
        } else if (element) {
            element.outerHTML = html;
        }
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const basePath = getBasePath();

    // Try placeholders first, then fallback to existing classes
    const navbarTarget = document.getElementById('navbar-placeholder') || document.querySelector('.navbar');
    const footerTarget = document.getElementById('footer-placeholder') || document.querySelector('.footer');

    const tasks = [];
    if (navbarTarget) {
        tasks.push(loadComponent(navbarTarget, 'ui-components/navbar.html', basePath));
    }
    if (footerTarget) {
        tasks.push(loadComponent(footerTarget, 'ui-components/footer.html', basePath));
    }

    // Inject Modals globally
    const modalContainer = document.createElement('div');
    modalContainer.id = 'global-modals-placeholder';
    document.body.appendChild(modalContainer);
    
    // Inject Chat CSS
    if (!document.querySelector('link[href*="chat-modal.css"]')) {
        const chatCss = document.createElement('link');
        chatCss.rel = 'stylesheet';
        chatCss.href = basePath + 'css/chat-modal.css';
        document.head.appendChild(chatCss);
    }

    tasks.push(loadComponent(modalContainer, 'ui-components/modals.html', basePath));

    // Inject Favicon if not present
    if (!document.querySelector('link[rel="icon"]')) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = basePath + 'assets/logo-icon-zoomed.png';
        document.head.appendChild(favicon);
    }

    await Promise.all(tasks);
    
    // Load Chat Script if not present
    if (!document.querySelector('script[src*="chat-modal.js"]')) {
        const chatScript = document.createElement('script');
        chatScript.src = basePath + 'js/chat-modal.js';
        chatScript.onload = () => {
            if (window.initChatModal) window.initChatModal();
        };
        document.body.appendChild(chatScript);
    } else {
        if (window.initChatModal) window.initChatModal();
    }

    // Re-initialize events for injected content
    initializeNavbarEvents();
    if (typeof window.initModals === 'function') {
        window.initModals();
    }
});

function initializeNavbarEvents() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksA = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        hamburger.addEventListener('click', toggleMenu);

        navLinksA.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
}

function initializeFooterEvents() {
    const openContactBtn = document.getElementById('openContactBtn');
    const contactModal = document.getElementById('contactModal');

    if (openContactBtn && contactModal) {
        openContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }
}
