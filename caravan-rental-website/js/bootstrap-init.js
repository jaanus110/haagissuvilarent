// Optimized Bootstrap initialization for Core Web Vitals
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap modal component
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        // Create a Bootstrap modal instance
        const modal = new bootstrap.Modal(imageModal);
        
        // Handle gallery image clicks
        const galleryLinks = document.querySelectorAll('.gallery-item a');
        galleryLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                
                // Get the image URL from the data attribute
                const imageUrl = this.getAttribute('data-bs-image');
                const modalImage = document.getElementById('modalImage');
                
                if (modalImage && imageUrl) {
                    modalImage.src = imageUrl;
                    
                    // Get the alt text from the image inside the clicked link
                    const imgElement = this.querySelector('img');
                    const imgAlt = imgElement ? imgElement.getAttribute('alt') : '';
                    
                    // Set the modal title to the image alt text (description)
                    const modalTitle = document.getElementById('imageModalLabel');
                    if (modalTitle && imgAlt) {
                        modalTitle.textContent = imgAlt;
                    }
                    
                    // Show the modal
                    modal.show();
                }
            });
        });
        
        // Initialize navigation buttons
        const prevButton = document.getElementById('prevImage');
        const nextButton = document.getElementById('nextImage');
        
        if (prevButton && nextButton) {
            let currentIndex = 0;
            const galleryItems = Array.from(document.querySelectorAll('.gallery-item a'));
            
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateModalImage();
                }
            });
            
            nextButton.addEventListener('click', () => {
                if (currentIndex < galleryItems.length - 1) {
                    currentIndex++;
                    updateModalImage();
                }
            });
            
            // Function to update the modal image
            function updateModalImage() {
                const imageUrl = galleryItems[currentIndex].getAttribute('data-bs-image');
                const modalImage = document.getElementById('modalImage');
                
                if (modalImage && imageUrl) {
                    modalImage.src = imageUrl;
                    
                    // Update modal title
                    const imgElement = galleryItems[currentIndex].querySelector('img');
                    const imgAlt = imgElement ? imgElement.getAttribute('alt') : '';
                    const modalTitle = document.getElementById('imageModalLabel');
                    
                    if (modalTitle && imgAlt) {
                        modalTitle.textContent = imgAlt;
                    }
                }
            }
        }
    }
    
    // Defer non-critical Bootstrap initializations
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            // Initialize any additional Bootstrap components here when browser is idle
            // This helps improve First Input Delay (FID)
        }, { timeout: 2000 });
    }
});