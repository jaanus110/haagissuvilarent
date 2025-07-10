# Multilingual SEO Implementation Guide - Part 2

## Structured Data Implementation (continued)

### BreadcrumbList (For Navigation)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Avaleht",
      "item": "https://tartuhaagissuvila.ee/et/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Renditingimused",
      "item": "https://tartuhaagissuvila.ee/et/rental-terms.html"
    }
  ]
}
</script>
```

Create similar blocks for each language, updating the names and URLs accordingly.

### Implementation Strategy

1. **Generate During Build**:
   - Create the structured data blocks during the static site generation process
   - Use the same translation data to populate the structured data content
   - Ensure the `inLanguage` property is set correctly for each language version

2. **Testing**:
   - Use Google's Structured Data Testing Tool or Rich Results Test to verify implementation
   - Check that language-specific properties are correctly recognized

## Meta Tags Optimization

### Required Meta Tags for Each Language

#### 1. Title Tag

```html
<!-- Estonian -->
<title>Haagissuvila rent Tartus | Elddis Corona | Tartu Haagissuvila</title>

<!-- English -->
<title>Caravan Rental in Tartu | Elddis Corona | Tartu Caravan Rental</title>

<!-- Russian -->
<title>Аренда дома на колесах в Тарту | Elddis Corona | Тарту Дом на колесах</title>
```

#### 2. Meta Description

```html
<!-- Estonian -->
<meta name="description" content="Rendi mugav 5-kohaline Elddis Corona haagissuvila Tartus. Ideaalne perepuhkuseks ja Baltikumi avastamiseks. Täisvarustuses köök, tualett ja kõik mugavused.">

<!-- English -->
<meta name="description" content="Rent a comfortable 5-person Elddis Corona caravan in Tartu, Estonia. Perfect for family vacations and exploring the Baltics. Fully equipped kitchen, toilet, and all amenities.">

<!-- Russian -->
<meta name="description" content="Аренда комфортабельного 5-местного дома на колесах Elddis Corona в Тарту, Эстония. Идеально для семейного отдыха и путешествий по Прибалтике. Полностью оборудованная кухня, туалет и все удобства.">
```

#### 3. Language Meta Tag

```html
<meta http-equiv="content-language" content="et">
```

#### 4. Open Graph Tags

```html
<!-- Estonian -->
<meta property="og:title" content="Haagissuvila rent Tartus | Elddis Corona">
<meta property="og:description" content="Rendi mugav 5-kohaline Elddis Corona haagissuvila Tartus. Ideaalne perepuhkuseks ja Baltikumi avastamiseks.">
<meta property="og:url" content="https://tartuhaagissuvila.ee/et/">
<meta property="og:image" content="https://tartuhaagissuvila.ee/img/gallery/out_front_right_1200w.jpg">
<meta property="og:locale" content="et_EE">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:locale:alternate" content="ru_RU">
```

#### 5. Twitter Card Tags

```html
<!-- Estonian -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Haagissuvila rent Tartus | Elddis Corona">
<meta name="twitter:description" content="Rendi mugav 5-kohaline Elddis Corona haagissuvila Tartus. Ideaalne perepuhkuseks ja Baltikumi avastamiseks.">
<meta name="twitter:image" content="https://tartuhaagissuvila.ee/img/gallery/out_front_right_1200w.jpg">
```

### Implementation Strategy

1. **Template-Based Approach**:
   - Create meta tag templates for each page type
   - During the build process, populate with language-specific content
   - Ensure all meta tags are properly translated and optimized for each language

2. **Language-Specific SEO Keywords**:
   - Research keywords specific to each language market
   - Incorporate these keywords naturally into meta tags
   - Consider cultural and regional differences in search behavior

3. **Length Considerations**:
   - Title tags: Keep under 60 characters
   - Meta descriptions: Keep under 160 characters
   - Adjust length as needed for different languages (some languages require more characters to express the same meaning)

4. **Example Build Script Function**:

```javascript
function generateMetaTags(lang, pageData) {
  const translations = require(`./translations/${lang}.json`);
  const metaTags = [];
  
  // Title tag
  metaTags.push(`<title>${translations[pageData.titleKey]}</title>`);
  
  // Meta description
  metaTags.push(`<meta name="description" content="${translations[pageData.descriptionKey]}">`);
  
  // Language meta tag
  metaTags.push(`<meta http-equiv="content-language" content="${lang}">`);
  
  // Open Graph tags
  metaTags.push(`<meta property="og:title" content="${translations[pageData.ogTitleKey]}">`);
  metaTags.push(`<meta property="og:description" content="${translations[pageData.ogDescriptionKey]}">`);
  metaTags.push(`<meta property="og:url" content="https://tartuhaagissuvila.ee/${lang}${pageData.path}">`);
  metaTags.push(`<meta property="og:image" content="https://tartuhaagissuvila.ee/img/gallery/out_front_right_1200w.jpg">`);
  metaTags.push(`<meta property="og:locale" content="${getLocale(lang)}">`);
  
  // Add alternate locales
  languages.filter(l => l !== lang).forEach(l => {
    metaTags.push(`<meta property="og:locale:alternate" content="${getLocale(l)}">`);
  });
  
  // Twitter Card tags
  metaTags.push(`<meta name="twitter:card" content="summary_large_image">`);
  metaTags.push(`<meta name="twitter:title" content="${translations[pageData.twitterTitleKey]}">`);
  metaTags.push(`<meta name="twitter:description" content="${translations[pageData.twitterDescriptionKey]}">`);
  metaTags.push(`<meta name="twitter:image" content="https://tartuhaagissuvila.ee/img/gallery/out_front_right_1200w.jpg">`);
  
  return metaTags.join('\n');
}

