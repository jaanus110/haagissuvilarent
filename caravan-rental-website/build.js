const fs = require('fs');
const path = require('path');
const util = require('util');

// Promisify fs functions
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);

// Define supported languages
const languages = ['en', 'et', 'ru'];
const defaultLanguage = 'et';

// Define base URL for the website
const baseUrl = 'https://tartuhaagissuvila.ee';

// Define page templates to process
const templates = [
  { 
    name: 'index.html',
    outputName: 'index.html'
  },
  { 
    name: 'rental-terms.html',
    outputName: 'rental-terms.html'
  },
  { 
    name: 'privacy-policy.html',
    outputName: 'privacy-policy.html'
  },
  { 
    name: 'cookie-policy.html',
    outputName: 'cookie-policy.html'
  }
];

// Function to get locale code for a language
function getLocale(lang) {
  const localeMap = {
    'et': 'et_EE',
    'en': 'en_US',
    'ru': 'ru_RU'
  };
  return localeMap[lang] || 'en_US';
}

// Function to generate hreflang links for a page
function generateHreflangLinks(pagePath) {
  let links = '';
  
  // Add x-default hreflang link (pointing to the default language)
  links += `<link rel="alternate" href="${baseUrl}/${defaultLanguage}/${pagePath}" hreflang="x-default">\n`;
  
  // Add language-specific hreflang links
  languages.forEach(lang => {
    links += `<link rel="alternate" href="${baseUrl}/${lang}/${pagePath}" hreflang="${lang}">\n`;
  });
  
  return links;
}

// Function to generate canonical URL
function generateCanonicalLink(lang, pagePath) {
  return `<link rel="canonical" href="${baseUrl}/${lang}/${pagePath}">`;
}

// Function to generate meta tags for a page
function generateMetaTags(lang, translations, pageName) {
  const metaTags = [];
  const locale = getLocale(lang);
  
  // Determine page title and description based on page type
  let pageTitle, pageDescription;
  
  if (pageName === 'index.html') {
    pageTitle = translations['hero_title'] || 'Caravan Rental in Tartu';
    pageDescription = translations['meta_description'] || 'Rent a comfortable caravan in Tartu, Estonia.';
  } else {
    // For other pages, use specific title if available
    pageTitle = translations[`title_${pageName.replace('.html', '')}`] ||
                `${translations[`nav_${pageName.replace('.html', '')}`] || pageName.replace('.html', '')} - ${translations['nav_home'] || 'Caravan Rental'}`;
    pageDescription = translations['meta_description'] || 'Rent a comfortable caravan in Tartu, Estonia.';
  }
  
  // Title tag is already in the template, but we ensure it's properly set
  
  // Add meta description
  metaTags.push(`<meta name="description" content="${pageDescription}">`);
  
  // Add language meta tag
  metaTags.push(`<meta http-equiv="content-language" content="${lang}">`);
  
  // Add Open Graph tags
  metaTags.push(`<meta property="og:title" content="${pageTitle}">`);
  metaTags.push(`<meta property="og:description" content="${pageDescription}">`);
  metaTags.push(`<meta property="og:type" content="${pageName === 'index.html' ? 'website' : 'article'}">`);
  metaTags.push(`<meta property="og:locale" content="${locale}">`);
  
  // Add alternate locales for Open Graph
  languages.filter(l => l !== lang).forEach(l => {
    metaTags.push(`<meta property="og:locale:alternate" content="${getLocale(l)}">`);
  });
  
  // Add Open Graph URL
  const pagePath = pageName === 'index.html' ? '' : pageName;
  metaTags.push(`<meta property="og:url" content="${baseUrl}/${lang}/${pagePath}">`);
  
  // Add Open Graph image
  metaTags.push(`<meta property="og:image" content="${baseUrl}/img/gallery/out_front_right_1200w.jpg">`);
  
  // Add Twitter Card tags
  metaTags.push(`<meta name="twitter:card" content="summary_large_image">`);
  metaTags.push(`<meta name="twitter:title" content="${pageTitle}">`);
  metaTags.push(`<meta name="twitter:description" content="${pageDescription}">`);
  metaTags.push(`<meta name="twitter:image" content="${baseUrl}/img/gallery/out_front_right_1200w.jpg">`);
  
  return metaTags.join('\n');
}

