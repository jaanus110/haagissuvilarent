/**
 * Lightbox implementation for image gallery
 * This implementation allows text selection and link clicking
 * while still providing the functionality to view enlarged images
 */

document.addEventListener('DOMContentLoaded', () => {
    // Create lightbox elements
    createLightboxElements();
    
    // Initialize lightbox functionality
    initLightbox();
});

/**
 * Creates the lightbox HTML elements and adds them to the document
 */
function createLightboxElements() {
    // Create lightbox overlay
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.id = 'lightbox-overlay';
    lightboxOverlay.className = 'lightbox-overlay';
    
    // Create lightbox container
    const lightboxContainer = document.createElement('div');
    lightboxContainer.className = 'lightbox-container';
    
    // Create lightbox image
    const lightboxImage = document.createElement('img');
    lightboxImage.id = 'lightbox-image';
    lightboxImage.className = 'lightbox-image';
    lightboxImage.alt = 'Enlarged caravan image';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close lightbox');
    
    // Create navigation buttons
    const prevButton = document.createElement('button');
    prevButton.id = 'lightbox-prev';
    prevButton.className = 'lightbox-nav lightbox-prev';
    prevButton.innerHTML = '&lt;';
    prevButton.setAttribute('aria-label', 'Previous image');
    
    const nextButton = document.createElement('button');
    nextButton.id = 'lightbox-next';
    nextButton.className = 'lightbox-nav lightbox-next';
    nextButton.innerHTML = '&gt;';
    nextButton.setAttribute('aria-label', 'Next image');
    
    // Create caption
    const caption = document.createElement('div');
    caption.id = 'lightbox-caption';
    caption.className = 'lightbox-caption';
    
    // Assemble lightbox
    lightboxContainer.appendChild(closeButton);
    lightboxContainer.appendChild(lightboxImage);
    lightboxContainer.appendChild(prevButton);
    lightboxContainer.appendChild(nextButton);
    lightboxContainer.appendChild(caption);
    lightboxOverlay.appendChild(lightboxContainer);
    
    // Add to document
    document.body.appendChild(lightboxOverlay);
}

/**
 * Initializes the lightbox functionality
 */
function initLightbox() {
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');
    const closeButton = document.querySelector('.lightbox-close');
    
    let galleryItems = [];
    let currentIndex = 0;
    
    // Initialize gallery items
    const initGalleryItems = () => {
        if (galleryItems.length === 0) {
            galleryItems = Array.from(document.querySelectorAll('.gallery-item a'));
        }
        return galleryItems;
    };
    
    // Add click event listeners to gallery items
    document.querySelectorAll('.gallery-item a').forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const items = initGalleryItems();
            currentIndex = index;
            
            // Get image URL from data attribute or href
            const imageUrl = item.getAttribute('data-image') || item.getAttribute('href');
            
            // Get alt text from the image inside the clicked link
            const imgElement = item.querySelector('img');
            const imgAlt = imgElement ? imgElement.getAttribute('alt') : '';
            
            // Set image source and caption
            lightboxImage.src = imageUrl;
            lightboxCaption.textContent = imgAlt;
            
            // Position the lightbox container in the center of the current viewport
            const lightboxContainer = document.querySelector('.lightbox-container');
            
            // Calculate the center position of the current viewport
            const viewportTop = window.pageYOffset || document.documentElement.scrollTop;
            const viewportHeight = window.innerHeight;
            const viewportCenter = viewportTop + (viewportHeight / 2);
            
            // Set the top position of the lightbox overlay to the current scroll position
            lightboxOverlay.style.top = viewportTop + 'px';
            
            // Show lightbox
            lightboxOverlay.classList.add('lightbox-active');
            
            // Prevent scrolling of the body
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox when clicking the close button
    closeButton.addEventListener('click', () => {
        lightboxOverlay.classList.remove('lightbox-active');
        document.body.style.overflow = '';
    });
    
    // Close lightbox when clicking outside the image
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            lightboxOverlay.classList.remove('lightbox-active');
            document.body.style.overflow = '';
        }
    });
    
    // Navigate to previous image
    prevButton.addEventListener('click', () => {
        const items = initGalleryItems();
        if (currentIndex > 0) {
            currentIndex--;
            const prevItem = items[currentIndex];
            const imageUrl = prevItem.getAttribute('data-image') || prevItem.getAttribute('href');
            const imgElement = prevItem.querySelector('img');
            const imgAlt = imgElement ? imgElement.getAttribute('alt') : '';
            
            lightboxImage.src = imageUrl;
            lightboxCaption.textContent = imgAlt;
        }
    });
    
    // Navigate to next image
    nextButton.addEventListener('click', () => {
        const items = initGalleryItems();
        if (currentIndex < items.length - 1) {
            currentIndex++;
            const nextItem = items[currentIndex];
            const imageUrl = nextItem.getAttribute('data-image') || nextItem.getAttribute('href');
            const imgElement = nextItem.querySelector('img');
            const imgAlt = imgElement ? imgElement.getAttribute('alt') : '';
            
            lightboxImage.src = imageUrl;
            lightboxCaption.textContent = imgAlt;
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('lightbox-active')) return;
        
        if (e.key === 'Escape') {
            lightboxOverlay.classList.remove('lightbox-active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
}