// Main JavaScript functionality for the Caravan Rental website

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links - Commented out to test native scroll-padding-top
    /*
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Skip if href is just "#" (like in dropdown toggles)
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    */

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            // Make sure all images have loading="lazy" attribute
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        // You could add a lazy loading library here if needed
        console.log('Browser does not support native lazy loading');
    }

    // Add active class to nav items based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Adjust for navbar height to match scroll-padding-top
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}` ||
                        (link.getAttribute('href') === 'index.html' && sectionId === 'hero')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // Handle Bootstrap Image Modal
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        const modalImageElement = document.getElementById('modalImage');
        const prevImageButton = document.getElementById('prevImage');
        const nextImageButton = document.getElementById('nextImage');
        let currentImageIndex = 0;
        let galleryItems = [];

        imageModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const imageUrl = button.getAttribute('data-bs-image');
            
            // Populate galleryItems and find currentImageIndex
            galleryItems = Array.from(document.querySelectorAll('#photo-gallery .gallery-item a'));
            currentImageIndex = galleryItems.findIndex(item => item.getAttribute('data-bs-image') === imageUrl);
            
            updateModalImage();
        });

        function updateModalImage() {
            if (galleryItems.length > 0 && modalImageElement) {
                const newImageUrl = galleryItems[currentImageIndex].getAttribute('data-bs-image');
                modalImageElement.src = newImageUrl;
            }
            // Disable/enable buttons based on index
            if(prevImageButton) prevImageButton.disabled = currentImageIndex === 0;
            if(nextImageButton) nextImageButton.disabled = currentImageIndex === galleryItems.length - 1;
        }

        if (prevImageButton) {
            prevImageButton.addEventListener('click', () => {
                if (currentImageIndex > 0) {
                    currentImageIndex--;
                    updateModalImage();
                }
            });
        }

        if (nextImageButton) {
            nextImageButton.addEventListener('click', () => {
                if (currentImageIndex < galleryItems.length - 1) {
                    currentImageIndex++;
                    updateModalImage();
                }
            });
        }
    }
    
    // Add responsive navbar collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) { // Bootstrap lg breakpoint
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
});