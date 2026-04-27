// Google Maps iframe loader
document.addEventListener('DOMContentLoaded', function() {
    // Function to load the Google Maps iframe
    function loadGoogleMapsIframe() {
        const mapContainers = document.querySelectorAll('.map-container');
        if (mapContainers.length === 0) return;
        
        // Create an iframe for the map with a slightly higher zoom level (7 instead of 6)
        const iframe = document.createElement('iframe');
        iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d69213.74151594966!2d26.66505771138332!3d58.34655444924057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f7!3m3!1m2!1s0x46eb3764d18082e1%3A0x323d11ec0bc0d43f!2sSaariku!5e0!3m2!1sen!2see!4v1752416109807!5m2!1sen!2see";
        iframe.width = "100%";
        iframe.height = "500"; // Keeping the increased height for better visibility
        iframe.style.border = "0";
        iframe.allowFullscreen = "";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        iframe.title = "Map showing Saariku location in Tartu, Estonia"; // Added title for accessibility
        
        // Clear the container and append the iframe
        mapContainers[0].innerHTML = '';
        mapContainers[0].appendChild(iframe);
    }
    
    // Load the map immediately
    loadGoogleMapsIframe();
});