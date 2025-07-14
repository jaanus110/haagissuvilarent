// Main JavaScript functionality for the Caravan Rental website - Optimized version

document.addEventListener('DOMContentLoaded', () => {
    // Native lazy loading is now handled via HTML attributes

    // Add active class to nav items based on scroll position - Optimized with IntersectionObserver
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Use IntersectionObserver instead of scroll event for better performance
    const observerOptions = {
        root: null,
        rootMargin: '-120px 0px 0px 0px', // Adjust for navbar height
        threshold: 0.1
    };
    
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
    
    // Handle Bootstrap Image Modal - Optimized with event delegation
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        const modalImageElement = document.getElementById('modalImage');
        let currentImageIndex = 0;
        let galleryItems = [];

        // Initialize gallery items only once
        galleryItems = Array.from(document.querySelectorAll('#photo-gallery .gallery-item a'));
        
        // Use event delegation for modal events
        imageModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const imageUrl = button.getAttribute('data-bs-image');
            currentImageIndex = galleryItems.findIndex(item => item.getAttribute('data-bs-image') === imageUrl);
            
            if (galleryItems.length > 0 && modalImageElement) {
                modalImageElement.src = imageUrl;
            }
        });

        // Event delegation for navigation buttons
        imageModal.addEventListener('click', (e) => {
            if (e.target.id === 'prevImage' && currentImageIndex > 0) {
                currentImageIndex--;
                modalImageElement.src = galleryItems[currentImageIndex].getAttribute('data-bs-image');
            } else if (e.target.id === 'nextImage' && currentImageIndex < galleryItems.length - 1) {
                currentImageIndex++;
                modalImageElement.src = galleryItems[currentImageIndex].getAttribute('data-bs-image');
            }
        });
    }
    
    // Add responsive navbar collapse - Optimized with event delegation
    const navbarNav = document.querySelector('.navbar-nav');
    
    if (navbarNav) {
        navbarNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') && window.innerWidth < 992) {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    }
});