// Function to generate structured data for a page
function generateStructuredData(lang, translations, pageName) {
  const structuredDataBlocks = [];
  const locale = getLocale(lang);
  
  // Organization / LocalBusiness structured data
  const organizationData = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RentalVehicleCompany",
  "name": "${translations['nav_home'] || 'Tartu Haagissuvila Rent'}",
  "url": "${baseUrl}/${lang}/",
  "logo": "${baseUrl}/img/gallery/out_front_right_400w.jpg",
  "image": "${baseUrl}/img/gallery/out_front_right_1200w.jpg",
  "description": "${translations['meta_description'] || ''}",
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
  "inLanguage": "${lang}"
}
</script>`;
  structuredDataBlocks.push(organizationData);
  
  // Product (The Caravan) structured data
  const productData = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Elddis Corona ${translations['nav_caravan'] || 'Caravan'}",
  "image": [
    "${baseUrl}/img/gallery/out_front_left_1200w.jpg",
    "${baseUrl}/img/gallery/in_kitchen_1200w.jpg",
    "${baseUrl}/img/gallery/in_bathroom_1200w.jpg"
  ],
  "description": "${translations['meta_description'] || ''}",
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
        "name": "${translations['rental_price_mon_thu'] ? translations['rental_price_mon_thu'].split(':')[0] : 'Weekday Rental'}",
        "price": "75",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "description": "${translations['rental_price_mon_thu'] || ''}"
      },
      {
        "@type": "Offer",
        "name": "${translations['rental_price_fri_sun'] ? translations['rental_price_fri_sun'].split(':')[0] : 'Weekend Rental'}",
        "price": "85",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "description": "${translations['rental_price_fri_sun'] || ''}"
      },
      {
        "@type": "Offer",
        "name": "${translations['rental_price_2025_2027'] ? translations['rental_price_2025_2027'].split(':')[0] : 'Peak Season Rental'}",
        "price": "170",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "description": "${translations['rental_price_2025_2027'] || ''}"
      }
    ]
  },
  "inLanguage": "${lang}"
}
</script>`;
  structuredDataBlocks.push(productData);
  
  // WebPage structured data
  const pageTitle = pageName === 'index.html'
    ? translations['hero_title'] || 'Caravan Rental'
    : translations[`title_${pageName.replace('.html', '')}`] || pageName.replace('.html', '');
  
  const webPageData = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "${baseUrl}/${lang}/${pageName === 'index.html' ? '' : pageName}",
  "name": "${pageTitle}",
  "description": "${translations['meta_description'] || ''}",
  "inLanguage": "${lang}",
  "isPartOf": {
    "@type": "WebSite",
    "url": "${baseUrl}",
    "name": "${translations['nav_home'] || 'Tartu Haagissuvila Rent'}",
    "alternateName": "Caravan Rental Tartu"
  },
  "potentialAction": {
    "@type": "RentAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "${baseUrl}/${lang}/#contact-cta"
    },
    "object": {
      "@type": "Product",
      "name": "Elddis Corona ${translations['nav_caravan'] || 'Caravan'}"
    }
  }
}
</script>`;
  structuredDataBlocks.push(webPageData);
  
  // BreadcrumbList structured data (for non-index pages)
  if (pageName !== 'index.html') {
    const homeLabel = translations['nav_home'];
    const pageLabel = translations[`nav_${pageName.replace('.html', '')}`] || pageName;
    
    const breadcrumbData = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "${homeLabel}",
      "item": "${baseUrl}/${lang}/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "${pageLabel}",
      "item": "${baseUrl}/${lang}/${pageName}"
    }
  ]
}
</script>`;
    structuredDataBlocks.push(breadcrumbData);
  }
  
  return structuredDataBlocks.join('\n');
}

