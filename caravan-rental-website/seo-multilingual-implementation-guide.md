# Multilingual SEO Implementation Guide for Caravan Rental Website - Part 1

> **Note:** This guide is continued in [Part 2](seo-multilingual-implementation-guide-part2.md) which contains the remaining sections: completion of Structured Data Implementation, Meta Tags Optimization, Language Detection Strategy, and Implementation Checklist.

## Table of Contents
1. [Current SEO Issues Analysis](#current-seo-issues-analysis)
2. [Multilingual SEO Best Practices](#multilingual-seo-best-practices)
3. [Content Rendering Strategy](#content-rendering-strategy)
4. [URL Structure Implementation](#url-structure-implementation)
5. [Sitemap.xml Strategy](#sitemapxml-strategy)
6. [Robots.txt Implementation](#robotstxt-implementation)
7. [Structured Data Implementation](#structured-data-implementation)
8. [Meta Tags Optimization](#meta-tags-optimization)
9. [Language Detection Strategy](#language-detection-strategy)
10. [Implementation Checklist](#implementation-checklist)

## Current SEO Issues Analysis

The current website implementation has several SEO issues related to multilingual content:

### Client-Side Language Detection and Content Replacement

- The website uses JavaScript (`language-detector.js`) to detect the user's language preference and dynamically replace content after the page loads
- Search engines primarily crawl and index the initial HTML content
- Most search engine crawlers have limited JavaScript execution capabilities
- Even when JavaScript is executed, search engines may not wait for all dynamic content to load
- The result is that search engines primarily index only the default language content

### Single URL Structure for All Languages

- The website uses the same URL for all language versions
- No way for search engines to index different language versions separately
- Users can't directly link to or bookmark content in a specific language
- Search engines can't properly direct users to content in their preferred language

### Missing Technical SEO Elements for Multilingual Sites

- No `hreflang` tags to indicate language relationships between pages
- No language-specific canonical tags
- No sitemap.xml file with language indicators
- No robots.txt file to guide search engine crawlers

### Meta Tag Translation Issues

- Meta tags (title, description, keywords) have `data-translate-key-content` attributes, meaning:
  - They're replaced client-side via JavaScript
  - Search engines likely only see the default language meta tags
  - This affects how the site appears in search results for different languages

### No Structured Data

- The site lacks structured data (schema.org) implementation that could help search engines better understand the content context and language variations

## Multilingual SEO Best Practices

### URL Structure Options (in order of SEO effectiveness)

1. **Subdirectory approach** (recommended for this site):
   - example.com/et/ (Estonian)
   - example.com/en/ (English)
   - example.com/ru/ (Russian)
   
   This approach is relatively easy to implement, maintains domain authority across all language versions, and clearly signals language to both users and search engines.

2. **Separate ccTLDs**:
   - tartuhaagissuvila.ee (Estonian)
   - tartuhaagissuvila.com (English)
   - tartuhaagissuvila.ru (Russian)
   
   While this provides the strongest geo-targeting signal, it requires maintaining separate domains and divides domain authority.

3. **Subdomains**:
   - et.tartuhaagissuvila.ee
   - en.tartuhaagissuvila.ee
   - ru.tartuhaagissuvila.ee
   
   This is easier to set up at the server level but may be treated as separate sites by search engines.

4. **URL parameters** (least recommended):
   - tartuhaagissuvila.ee?lang=et
   
   This approach is problematic for SEO as parameters are often ignored by search engines.

### Content Delivery Methods

1. **Server-side rendering (SSR)**:
   - Generate language-specific HTML on the server before sending to the client
   - Ensures search engines see the complete, translated content
   - Can be implemented with various backend technologies (Node.js, PHP, etc.)

2. **Static site generation**:
   - Pre-build separate HTML files for each language version
   - Excellent for SEO as content is immediately available
   - Good option for sites with content that doesn't change frequently

3. **Hybrid approach**:
   - Server-side rendering for initial page load
   - Client-side language switching only when users explicitly request it

### Technical SEO Implementation

1. **Hreflang tags**:
   ```html
   <link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/" />
   <link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/" />
   <link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/" />
   <link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/" />
   ```

2. **Language-specific canonical tags**:
   ```html
   <link rel="canonical" href="https://tartuhaagissuvila.ee/et/" />
   ```

3. **XML Sitemap with language indicators**:
   ```xml
   <url>
     <loc>https://tartuhaagissuvila.ee/et/</loc>
     <xhtml:link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/"/>
     <xhtml:link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/"/>
     <xhtml:link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/"/>
   </url>
   ```

4. **Structured data with language indicators**:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebPage",
     "inLanguage": "et",
     "name": "Haagissuvila rent Tartus",
     ...
   }
   ```

## Content Rendering Strategy

### Recommended Approach: Static Site Generation

#### Overview
Generate separate, complete HTML files for each language version during the build process, resulting in a directory structure like:
```
/
├── en/
│   ├── index.html
│   ├── rental-terms.html
│   ├── privacy-policy.html
│   └── cookie-policy.html
├── et/
│   ├── index.html
│   ├── rental-terms.html
│   ├── privacy-policy.html
│   └── cookie-policy.html
├── ru/
│   ├── index.html
│   ├── rental-terms.html
│   ├── privacy-policy.html
│   └── cookie-policy.html
└── index.html (redirect to preferred language)
```

#### Implementation Steps

1. **Create HTML Templates**:
   - Convert the current index.html into a template with placeholders for translated content
   - Create similar templates for other pages (rental-terms.html, privacy-policy.html, cookie-policy.html)

2. **Extract Translation Data**:
   - Move the translation data from `language-detector.js` to separate JSON files:
     - `/translations/en.json`
     - `/translations/et.json`
     - `/translations/ru.json`

3. **Build Process**:
   - Create a simple build script (Node.js) that:
     - Reads the templates
     - For each language:
       - Loads the corresponding translation file
       - Replaces placeholders with translated content
       - Generates language-specific HTML files in the appropriate subdirectory
       - Adds proper hreflang tags, canonical URLs, and language-specific meta tags

4. **Root Index Redirect**:
   - Create a root index.html that:
     - Detects the user's preferred language (server-side if possible, or with minimal JavaScript)
     - Redirects to the appropriate language subdirectory
     - Includes links to all language versions for immediate access

#### Example Build Script

```javascript
const fs = require('fs');
const path = require('path');

// Languages to generate
const languages = ['en', 'et', 'ru'];

// Load templates
const indexTemplate = fs.readFileSync('templates/index.html', 'utf8');
const termsTemplate = fs.readFileSync('templates/rental-terms.html', 'utf8');
// ... load other templates

// For each language
languages.forEach(lang => {
  // Load translations
  const translations = JSON.parse(fs.readFileSync(`translations/${lang}.json`, 'utf8'));
  
  // Create directory if it doesn't exist
  const langDir = path.join('dist', lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  
  // Generate index.html
  let indexContent = indexTemplate;
  
  // Replace all translation keys with their values
  Object.keys(translations).forEach(key => {
    const regex = new RegExp(`data-translate-key="${key}"[^>]*>([^<]*)<`, 'g');
    indexContent = indexContent.replace(regex, `data-translate-key="${key}">${translations[key]}<`);
    
    // Also handle meta tags
    const metaRegex = new RegExp(`data-translate-key-content="${key}"[^>]*content="[^"]*"`, 'g');
    indexContent = indexContent.replace(metaRegex, `data-translate-key-content="${key}" content="${translations[key]}"`);
  });
  
  // Add hreflang tags
  let hreflangTags = '';
  languages.forEach(l => {
    hreflangTags += `<link rel="alternate" hreflang="${l}" href="https://tartuhaagissuvila.ee/${l}/" />\n`;
  });
  hreflangTags += `<link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/" />`;
  
  // Insert hreflang tags before </head>
  indexContent = indexContent.replace('</head>', `${hreflangTags}\n</head>`);
  
  // Add canonical tag
  const canonicalTag = `<link rel="canonical" href="https://tartuhaagissuvila.ee/${lang}/" />`;
  indexContent = indexContent.replace('</head>', `${canonicalTag}\n</head>`);
  
  // Write the file
  fs.writeFileSync(path.join(langDir, 'index.html'), indexContent);
  
  // Repeat for other templates...
});
```

## URL Structure Implementation

### Directory Structure
```
/
├── en/
│   ├── index.html
│   ├── rental-terms.html
│   ├── privacy-policy.html
│   └── cookie-policy.html
├── et/
│   ├── index.html
│   ├── rental-terms.html (or renditingimused.html - consider localized URLs)
│   ├── privacy-policy.html
│   └── cookie-policy.html
├── ru/
│   ├── index.html
│   ├── rental-terms.html
│   ├── privacy-policy.html
│   └── cookie-policy.html
└── index.html (redirect script)
```

### URL Pattern Guidelines
- **Consistent patterns**: Maintain the same URL structure across all languages
- **Consider URL translation**: For maximum SEO benefit, translate the URL slugs themselves
  ```
  /en/rental-terms.html
  /et/renditingimused.html
  /ru/условия-аренды.html
  ```
  or keep them consistent if preferred:
  ```
  /en/rental-terms.html
  /et/rental-terms.html
  /ru/rental-terms.html
  ```

### Root URL Handling
- Create an index.html at the root that:
  - Detects the user's preferred language
  - Redirects to the appropriate language subdirectory
  - Uses a 302 (temporary) redirect to avoid SEO issues with the language detection

### Hreflang Tag Implementation

#### Hreflang Tag Format
Add the following to the `<head>` section of every page:

```html
<!-- For the English version of the homepage -->
<link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/" />
<link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/" />
<link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/" />
<link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/" />
<link rel="canonical" href="https://tartuhaagissuvila.ee/en/" />
```

```html
<!-- For the English version of the rental terms page -->
<link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/rental-terms.html" />
<link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/rental-terms.html" />
<link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/rental-terms.html" />
<link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/rental-terms.html" />
<link rel="canonical" href="https://tartuhaagissuvila.ee/en/rental-terms.html" />
```

#### Implementation Notes
- **Self-referencing**: Always include the current page in hreflang tags
- **x-default**: Use Estonian (et) as the x-default since it appears to be the primary language
- **Absolute URLs**: Always use absolute URLs in hreflang tags
- **Bidirectional references**: Ensure all pages reference all other language versions
- **Canonical tags**: Include a canonical tag pointing to the current URL

#### Automation
Generate these tags dynamically during the build process:

```javascript
function generateHreflangTags(currentLang, pagePath) {
  const languages = ['en', 'et', 'ru'];
  const baseUrl = 'https://tartuhaagissuvila.ee';
  let tags = '';
  
  // Add alternate hreflang tags for all languages
  languages.forEach(lang => {
    tags += `<link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}${pagePath}" />\n`;
  });
  
  // Add x-default (using Estonian as default)
  tags += `<link rel="alternate" hreflang="x-default" href="${baseUrl}/et${pagePath}" />\n`;
  
  // Add canonical tag for current page
  tags += `<link rel="canonical" href="${baseUrl}/${currentLang}${pagePath}" />`;
  
  return tags;
}
```

### Navigation and Language Switcher Updates

#### Language Switcher HTML
Update the language switcher in the navigation:

```html
<li class="nav-item">
    <a class="nav-link lang-link" href="/en/" title="English">
        <span class="flag-emoji">🇬🇧</span>
    </a>
</li>
<li class="nav-item">
    <a class="nav-link lang-link" href="/et/" title="Estonian">
        <span class="flag-emoji">🇪🇪</span>
    </a>
</li>
<li class="nav-item">
    <a class="nav-link lang-link" href="/ru/" title="Russian">
        <span class="flag-emoji">🇷🇺</span>
    </a>
</li>
```

#### Internal Links
Ensure all internal links point to the correct language version:

```html
<!-- Before -->
<a href="rental-terms.html">Rental Terms</a>

<!-- After -->
<a href="/en/rental-terms.html">Rental Terms</a>
```

This can be handled during the build process by prefixing all internal links with the current language path.

### Root URL Handling Script

Create a simple script for the root index.html:

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

### Handling Edge Cases

#### 404 Pages
Create language-specific 404 pages:
- /en/404.html
- /et/404.html
- /ru/404.html

Configure the server to serve the appropriate language 404 page based on the requested URL path.

#### Language-Specific Content
If some content exists only in certain languages:
1. Create placeholder pages in all languages explaining that the content is not available
2. Still include proper hreflang tags pointing to all language versions
3. Consider adding a note suggesting the user view the content in an available language

## Sitemap.xml Strategy

### Recommended Approach: Single Sitemap with Hreflang Annotations

#### Example Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Homepage in all languages -->
  <url>
    <loc>https://tartuhaagissuvila.ee/et/</loc>
    <lastmod>2025-07-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/"/>
  </url>
  <url>
    <loc>https://tartuhaagissuvila.ee/en/</loc>
    <lastmod>2025-07-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/"/>
  </url>
  <url>
    <loc>https://tartuhaagissuvila.ee/ru/</loc>
    <lastmod>2025-07-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/"/>
  </url>
  
  <!-- Rental Terms page in all languages -->
  <url>
    <loc>https://tartuhaagissuvila.ee/et/rental-terms.html</loc>
    <lastmod>2025-07-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="et" href="https://tartuhaagissuvila.ee/et/rental-terms.html"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://tartuhaagissuvila.ee/en/rental-terms.html"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://tartuhaagissuvila.ee/ru/rental-terms.html"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://tartuhaagissuvila.ee/et/rental-terms.html"/>
  </url>
  
  <!-- Continue with other pages in all languages -->
  <!-- ... -->
  
</urlset>
```

#### Implementation Script

```javascript
const fs = require('fs');
const path = require('path');

// Configuration
const baseUrl = 'https://tartuhaagissuvila.ee';
const languages = ['et', 'en', 'ru'];
const defaultLanguage = 'et';
const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/rental-terms.html', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy-policy.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/cookie-policy.html', changefreq: 'monthly', priority: '0.7' }
];

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Start XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

// Add each page in each language
pages.forEach(page => {
  languages.forEach(lang => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/${lang}${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    
    // Add hreflang links for all languages
    languages.forEach(hrefLang => {
      xml += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${baseUrl}/${hrefLang}${page.path}"/>\n`;
    });
    
    // Add x-default hreflang
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/${defaultLanguage}${page.path}"/>\n`;
    
    xml += '  </url>\n';
  });
});

// Close XML
xml += '</urlset>';

// Write to file
fs.writeFileSync(path.join('dist', 'sitemap.xml'), xml);
console.log('Sitemap generated successfully!');
```

#### Sitemap Registration
- Place the sitemap.xml file at the root of the website
- Register the sitemap in Google Search Console and other search engines
- Add a reference to the sitemap in the robots.txt file

## Robots.txt Implementation

### Recommended Robots.txt File

```
# robots.txt for tartuhaagissuvila.ee
# Last updated: July 10, 2025

User-agent: *
Allow: /

# Allow all language directories
Allow: /et/
Allow: /en/
Allow: /ru/

# Temporary files or development areas (if any)
Disallow: /temp/
Disallow: /dev/
Disallow: /test/

# Prevent crawling of duplicate content
Disallow: /*?*

# Prevent crawling of image directories directly
# (images will still be indexed through their usage in pages)
Disallow: /img/

# Sitemap location
Sitemap: https://tartuhaagissuvila.ee/sitemap.xml

# Crawl delay for specific bots if needed
# User-agent: SomeSlowBot
# Crawl-delay: 10
```

### Implementation Steps

1. **File Placement**:
   - Create the robots.txt file and place it at the root of the website (https://tartuhaagissuvila.ee/robots.txt)
   - Ensure it's directly accessible at this URL

2. **Content Considerations**:
   - The example above is a starting point - customize based on specific website needs
   - Update the "Last updated" date whenever changes are made
   - Add any specific directories that should be excluded from crawling

3. **Testing**:
   - Use Google Search Console's robots.txt tester to verify the file works as expected
   - Check that all important URLs are allowed and any sensitive or duplicate content is properly disallowed

## Structured Data Implementation

### Recommended Structured Data Types

#### 1. Organization / LocalBusiness

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RentalVehicleCompany",
  "name": "Tartu Haagissuvila Rent",
  "url": "https://tartuhaagissuvila.ee/et/",
  "logo": "https://tartuhaagissuvila.ee/img/logo.jpg",
  "image": "https://tartuhaagissuvila.ee/img/gallery/out_front_right_1200w.jpg",
  "description": "Haagissuvila rent Tartus, Eestis. Ideaalne perepuhkuseks ja Baltikumi avastamiseks.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Tartu",
    "addressRegion": "Tartumaa",
    "addressCountry": "EE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "58.3634850",
    "longitude": "26.6822315"
  },
  "telephone": "+37253322495",
  "email": "info@tartuhaagissuvila.ee",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "17:00"
  },
  "inLanguage": "et"
}
</script>
```

For English and Russian versions, create similar blocks with translated content and updated `inLanguage` property.

#### 2. Product (The Caravan)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Elddis Corona Haagissuvila",
  "image": [
    "https://tartuhaagissuvila.ee/img/gallery/out_front_left_1200w.jpg",
    "https://tartuhaagissuvila.ee/img/gallery/in_kitchen_1200w.jpg",
    "https://tartuhaagissuvila.ee/img/gallery/in_bathroom_1200w.jpg"
  ],
  "description": "Mugav 5-kohaline Elddis Corona haagissuvila rentimiseks Tartus. Täisvarustuses köök, tualett ja kõik mugavused.",
  "brand": {
    "@type": "Brand",
    "name": "Elddis Corona"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "75",
    "highPrice": "170",
    "offerCount": "3",
    "offers": [
      {
        "@type": "Offer",
        "name": "Tööpäevade rent",
        "price": "75",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "description": "Renditasu E-N 75 eurot / päev"
      },
      {
        "@type": "Offer",
        "name": "Nädalavahetuse rent",
        "price": "85",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "description": "Renditasu R-P: 85 eurot / päev"
      },
      {
        "@type": "Offer",
        "name": "Tipphooaja rent",
        "price": "170",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "description": "Renditasu 17.07.2025 - 20.07.2025 170 eurot / päev"
      }
    ]
  },
  "inLanguage": "et"
}
</script>
```

#### 3. WebPage (For Each Page)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://tartuhaagissuvila.ee/et/",
  "name": "Haagissuvila rent Tartus",
  "description": "Rendi mugav haagissuvila Tartus, Eestis. Ideaalne perepuhkuseks ja Baltikumi avastamiseks.",
  "inLanguage": "et",
  "isPartOf": {
    "@type": "WebSite",
    "url": "https://tartuhaagissuvila.ee",
    "name": "Tartu Haagissuvila Rent",
    "alternateName": "Caravan Rental Tartu"
  },
  "potentialAction": {
    "@type": "RentAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://tartuhaagissuvila.ee/et/#contact-cta"
    },
    "object": {
      "@type": "Product",
      "name": "Elddis Corona Haagissuvila"
    }
  }
}
</script>
```

#### 4. BreadcrumbList (For Navigation)

see file seo-multilingual-implementation-guide-part2.md