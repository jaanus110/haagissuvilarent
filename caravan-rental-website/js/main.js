// Main JavaScript functionality for the Caravan Rental website - Optimized for Core Web Vitals

document.addEventListener('DOMContentLoaded', () => {
    // Native lazy loading is now handled via HTML attributes

    // Add active class to nav items based on scroll position - Optimized with IntersectionObserver
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Use IntersectionObserver instead of scroll event for better performance
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px 0px 0px', // Adjusted for navbar height
        threshold: 0.1
    };
    
    // Add passive event listeners for all scroll, touch, and wheel events
    // This improves performance by telling the browser that the listener will never call preventDefault()
    window.addEventListener('scroll', () => {}, { passive: true });
    window.addEventListener('touchstart', () => {}, { passive: true });
    window.addEventListener('touchmove', () => {}, { passive: true });
    window.addEventListener('wheel', () => {}, { passive: true });
    
    // Defer non-critical observer initialization
    requestIdleCallback(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}` ||
                            (link.getAttribute('href') === 'index.html' && sectionId === 'hero')) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }, { timeout: 1000 });
    
    // Image gallery functionality is now handled by lightbox.js
    
    // Add responsive navbar collapse - Optimized with event delegation and passive events
    const navbarNav = document.querySelector('.navbar-nav');
    
    if (navbarNav) {
        navbarNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') && window.innerWidth < 992) {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse) {
                    navbarCollapse.classList.remove('show');
                }
            }
        }, { passive: true });
        
        // Add touch events with passive flag
        navbarNav.addEventListener('touchstart', () => {}, { passive: true });
        navbarNav.addEventListener('touchmove', () => {}, { passive: true });
    }
    
    // Add passive event listeners to all interactive elements
    document.querySelectorAll('a, button, .btn, input[type="button"], input[type="submit"]').forEach(element => {
        element.addEventListener('touchstart', () => {}, { passive: true });
        element.addEventListener('touchmove', () => {}, { passive: true });
    });
});

// Fallback for browsers that don't support requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback, options) {
        const timeout = options && options.timeout ? options.timeout : 1;
        return setTimeout(function() {
            callback({
                didTimeout: false,
                timeRemaining: function() {
                    return Infinity;
                }
            });
        }, timeout);
    };
}