// Enhanced language detection and switching logic

// Function to fetch translations and update text content
async function updateTextContent(lang) {
    try {
        // Use a more robust approach to fetch language files
        const response = await fetch(`locales/${lang}.json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });
        
        if (!response.ok) {
            // Fallback to default language (e.g., English) or show an error
            if (lang !== 'en') { // Avoid infinite loop if en.json is also missing
                await updateTextContent('en');
            }
            return;
        }
        
        const translations = await response.json();
        
        // Update all elements with translation keys
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[key]) {
                // Handle HTML content if needed
                if (element.tagName === 'A' && element.getAttribute('href') === '#') {
                    // Don't override href for language selector links
                } else if (element.innerHTML.includes('<')) {
                    // Element contains HTML, preserve it
                    const htmlContent = element.innerHTML;
                    const textContent = element.textContent;
                    element.innerHTML = htmlContent.replace(textContent, translations[key]);
                } else {
                    // Simple text content
                    element.textContent = translations[key];
                }
            }
        });
        
        // Update title separately if it has a translate key
        const titleElement = document.querySelector('title[data-translate-key]');
        if (titleElement && translations[titleElement.getAttribute('data-translate-key')]) {
            document.title = translations[titleElement.getAttribute('data-translate-key')];
        }
        
        // Update any HTML content in translations
        document.querySelectorAll('[data-translate-html]').forEach(element => {
            const key = element.getAttribute('data-translate-html');
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });
        
        // Language has been updated successfully
    } catch (error) {
        // Fallback to hardcoded translations if JSON loading fails (e.g., when running from file://)
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            applyFallbackTranslations(lang);
        }
    }
}

// Fallback function for when fetch fails (e.g., when running locally with file:// protocol)
function applyFallbackTranslations(lang) {
    // This is a simplified fallback that only handles the most important translations
    // In a production environment, you would use a proper server to avoid CORS issues
    const fallbackTranslations = {
        'en': {
            'nav_home': 'Home',
            'nav_about': 'About Us',
            'nav_services': 'Services',
            'nav_fleet': 'Our Fleet',
            'nav_testimonials': 'Testimonials',
            'nav_contact': 'Contact',
            'nav_faq': 'FAQ',
            'hero_title': 'Unlock Your Adventure: Rent an Elddis Corona Caravan Today!',
            'hero_subtitle': 'Experience the freedom of the open road with our premium, family-friendly caravan. Perfect for your next getaway!',
            'hero_button': 'Book Your Adventure Now'
        },
        'et': {
            'nav_home': 'Avaleht',
            'nav_about': 'Meist',
            'nav_services': 'Teenused',
            'nav_fleet': 'Meie Haagissuvilad',
            'nav_testimonials': 'Arvustused',
            'nav_contact': 'Kontakt',
            'nav_faq': 'KKK',
            'hero_title': 'Ava Oma Seiklus: Rendi Elddis Corona Haagissuvila Juba Täna!',
            'hero_subtitle': 'Kogege vabadust avatud teedel meie premium, peresõbraliku haagissuvilaga. Ideaalne Sinu järgmiseks puhkuseks!',
            'hero_button': 'Broneeri Seiklus Kohe'
        },
        'ru': {
            'nav_home': 'Главная',
            'nav_about': 'О нас',
            'nav_services': 'Услуги',
            'nav_fleet': 'Наш Автопарк',
            'nav_testimonials': 'Отзывы',
            'nav_contact': 'Контакты',
            'nav_faq': 'ЧаВо',
            'hero_title': 'Откройте Свое Приключение: Арендуйте Караван Elddis Corona Уже Сегодня!',
            'hero_subtitle': 'Ощутите свободу открытых дорог с нашим премиальным, семейно-ориентированным караваном. Идеально для вашего следующего отпуска!',
            'hero_button': 'Забронировать Приключение Сейчас'
        }
    };
    
    // Apply the fallback translations
    const translations = fallbackTranslations[lang] || fallbackTranslations['en'];
    
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // Update title if needed
    const titleElement = document.querySelector('title[data-translate-key]');
    if (titleElement) {
        const titleKey = titleElement.getAttribute('data-translate-key');
        if (translations[titleKey]) {
            document.title = translations[titleKey];
        }
    }
}

// Function to set the language
function setLanguage(lang) {
    localStorage.setItem('preferredLang', lang);
    document.documentElement.lang = lang;
    updateTextContent(lang);
}

// Enhanced language detection logic based on the plan
function detectUserLanguage() {
    // 1. Check stored preference (localStorage)
    const storedLang = localStorage.getItem('preferredLang');
    if (storedLang && ['en', 'et', 'ru'].includes(storedLang)) {
        return storedLang;
    }

    // 2. Check browser language
    const browserLangs = (navigator.languages || [navigator.language || navigator.userLanguage])
        .map(lang => lang.split('-')[0].toLowerCase());

    for (const lang of browserLangs) {
        if (lang === 'et') {
            return 'et';
        }
        if (lang === 'ru') {
            return 'ru';
        }
        if (lang === 'en') {
            // Don't return 'en' immediately, continue checking OS and other factors if specified by plan
            // For this implementation, browser 'en' is a strong indicator.
            // The plan's example code has a more complex logic for ignoring English OS/browser.
            // Let's simplify for now and prioritize explicit browser settings.
        }
    }

    // 3. Check OS language (via userAgent as a fallback, very unreliable)
    // The plan mentions userAgent, but it's generally not recommended for robust language detection.
    // Modern `navigator.languages` is preferred.
    // For simplicity and reliability, we'll rely more on `navigator.languages`.
    // The plan's example code for OS detection:
    // const userAgent = navigator.userAgent.toLowerCase();
    // if (userAgent.includes('estonia')) return 'et'; // Example, might be too broad
    // if (userAgent.includes('cyrillic')) return 'ru'; // Example

    // 4. Check keyboard layout (not practically feasible in a standard browser JS environment)
    // This is generally not accessible for privacy and security reasons.

    // Prioritize found browser languages if any matched our supported ones
    if (browserLangs.includes('et')) return 'et';
    if (browserLangs.includes('ru')) return 'ru';
    if (browserLangs.includes('en')) return 'en';


    // 5. Default to Estonian
    return 'et';
}

document.addEventListener('DOMContentLoaded', () => {
    const languageLinks = document.querySelectorAll('.lang-link[data-lang]');
    
    // Determine and set initial language
    const initialLang = detectUserLanguage();
    setLanguage(initialLang);
    
    // Highlight the current language
    highlightCurrentLanguage(initialLang);

    // Add event listeners to language switchers
    languageLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = link.getAttribute('data-lang');
            if (selectedLang) {
                setLanguage(selectedLang);
                highlightCurrentLanguage(selectedLang);
            }
        });
    });
});

// Function to highlight the current language
function highlightCurrentLanguage(lang) {
    const languageLinks = document.querySelectorAll('.lang-link[data-lang]');
    languageLinks.forEach(link => {
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active', 'fw-bold');
        } else {
            link.classList.remove('active', 'fw-bold');
        }
    });
}