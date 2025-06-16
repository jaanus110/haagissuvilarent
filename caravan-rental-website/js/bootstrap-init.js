// Custom dropdown implementation
document.addEventListener('DOMContentLoaded', () => {
    // Fix for language dropdown
    const languageDropdown = document.getElementById('languageDropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="languageDropdown"]');
    
    if (languageDropdown && dropdownMenu) {
        // Style the dropdown menu for proper positioning
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.inset = '0px auto auto 0px';
        dropdownMenu.style.margin = '0px';
        dropdownMenu.style.transform = 'translate3d(0px, 40px, 0px)';
        
        // Toggle dropdown on click
        languageDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the 'show' class on the dropdown menu
            dropdownMenu.classList.toggle('show');
            
            // Update aria-expanded attribute
            const isExpanded = dropdownMenu.classList.contains('show');
            languageDropdown.setAttribute('aria-expanded', isExpanded);
            
            console.log('Language dropdown clicked, show:', isExpanded);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                languageDropdown.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Add click handlers for language options
        const languageOptions = dropdownMenu.querySelectorAll('.dropdown-item[data-lang]');
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                if (lang) {
                    // This will be handled by the language-detector.js
                    console.log('Language selected:', lang);
                }
                // Close the dropdown
                dropdownMenu.classList.remove('show');
                languageDropdown.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    console.log('Custom dropdown initialized');
});