function getLocale(lang) {
  const localeMap = {
    'et': 'et_EE',
    'en': 'en_US',
    'ru': 'ru_RU'
  };
  return localeMap[lang] || 'en_US';
}
```

## Language Detection Strategy

### Recommended Approach: Server-Side Detection with Client-Side Fallback

#### Server-Side Detection (Preferred)

1. **Initial Visit Detection**:
   - Use the `Accept-Language` HTTP header to detect the user's preferred language
   - Check for language cookies from previous visits
   - Redirect to the appropriate language subdirectory using a 302 (temporary) redirect

2. **Implementation Example** (Node.js with Express):

```javascript
app.get('/', (req, res) => {
  // Check for language cookie
  const cookieLang = req.cookies.preferredLanguage;
  if (cookieLang && ['en', 'et', 'ru'].includes(cookieLang)) {
    return res.redirect(302, `/${cookieLang}/`);
  }
  
  // Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'] || '';
  const browserLangs = acceptLanguage.split(',')
    .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase());
  
  // Match against available languages
  if (browserLangs.includes('et')) {
    res.cookie('preferredLanguage', 'et', { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
    return res.redirect(302, '/et/');
  }
  
  if (browserLangs.includes('ru')) {
    res.cookie('preferredLanguage', 'ru', { maxAge: 365 * 24 * 60 * 60 * 1000 });
    return res.redirect(302, '/ru/');
  }
  
  if (browserLangs.includes('en')) {
    res.cookie('preferredLanguage', 'en', { maxAge: 365 * 24 * 60 * 60 * 1000 });
    return res.redirect(302, '/en/');
  }
  
  // Default to Estonian
  res.cookie('preferredLanguage', 'et', { maxAge: 365 * 24 * 60 * 60 * 1000 });
  return res.redirect(302, '/et/');
});
```

#### Client-Side Fallback

For static hosting environments where server-side detection isn't possible:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/et/">
    <script>
        // Language detection logic
        function detectLanguage() {
            // Check for stored preference
            const storedLang = localStorage.getItem('preferredLang');
            if (storedLang && ['en', 'et', 'ru'].includes(storedLang)) {
                return storedLang;
            }
            
            // Check browser language
            const browserLangs = (navigator.languages || [navigator.language || navigator.userLanguage])
                .map(lang => lang.split('-')[0].toLowerCase());
            
            if (browserLangs.includes('et')) return 'et';
            if (browserLangs.includes('ru')) return 'ru';
            if (browserLangs.includes('en')) return 'en';
            
            // Default to Estonian
            return 'et';
        }
        
        // Redirect to detected language
        const lang = detectLanguage();
        localStorage.setItem('preferredLang', lang); // Store for future visits
        window.location.replace('/' + lang + '/');
    </script>
</head>
<body>
    <h1>Redirecting...</h1>
    <p>If you are not redirected automatically, please choose a language:</p>
    <ul>
        <li><a href="/et/">Eesti keeles</a></li>
        <li><a href="/en/">In English</a></li>
        <li><a href="/ru/">На русском</a></li>
    </ul>
</body>
</html>
```

### Language Switcher Implementation

1. **Update Language Preference**:
   - When a user manually switches languages, update both the cookie and localStorage
   - Ensure the preference persists across visits

2. **Example Language Switcher JavaScript**:

```javascript
document.querySelectorAll('.lang-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const lang = this.getAttribute('href').replace(/\//g, '');
    if (['en', 'et', 'ru'].includes(lang)) {
      localStorage.setItem('preferredLang', lang);
      // If using cookies with server-side detection
      document.cookie = `preferredLanguage=${lang}; max-age=${365 * 24 * 60 * 60}; path=/`;
    }
  });
});
```

### SEO Considerations

1. **Use 302 (Temporary) Redirects**:
   - For language detection redirects, always use 302 (temporary) redirects
   - This signals to search engines that the redirect is based on user preferences, not a permanent move

2. **Provide Direct Access**:
   - Always include direct links to all language versions
   - Ensure search engines can discover and index all language versions

3. **Avoid Redirect Chains**:
   - Implement detection only at the root URL
   - Once a user is in a language subdirectory, don't redirect again

## Implementation Checklist

### 1. Project Setup

- [ ] Create directory structure for language-specific content
- [ ] Extract translations from `language-detector.js` to JSON files
- [ ] Create HTML templates with placeholders for translated content

### 2. Build Process

- [ ] Set up Node.js build script for static site generation
- [ ] Implement translation replacement logic
- [ ] Add hreflang and canonical tag generation
- [ ] Generate language-specific meta tags
- [ ] Create structured data for each language version

### 3. URL Structure

- [ ] Implement language subdirectories (/en/, /et/, /ru/)
- [ ] Create root index.html with language detection and redirection
- [ ] Update all internal links to include language paths
- [ ] Create language-specific 404 pages

### 4. Technical SEO Elements

- [ ] Generate sitemap.xml with hreflang annotations
- [ ] Create robots.txt file with appropriate directives
- [ ] Implement structured data for all key page types
- [ ] Test all technical SEO elements with validation tools

### 5. Language Detection and Switching

- [ ] Implement server-side language detection (if possible)
- [ ] Create client-side fallback detection
- [ ] Update language switcher to store preferences
- [ ] Test language detection and switching across browsers

### 6. Testing and Validation

- [ ] Validate HTML for all language versions
- [ ] Test hreflang implementation with Google's testing tools
- [ ] Validate structured data with Google's Structured Data Testing Tool
- [ ] Check meta tags for proper length and content
- [ ] Test site rendering in all target languages
- [ ] Verify all redirects work as expected

### 7. Monitoring and Maintenance

- [ ] Set up Google Search Console for all language versions
- [ ] Monitor indexing and search performance by language
- [ ] Create process for updating translations across all pages
- [ ] Establish workflow for adding new pages in all languages

### 8. Post-Implementation

- [ ] Submit updated sitemap to search engines
- [ ] Request re-crawling of key pages
- [ ] Monitor search engine indexing of language versions
- [ ] Track language-specific search performance