// Main function to process templates and generate language-specific pages
async function buildSite() {
  console.log('Starting site build process...');
  
  try {
    // Load translations for all languages
    const translationData = {};
    for (const lang of languages) {
      const translationFile = await readFile(path.join(__dirname, 'translations', `${lang}.json`), 'utf8');
      translationData[lang] = JSON.parse(translationFile);
    }
    
    // Process each template for each language
    for (const lang of languages) {
      console.log(`Processing language: ${lang}`);
      
      // Create language directory if it doesn't exist
      const langDir = path.join(__dirname, lang);
      try {
        await mkdir(langDir, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
      
      // Process each template
      for (const template of templates) {
        console.log(`  Processing template: ${template.name}`);
        
        // Read template file
        const templateContent = await readFile(path.join(__dirname, 'templates', template.name), 'utf8');
        
        // Replace placeholders with translations
        let processedContent = templateContent;
        
        // Replace lang attribute
        processedContent = processedContent.replace(/lang="{{lang}}"/g, `lang="${lang}"`);
        
        // Replace translation placeholders
        const translations = translationData[lang];
        for (const key in translations) {
          const placeholder = new RegExp(`{{${key}}}`, 'g');
          processedContent = processedContent.replace(placeholder, translations[key]);
        }
        
        // Add hreflang links
        const hreflangLinks = generateHreflangLinks(template.outputName);
        processedContent = processedContent.replace('</head>', `${hreflangLinks}</head>`);
        
        // Add canonical link
        const canonicalLink = generateCanonicalLink(lang, template.outputName);
        processedContent = processedContent.replace('</head>', `${canonicalLink}\n</head>`);
        
        // Add meta tags
        const metaTags = generateMetaTags(lang, translations, template.outputName);
        processedContent = processedContent.replace('</head>', `${metaTags}\n</head>`);
        
        // Add structured data
        const structuredData = generateStructuredData(lang, translations, template.outputName);
        if (structuredData) {
          processedContent = processedContent.replace('</head>', `${structuredData}\n</head>`);
        }
        
        // Write processed file to language directory
        await writeFile(path.join(langDir, template.outputName), processedContent, 'utf8');
      }
    }
    
    // Generate root index.html with language detection
    await generateRootIndex();
    
    // Generate sitemap.xml
    await generateSitemap();
    
    // Generate robots.txt
    await generateRobotsTxt();
    
    console.log('Site build completed successfully!');
  } catch (error) {
    console.error('Error building site:', error);
  }
}

// Function to generate root index.html with language detection
async function generateRootIndex() {
  console.log('Generating root index.html with language detection...');
  
  const rootIndexContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caravan Rental in Tartu, Estonia</title>
    <meta name="description" content="Rent a comfortable caravan in Tartu, Estonia. Perfect for family holidays and exploring the Baltics.">
    <meta http-equiv="refresh" content="0;url=/${defaultLanguage}/">
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }
        .language-links {
            margin-top: 20px;
        }
        .language-links a {
            margin: 0 10px;
            text-decoration: none;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    </style>
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
    <div class="language-links">
        <a href="/et/">Eesti keeles</a>
        <a href="/en/">In English</a>
        <a href="/ru/">На русском</a>
    </div>
</body>
</html>`;

  await writeFile(path.join(__dirname, 'index.html'), rootIndexContent, 'utf8');
}

// Function to generate sitemap.xml with hreflang annotations
async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  
  // Add entries for each page in each language
  for (const template of templates) {
    const pagePath = template.outputName;
    
    for (const lang of languages) {
      const url = pagePath === 'index.html' ? `${baseUrl}/${lang}/` : `${baseUrl}/${lang}/${pagePath}`;
      
      sitemapContent += `  <url>\n`;
      sitemapContent += `    <loc>${url}</loc>\n`;
      
      // Add hreflang annotations for all languages
      for (const hrefLang of languages) {
        const hrefUrl = pagePath === 'index.html' ? `${baseUrl}/${hrefLang}/` : `${baseUrl}/${hrefLang}/${pagePath}`;
        sitemapContent += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${hrefUrl}" />\n`;
      }
      
      // Add x-default hreflang
      const defaultUrl = pagePath === 'index.html' ? `${baseUrl}/${defaultLanguage}/` : `${baseUrl}/${defaultLanguage}/${pagePath}`;
      sitemapContent += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />\n`;
      
      sitemapContent += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      sitemapContent += `    <changefreq>monthly</changefreq>\n`;
      sitemapContent += `    <priority>${pagePath === 'index.html' ? '1.0' : '0.8'}</priority>\n`;
      sitemapContent += `  </url>\n`;
    }
  }
  
  sitemapContent += `</urlset>`;
  
  await writeFile(path.join(__dirname, 'sitemap.xml'), sitemapContent, 'utf8');
}

// Function to generate robots.txt
async function generateRobotsTxt() {
  console.log('Generating robots.txt...');
  
  const robotsTxtContent = `User-agent: *
Allow: /
Allow: /en/
Allow: /et/
Allow: /ru/

Sitemap: ${baseUrl}/sitemap.xml
`;
  
  await writeFile(path.join(__dirname, 'robots.txt'), robotsTxtContent, 'utf8');
}

// Run the build process
buildSite();