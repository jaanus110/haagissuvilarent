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
  },
  { 
    name: 'index-amp.html',
    outputName: 'amp.html'
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
  
  // Format the page path correctly - remove .html extension for cleaner URLs
  // If it's index.html, use empty string for clean URLs
  let formattedPath = '';
  if (pagePath !== 'index.html') {
    formattedPath = pagePath.replace('.html', '');
  }
  
  // Add x-default hreflang link (pointing to the default language)
  links += `<link rel="alternate" href="${baseUrl}/${defaultLanguage}/${formattedPath}" hreflang="x-default">\n`;
  
  // Add language-specific hreflang links with geo-targeting for Estonian content
  languages.forEach(lang => {
    if (lang === 'et') {
      // Use et-EE for Estonian to target Estonia specifically
      links += `<link rel="alternate" href="${baseUrl}/${lang}/${formattedPath}" hreflang="et-EE">\n`;
    } else if (lang === 'en') {
      // Use en for general English and en-US for US-specific targeting
      links += `<link rel="alternate" href="${baseUrl}/${lang}/${formattedPath}" hreflang="en">\n`;
      links += `<link rel="alternate" href="${baseUrl}/${lang}/${formattedPath}" hreflang="en-US">\n`;
    } else if (lang === 'ru') {
      // Use ru for general Russian and ru-RU for Russia-specific targeting
      links += `<link rel="alternate" href="${baseUrl}/${lang}/${formattedPath}" hreflang="ru">\n`;
      links += `<link rel="alternate" href="${baseUrl}/${lang}/${formattedPath}" hreflang="ru-RU">\n`;
    } else {
      links += `<link rel="alternate" href="${baseUrl}/${lang}/${formattedPath}" hreflang="${lang}">\n`;
    }
  });
  
  return links;
}

// Function to generate canonical URL
function generateCanonicalLink(lang, pagePath) {
  // For AMP pages, canonical should point to the regular version
  if (pagePath === 'amp.html') {
    return `<link rel="canonical" href="${baseUrl}/${lang}/">`;
  }
  
  // Format the page path correctly - remove .html extension for cleaner URLs
  // If it's index.html, use empty string for clean URLs
  let formattedPath = '';
  if (pagePath !== 'index.html') {
    formattedPath = pagePath.replace('.html', '');
  }
  
  return `<link rel="canonical" href="${baseUrl}/${lang}/${formattedPath}">`;
}

// Function to generate meta tags for a page
function generateMetaTags(lang, translations, pageName) {
  const metaTags = [];
  const locale = getLocale(lang);
  
  // Determine page title and description based on page type
  let pageTitle, pageDescription;
  
  // Standardized title format across all languages as per SEO recommendations
  if (pageName === 'index.html') {
    // For homepage, use standardized format for each language
    if (lang === 'en') {
      pageTitle = "Caravan Rental in Tartu | Elddis Corona | TartuHaagissuvila.ee";
    } else if (lang === 'et') {
      pageTitle = "Haagissuvila Rent Tartus | Elddis Corona | TartuHaagissuvila.ee";
    } else if (lang === 'ru') {
      pageTitle = "Аренда Автодома в Тарту | Elddis Corona | TartuHaagissuvila.ee";
    } else {
      pageTitle = translations['hero_title'] || 'Caravan Rental in Tartu';
    }
    
    pageDescription = translations['meta_description'] || 'Rent a comfortable caravan in Tartu, Estonia.';
  } else {
    // For other pages, use specific title if available, but maintain consistent format
    const pageTitleKey = `title_${pageName.replace('.html', '')}`;
    if (translations[pageTitleKey]) {
      pageTitle = translations[pageTitleKey];
    } else {
      // Fallback with consistent format
      const pageNameTranslated = translations[`nav_${pageName.replace('.html', '')}`] || pageName.replace('.html', '');
      if (lang === 'en') {
        pageTitle = `${pageNameTranslated} | Caravan Rental in Tartu | TartuHaagissuvila.ee`;
      } else if (lang === 'et') {
        pageTitle = `${pageNameTranslated} | Haagissuvila Rent Tartus | TartuHaagissuvila.ee`;
      } else if (lang === 'ru') {
        pageTitle = `${pageNameTranslated} | Аренда Автодома в Тарту | TartuHaagissuvila.ee`;
      } else {
        pageTitle = `${pageNameTranslated} - ${translations['nav_home'] || 'Caravan Rental'}`;
      }
    }
    
    // Use page-specific meta description if available
    const metaDescKey = `meta_description_${pageName.replace('.html', '')}`;
    pageDescription = translations[metaDescKey] || translations['meta_description'] || 'Rent a comfortable caravan in Tartu, Estonia.';
  }
  
  // Add title tag to ensure it's properly set
  metaTags.push(`<title>${pageTitle}</title>`);
  
  // Add meta description
  metaTags.push(`<meta name="description" content="${pageDescription}">`);
  
  // Add language meta tag
  metaTags.push(`<meta http-equiv="content-language" content="${lang}">`);
  
  // Add original vs. translated content indicators
  // Estonian is the original content, others are translated
  if (lang === 'et') {
    metaTags.push(`<meta name="content-source" content="original">`);
    metaTags.push(`<meta name="content-language-original" content="et">`);
  } else {
    metaTags.push(`<meta name="content-source" content="translated">`);
    metaTags.push(`<meta name="content-language-original" content="et">`);
    metaTags.push(`<meta name="translated-from" content="et">`);
  }
  
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
  
  // Add Open Graph image with dimensions
  metaTags.push(`<meta property="og:image" content="${baseUrl}/img/gallery/out_front_right_1200w.webp">`);
  metaTags.push(`<meta property="og:image:width" content="1200">`);
  metaTags.push(`<meta property="og:image:height" content="900">`);
  // Use language-specific image alt text from translations
  const imageAlt = translations['hero_image_alt'] ||
                  (lang === 'et' ? 'Elddis Corona haagissuvila välivaade Tartus Eestis' :
                   lang === 'en' ? 'Elddis Corona caravan exterior view in Tartu Estonia' :
                   'Внешний вид каравана Elddis Corona в Тарту, Эстония');
  
  metaTags.push(`<meta property="og:image:alt" content="${imageAlt}">`);
  metaTags.push(`<meta property="og:image:type" content="image/webp">`);
  metaTags.push(`<meta property="og:site_name" content="TartuHaagissuvila.ee">`);
  
  // Add Twitter Card tags with dimensions
  metaTags.push(`<meta name="twitter:card" content="summary_large_image">`);
  metaTags.push(`<meta name="twitter:title" content="${pageTitle}">`);
  metaTags.push(`<meta name="twitter:description" content="${pageDescription}">`);
  metaTags.push(`<meta name="twitter:image" content="${baseUrl}/img/gallery/out_front_right_1200w.webp">`);
  metaTags.push(`<meta name="twitter:image:alt" content="${imageAlt}">`);
  metaTags.push(`<meta name="twitter:site" content="@TartuHaagissuvila">`);
  metaTags.push(`<meta name="twitter:creator" content="@TartuHaagissuvila">`);
  
  // Add AMP link for index pages
  if (pageName === 'index.html') {
    metaTags.push(`<link rel="amphtml" href="${baseUrl}/${lang}/amp.html">`);
  }
  
  return metaTags.join('\n');
}

// Function to read component files
async function readComponentFile(componentPath) {
  try {
    return await readFile(path.join(__dirname, componentPath), 'utf8');
  } catch (error) {
    console.error(`Error reading component file ${componentPath}:`, error.message);
    return ''; // Return empty string if file can't be read
  }
}

// Function to read structured data JSON files and format them as script tags
async function readStructuredDataFile(jsonPath, lang, translations) {
  try {
    let jsonContent = await readFile(path.join(__dirname, jsonPath), 'utf8');
    
    // Replace language placeholder in the JSON content
    jsonContent = jsonContent.replace(/{{lang}}/g, lang);
    
    // Replace translation placeholders in the JSON content
    for (const key in translations) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      jsonContent = jsonContent.replace(placeholder, translations[key]);
    }
    
    // Parse the JSON to validate it
    const jsonData = JSON.parse(jsonContent);
    
    // Format as script tag - make it match the correct Estonian version
    return `<script type="application/ld+json">\n${JSON.stringify(jsonData, null, 2)}\n</script>`;
  } catch (error) {
    console.error(`Error processing structured data file ${jsonPath}:`, error.message);
    return ''; // Return empty string if file can't be processed
  }
}

// Function to include components in templates
async function includeComponents(templateContent, lang, translations, template) {
  let processedContent = templateContent;
  
  // Process component references
  const componentRegex = /<!-- COMPONENT: ([A-Z_]+) -->/g;
  let match;
  
  while ((match = componentRegex.exec(templateContent)) !== null) {
    const componentName = match[1];
    const componentPath = getComponentPath(componentName);
    
    if (componentPath) {
      let componentContent;
      
      // Check if this is a structured data component (JSON file)
      if (componentPath.endsWith('.json')) {
        // Map missing translation keys to existing ones for structured data
        const translationMap = {
          'caravan_name': 'nav_home', // Use site name if caravan name is missing
          'meta_title': 'hero_title', // Use hero title if meta title is missing
          'faq_question_min_rental': 'faq_question_rental_period', // Map to correct FAQ question key
          'faq_question_prices': 'faq_question_pricing', // Map to correct FAQ question key
          'rental_price_mon_thu_title': 'rental_price_mon_thu', // Map price title to price text
          'rental_price_fri_sun_title': 'rental_price_fri_sun', // Map price title to price text
          'rental_price_mon_thu_num': '75', // Hardcoded price number from translation text
          'rental_price_fri_sun_num': '85'  // Hardcoded price number from translation text
        };
        
        // Create an enhanced translations object with mapped keys
        const enhancedTranslations = { ...translations };
        
        // Add mapped translations for missing keys
        Object.keys(translationMap).forEach(missingKey => {
          if (!enhancedTranslations[missingKey] && translationMap[missingKey]) {
            if (!isNaN(translationMap[missingKey])) {
              // If it's a number, use it directly
              enhancedTranslations[missingKey] = translationMap[missingKey];
            } else if (enhancedTranslations[translationMap[missingKey]]) {
              // If it's a key that exists in translations, use its value
              enhancedTranslations[missingKey] = enhancedTranslations[translationMap[missingKey]];
            }
          }
        });
        
        // Use readStructuredDataFile for JSON files
        componentContent = await readStructuredDataFile(componentPath, lang, enhancedTranslations);
      } else {
        // For HTML components, use readComponentFile
        componentContent = await readComponentFile(componentPath);
        
        // Enhanced component translation handling
        // First, log the component being processed for debugging
        console.log(`    Processing component: ${componentName} for language: ${lang}`);
        
        // Special handling for critical components like navbar and hero section
        const isCriticalComponent = componentName === 'NAVBAR' || componentName === 'HERO_SECTION';
        if (isCriticalComponent) {
          console.log(`    Applying translations to critical component: ${componentName}`);
          
          // Log available translations for critical keys in this component
          if (componentName === 'NAVBAR') {
            console.log(`    Navbar translations available: nav_home=${translations['nav_home']}, nav_photos=${translations['nav_photos']}, nav_caravan=${translations['nav_caravan']}, nav_pricing=${translations['nav_pricing']}, nav_contact=${translations['nav_contact']}`);
            
            // Special handling for navbar component
            // Determine if we're on the index page or another page
            const isIndexPage = template && template.name === 'index.html';
            const currentPage = template ? template.outputName : 'index.html';
            
            // Set the prefix for navigation links
            const prefix = isIndexPage ? '' : 'index.html';
            componentContent = componentContent.replace(/{{prefix}}/g, prefix);
            
            // Set the language paths for the language selector
            const langPathEn = isIndexPage ? '../en/index.html' : '../en/' + currentPage;
            const langPathEt = isIndexPage ? '../et/index.html' : '../et/' + currentPage;
            const langPathRu = isIndexPage ? '../ru/index.html' : '../ru/' + currentPage;
            
            componentContent = componentContent.replace(/{{lang_path_en}}/g, langPathEn);
            componentContent = componentContent.replace(/{{lang_path_et}}/g, langPathEt);
            componentContent = componentContent.replace(/{{lang_path_ru}}/g, langPathRu);
            
            console.log(`    Set navbar paths for ${currentPage} in ${lang}: prefix=${prefix}, langPathEn=${langPathEn}`);
          } else if (componentName === 'HERO_SECTION') {
            console.log(`    Hero translations available: hero_title=${translations['hero_title']}, hero_subtitle=${translations['hero_subtitle']}, hero_button=${translations['hero_button']}`);
          }
        }
        
        // Replace language placeholders in component content with enhanced error handling
        for (const key in translations) {
          if (translations[key]) {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            const originalContent = componentContent;
            componentContent = componentContent.replace(placeholder, translations[key]);
            
            // For critical components, verify replacement was successful
            if (isCriticalComponent && originalContent.includes(`{{${key}}}`) && componentContent.includes(`{{${key}}}`)) {
              console.warn(`    Warning: Failed to replace placeholder {{${key}}} in ${componentName} for ${lang}`);
            }
          }
        }
        
        // Double-check for any remaining placeholders in critical components
        if (isCriticalComponent) {
          const remainingPlaceholders = [];
          const placeholderRegex = /{{([^}]+)}}/g;
          let match;
          
          while ((match = placeholderRegex.exec(componentContent)) !== null) {
            remainingPlaceholders.push(match[1]);
          }
          
          if (remainingPlaceholders.length > 0) {
            console.warn(`    Warning: Component ${componentName} still has unreplaced placeholders: ${remainingPlaceholders.join(', ')}`);
            
            // Apply fallback translations for critical components
            for (const placeholder of remainingPlaceholders) {
              let fallbackValue = null;
              
              // Try to get fallback from default language
              if (lang !== defaultLanguage && translationData[defaultLanguage] && translationData[defaultLanguage][placeholder]) {
                fallbackValue = translationData[defaultLanguage][placeholder];
                console.warn(`    Applying fallback from ${defaultLanguage} for ${placeholder} in ${componentName}`);
              }
              // Try English as universal fallback
              else if (lang !== 'en' && translationData['en'] && translationData['en'][placeholder]) {
                fallbackValue = translationData['en'][placeholder];
                console.warn(`    Applying English fallback for ${placeholder} in ${componentName}`);
              }
              
              if (fallbackValue) {
                componentContent = componentContent.replace(
                  new RegExp(`{{${placeholder}}}`, 'g'),
                  `${fallbackValue}`
                );
              }
            }
          }
        }
      }
      
      // Replace the component reference with the processed component content
      processedContent = processedContent.replace(match[0], componentContent);
    }
  }
  
  return processedContent;
}

// Helper function to get component path based on component name
function getComponentPath(componentName) {
  const componentPaths = {
    // Head components
    'META_BASE': 'components/head/meta-base.html',
    'RESOURCE_HINTS': 'components/head/resource-hints.html',
    'CRITICAL_CSS': 'components/head/critical-css.html',
    'FAVICON_LINKS': 'components/head/favicons.html',
    'CSS_LINKS': 'components/head/css-links.html',
    
    // Script components
    'GTM_HEAD': 'components/scripts/gtm-head.html',
    'GTM_BODY': 'components/scripts/gtm-body.html',
    'META_PIXEL': 'components/scripts/meta-pixel.html',
    'BOOTSTRAP_JS': 'components/scripts/bootstrap-js.html',
    'CUSTOM_JS': 'components/scripts/custom-js.html',
    
    // Structural components
    'NAVBAR': 'components/structure/navbar.html',
    'BREADCRUMB': 'components/structure/breadcrumb.html',
    'HERO_SECTION': 'components/structure/hero-section.html',
    'FEATURES_SECTION': 'components/structure/features-section.html',
    'GALLERY_SECTION': 'components/structure/gallery-section.html',
    'FOOTER': 'components/structure/footer.html',
    
    // Structured data components
    'BUSINESS_SCHEMA': 'components/structured-data/business.json',
    'PRODUCT_SCHEMA': 'components/structured-data/product.json',
    'WEBPAGE_SCHEMA': 'components/structured-data/webpage.json',
    'FAQ_SCHEMA': 'components/structured-data/faq.json',
    'BREADCRUMB_SCHEMA': 'components/structured-data/breadcrumb.json',
    'REVIEW_SCHEMA': 'components/structured-data/review.json',
  };
  
  return componentPaths[componentName] || null;
}

// Function to inject critical CSS
async function injectCriticalCSS(templateContent) {
  try {
    // Check if this is an AMP template
    const isAmpTemplate = templateContent.includes('<html ⚡') || templateContent.includes('<style amp-custom>');
    
    if (isAmpTemplate) {
      // For AMP templates, don't inject additional CSS as it would violate AMP rules
      // AMP templates should have all their CSS in the <style amp-custom> section
      console.log('    Skipping critical CSS injection for AMP template (CSS should be in amp-custom section)');
      return templateContent;
    }
    
    const criticalCSS = await readFile(path.join(__dirname, '../css/styles.css'), 'utf8');
    
    // Find the position to inject the critical CSS (after the comment "/* Critical CSS will be injected here */")
    const cssCommentPos = templateContent.indexOf('/* Critical CSS will be injected here */');
    if (cssCommentPos !== -1) {
      return templateContent.replace('/* Critical CSS will be injected here */', criticalCSS);
    }
    
    // If no comment is found, try to find a style tag
    const stylePos = templateContent.indexOf('<style>');
    if (stylePos !== -1) {
      const insertPos = stylePos + '<style>'.length;
      return templateContent.slice(0, insertPos) + '\n' + criticalCSS + templateContent.slice(insertPos);
    }
    
    // If no <style> tag is found, add it before the closing </head> tag
    return templateContent.replace('</head>', `<style>\n${criticalCSS}\n</style>\n</head>`);
  } catch (error) {
    console.error('Error injecting critical CSS:', error.message);
    return templateContent; // Return original content if critical CSS can't be injected
  }
}

// Main function to process templates and generate language-specific pages
async function buildSite() {
  console.log('Starting site build process...');
  console.time('Build completed in');
  
  try {
    // Load translations for all languages
    console.log('Loading translation files...');
    const translationData = {};
    for (const lang of languages) {
      try {
        const translationFilePath = path.join(__dirname, 'translations', `${lang}.json`);
        console.log(`  Reading translation file: ${translationFilePath}`);
        const translationFile = await readFile(translationFilePath, 'utf8');
        
        try {
          translationData[lang] = JSON.parse(translationFile);
          console.log(`  Successfully loaded ${Object.keys(translationData[lang]).length} translations for ${lang}`);
        } catch (parseError) {
          console.error(`  Error parsing translation file for ${lang}:`, parseError.message);
          console.error(`  File path: ${translationFilePath}`);
          console.error(`  This language will be skipped.`);
          continue; // Skip this language
        }
      } catch (readError) {
        console.error(`  Error reading translation file for ${lang}:`, readError.message);
        console.error(`  This language will be skipped.`);
        continue; // Skip this language
      }
    }
    
    if (Object.keys(translationData).length === 0) {
      throw new Error('No translation files could be loaded. Build process cannot continue.');
    }
    
    // Verify critical translations are present for each language
    console.log('Verifying critical translations...');
    let loadErrors = false;
    for (const lang of languages) {
      if (!translationData[lang]) {
        console.error(`  No translations loaded for ${lang}, skipping verification.`);
        loadErrors = true;
        continue;
      }
      
      const criticalKeys = [
        'nav_home', 'nav_photos', 'nav_caravan', 'nav_pricing', 'nav_contact',
        'hero_title', 'hero_subtitle', 'hero_button',
        'hero_image_alt', 'gallery_alt_1', 'gallery_alt_2', 'gallery_alt_3',
        'gallery_alt_4', 'gallery_alt_5', 'gallery_alt_6', 'gallery_alt_7',
        'gallery_alt_8', 'gallery_alt_9'
      ];
      
      const missingKeys = criticalKeys.filter(key => !translationData[lang][key]);
      
      if (missingKeys.length > 0) {
        console.warn(`  Warning: Language ${lang} is missing critical translations: ${missingKeys.join(', ')}`);
        loadErrors = true;
        
        // Try to fill in missing translations from default language or English
        for (const key of missingKeys) {
          if (lang !== defaultLanguage && translationData[defaultLanguage] && translationData[defaultLanguage][key]) {
            translationData[lang][key] = translationData[defaultLanguage][key];
            console.log(`    Applied fallback from ${defaultLanguage} for ${key} in ${lang}`);
          } else if (lang !== 'en' && translationData['en'] && translationData['en'][key]) {
            translationData[lang][key] = translationData['en'][key];
            console.log(`    Applied fallback from en for ${key} in ${lang}`);
          }
        }
      } else {
        console.log(`  All critical translations present for ${lang}`);
      }
    }
    
    if (loadErrors) {
      console.warn('There were issues with translation files. The build will continue but some content may not be properly translated.');
    }
    
    // Process each template for each language
    for (const lang of languages) {
      console.log(`Processing language: ${lang}`);
      
      // Create language directory if it doesn't exist
      const langDir = path.join(__dirname, '../', lang);
      try {
        await mkdir(langDir, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
      
      // Process each template
      for (const template of templates) {
        console.log(`  Processing template: ${template.name}`);
        
        try {
          // Read template file
          const templatePath = path.join(__dirname, 'templates', template.name);
          console.log(`    Reading template file: ${templatePath}`);
          
          let templateContent;
          try {
            // Use only the original template file as requested
            templateContent = await readFile(templatePath, 'utf8');
            console.log(`    Using original template file: ${templatePath}`);
          } catch (readError) {
            console.error(`    Error reading template file ${template.name}:`, readError.message);
            console.error(`    Skipping this template.`);
            continue; // Skip this template
          }
          
          // Replace placeholders with translations
          let processedContent = templateContent;
          
          // Replace lang attribute and other language-specific attributes
          // Replace language attributes and placeholders to match the correct Estonian version
          processedContent = processedContent.replace(/lang="{{lang}}"/g, `lang="${lang}"`);
          processedContent = processedContent.replace(/\[lang\]/g, lang); // Fix for hardcoded [lang] in templates
          
          // Fix image paths
          processedContent = processedContent.replace(/src="..\/img\//g, `src="../img/`);
          
          // Fix CSS paths
          processedContent = processedContent.replace(/href="..\/css\//g, `href="../css/`);
          
            // Replace translation placeholders with enhanced handling
            const translations = translationData[lang];
            
            // Set the appropriate breadcrumb_current value based on the page
            if (template.name !== 'index.html') {
              let breadcrumbCurrent = '';
              if (template.name === 'rental-terms.html') {
                breadcrumbCurrent = translations['title_rental_terms'] || 'Rental Terms';
              } else if (template.name === 'privacy-policy.html') {
                breadcrumbCurrent = translations['title_privacy_policy'] || 'Privacy Policy';
              } else if (template.name === 'cookie-policy.html') {
                breadcrumbCurrent = translations['title_cookie_policy'] || 'Cookie Policy';
              }
              
              // Add breadcrumb_current to translations
              translations['breadcrumb_current'] = breadcrumbCurrent;
            }
          if (!translations) {
            console.error(`    No translations found for language ${lang}, skipping template ${template.name}`);
            continue;
          }
          
          const missingTranslations = [];
          const criticalMissingTranslations = [];
          
          // First, find all translation placeholders in the template
          const placeholderRegex = /{{([^}]+)}}/g;
          const placeholders = new Set();
          let match;
          
          while ((match = placeholderRegex.exec(processedContent)) !== null) {
            placeholders.add(match[1]);
          }
          
          // Replace known translations
          for (const key in translations) {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            processedContent = processedContent.replace(placeholder, translations[key]);
          }
          
          // Check for missing translations
          placeholders.forEach(placeholder => {
            if (!translations[placeholder] && processedContent.includes(`{{${placeholder}}}`)) {
              // Determine if this is a critical translation (e.g., navigation items, page titles)
              const isCritical = placeholder.startsWith('nav_') ||
                               placeholder.startsWith('title_') ||
                               placeholder === 'hero_title' ||
                               placeholder === 'meta_description';
              
              if (isCritical) {
                criticalMissingTranslations.push(placeholder);
              } else {
                missingTranslations.push(placeholder);
              }
              
              // Try multiple fallback strategies
              let fallbackValue = null;
              
              // Strategy 1: Check default language
              if (defaultLanguage !== lang && translationData[defaultLanguage][placeholder]) {
                fallbackValue = translationData[defaultLanguage][placeholder];
                console.warn(`  Warning: Missing translation for '${placeholder}' in ${lang}, using ${defaultLanguage} fallback`);
              }
              // Strategy 2: Check English as a universal fallback if not already checked
              else if (defaultLanguage !== 'en' && lang !== 'en' && translationData['en'] && translationData['en'][placeholder]) {
                fallbackValue = translationData['en'][placeholder];
                console.warn(`  Warning: Missing translation for '${placeholder}' in ${lang}, using English fallback`);
              }
              // Strategy 3: Try to generate a placeholder from the key itself
              else if (placeholder.includes('_')) {
                // Convert snake_case to Title Case Words
                fallbackValue = placeholder
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                console.warn(`  Warning: Missing translation for '${placeholder}' in ${lang}, using generated placeholder`);
              }
              
              // Apply the fallback or warning placeholder
              if (fallbackValue) {
                // Don't add warning markers for nav_photos and nav_caravan to avoid the "⚠️ Nav Specs ⚠️" issue
                const addWarningMarkers = isCritical &&
                                         placeholder !== 'nav_photos' &&
                                         placeholder !== 'nav_caravan';
                
                processedContent = processedContent.replace(
                  new RegExp(`{{${placeholder}}}`, 'g'),
                  addWarningMarkers ? `⚠️ ${fallbackValue} ⚠️` : fallbackValue
                );
              } else {
                console.warn(`  Warning: Missing translation for '${placeholder}' in ${lang}, no fallback available`);
                // Leave the placeholder as is or replace with a warning message
                processedContent = processedContent.replace(
                  new RegExp(`{{${placeholder}}}`, 'g'),
                  `[${placeholder}]`
                );
              }
            }
          });
          
          // Log summary of missing translations with more details
          if (missingTranslations.length > 0 || criticalMissingTranslations.length > 0) {
            console.warn(`  Translation summary for ${lang}/${template.name}:`);
            
            if (criticalMissingTranslations.length > 0) {
              console.warn(`    ⚠️ CRITICAL: Missing ${criticalMissingTranslations.length} critical translations: ${criticalMissingTranslations.join(', ')}`);
            }
            
            if (missingTranslations.length > 0) {
              console.warn(`    Missing ${missingTranslations.length} regular translations`);
              // Log the first 5 missing translations to avoid cluttering the console
              const samplesToShow = missingTranslations.slice(0, 5);
              console.warn(`    Examples: ${samplesToShow.join(', ')}${missingTranslations.length > 5 ? '...' : ''}`);
            }
            
            // Write missing translations to a log file for later review
            try {
              const logDir = path.join(__dirname, 'logs');
              await mkdir(logDir, { recursive: true });
              
              const logFile = path.join(logDir, `missing_translations_${lang}.txt`);
              const logContent = `
=== Missing translations for ${lang}/${template.name} ===
Date: ${new Date().toISOString()}

${criticalMissingTranslations.length > 0 ? '== CRITICAL ==\n' + criticalMissingTranslations.join('\n') + '\n\n' : ''}
${missingTranslations.length > 0 ? '== REGULAR ==\n' + missingTranslations.join('\n') : ''}
`;
              
              // Append to existing log file or create a new one
              fs.appendFileSync(logFile, logContent);
            } catch (logError) {
              console.error(`  Error writing translation log: ${logError.message}`);
            }
          }
          
          // Include components
          processedContent = await includeComponents(processedContent, lang, translations, template);
          
          // Inject critical CSS
          processedContent = await injectCriticalCSS(processedContent);
          
          // Add hreflang links - ensure they're properly inserted and not duplicated
          const hreflangLinks = generateHreflangLinks(template.outputName);
          
          // Check if hreflang links already exist in the template
          if (processedContent.includes('<link rel="alternate" href="https://tartuhaagissuvila.ee/') &&
              processedContent.includes('hreflang="')) {
            // Remove existing hreflang links to prevent duplication
            processedContent = processedContent.replace(/<link rel="alternate" href="https:\/\/tartuhaagissuvila\.ee\/[^"]*" hreflang="[^"]*">\s*/g, '');
          }
          
          // Insert the generated hreflang links
          processedContent = processedContent.replace('</head>', `${hreflangLinks}</head>`);
          
          // Add canonical link only if one doesn't already exist
          if (!processedContent.includes('<link rel="canonical"')) {
            const canonicalLink = generateCanonicalLink(lang, template.outputName);
            processedContent = processedContent.replace('</head>', `${canonicalLink}\n</head>`);
          }
          
          // Add meta tags
          const metaTags = generateMetaTags(lang, translations, template.outputName);
          processedContent = processedContent.replace('</head>', `${metaTags}\n</head>`);
          
          // Final cleanup - replace any remaining placeholders
          processedContent = processedContent.replace(/\[lang\]/g, lang);
          
          // Replace any remaining {{placeholders}} with empty strings to avoid showing them in the output
          processedContent = processedContent.replace(/\{\{[^}]+\}\}/g, '');
          
          // Write processed file to language directory
          await writeFile(path.join(langDir, template.outputName), processedContent, 'utf8');
        } catch (error) {
          console.error(`    Error processing template ${template.name} for ${lang}:`, error.message);
          console.error(`    Skipping this template for ${lang}.`);
        }
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
  
  try {
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

    await writeFile(path.join(__dirname, '../index.html'), rootIndexContent, 'utf8');
    console.log('  Root index.html generated successfully');
  } catch (error) {
    console.error('  Error generating root index.html:', error.message);
    throw error; // Re-throw to be caught by the main try-catch
  }
}

// Function to generate sitemaps with hreflang annotations
async function generateSitemap() {
  console.log('Generating sitemaps...');
  
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toISOString().replace('Z', '+03:00');
    
    // Generate language-specific sitemaps
    for (const lang of languages) {
      console.log(`  Generating sitemap for ${lang}...`);
      let langSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
      
      // Add entries for each page in this language
      for (const template of templates) {
        const pagePath = template.outputName;
        // Create clean URLs without .html extension
        const url = pagePath === 'index.html' ?
          `${baseUrl}/${lang}/` :
          `${baseUrl}/${lang}/${pagePath.replace('.html', '')}`;
        
        langSitemapContent += `  <url>\n`;
        langSitemapContent += `    <loc>${url}</loc>\n`;
        langSitemapContent += `    <lastmod>${today}</lastmod>\n`;
        langSitemapContent += `    <changefreq>${pagePath === 'index.html' ? 'weekly' : 'monthly'}</changefreq>\n`;
        langSitemapContent += `    <priority>${pagePath === 'index.html' ? '1.0' : '0.8'}</priority>\n`;
        
        // Add hreflang annotations for all languages
        for (const hrefLang of languages) {
          const hrefUrl = pagePath === 'index.html' ?
            `${baseUrl}/${hrefLang}/` :
            `${baseUrl}/${hrefLang}/${pagePath.replace('.html', '')}`;
          langSitemapContent += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${hrefUrl}" />\n`;
        }
        
        // Add x-default hreflang
        const defaultUrl = pagePath === 'index.html' ?
          `${baseUrl}/${defaultLanguage}/` :
          `${baseUrl}/${defaultLanguage}/${pagePath.replace('.html', '')}`;
        langSitemapContent += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />\n`;
        
        langSitemapContent += `  </url>\n`;
      }
      
      langSitemapContent += `</urlset>`;
      
      await writeFile(path.join(__dirname, `../sitemap-${lang}.xml`), langSitemapContent, 'utf8');
      console.log(`  sitemap-${lang}.xml generated successfully`);
    }
    
    // Generate AMP sitemap
    console.log('  Generating AMP sitemap...');
    let ampSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
`;
    
    // Add AMP pages for each language
    for (const lang of languages) {
      ampSitemapContent += `  <!-- ${lang === 'en' ? 'English' : lang === 'et' ? 'Estonian' : 'Russian'} AMP Homepage -->\n`;
      ampSitemapContent += `  <url>\n`;
      ampSitemapContent += `    <loc>${baseUrl}/${lang}/amp</loc>\n`;
      ampSitemapContent += `    <lastmod>${todayTime}</lastmod>\n`;
      ampSitemapContent += `    <changefreq>weekly</changefreq>\n`;
      ampSitemapContent += `    <priority>1.0</priority>\n`;
      
      // Add hreflang annotations
      for (const hrefLang of languages) {
        ampSitemapContent += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${baseUrl}/${hrefLang}/amp" />\n`;
      }
      
      ampSitemapContent += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/${defaultLanguage}/amp" />\n`;
      ampSitemapContent += `  </url>\n\n`;
    }
    
    ampSitemapContent += `</urlset>`;
    
    await writeFile(path.join(__dirname, '../sitemap-amp.xml'), ampSitemapContent, 'utf8');
    console.log('  sitemap-amp.xml generated successfully');
    
    // Generate images sitemap
    console.log('  Generating images sitemap...');
    // Define image translations directly in this function
    const getImageTranslationsForLang = (lang) => {
      return {
        // Main exterior view
        heroImageCaption: lang === 'et' ? 'Elddis Corona haagissuvila välivaade Tartus Eestis' :
                          lang === 'en' ? 'Elddis Corona caravan exterior view in Tartu Estonia' :
                          'Внешний вид каравана Elddis Corona в Тарту, Эстония',
        heroImageTitle: lang === 'et' ? "Elddis Corona Haagissuvila - Peapilt" :
                        lang === 'en' ? "Elddis Corona Caravan - Main View" :
                        "Элддис Корона Автодом - Главный Вид",
        
        // Gallery images
        gallery1Caption: lang === 'et' ? 'Elddis Corona haagissuvila välisvaade eest vasakult Tartu rendis' :
                        lang === 'en' ? 'Elddis Corona caravan exterior front left view in Tartu rental' :
                        'Внешний вид каравана Elddis Corona спереди слева в аренду в Тарту',
        gallery1Title: lang === 'et' ? "Elddis Corona Haagissuvila - Ees Vasakult" :
                      lang === 'en' ? "Elddis Corona Caravan - Front Left" :
                      "Элддис Корона Автодом - Спереди Слева",
        
        gallery2Caption: lang === 'et' ? 'Elddis Corona haagissuvila välisvaade tagant paremalt Tartus Eestis' :
                        lang === 'en' ? 'Elddis Corona caravan exterior back right view in Tartu Estonia' :
                        'Внешний вид каравана Elddis Corona сзади справа в Тарту, Эстония',
        gallery2Title: lang === 'et' ? "Elddis Corona Haagissuvila - Tagant Paremalt" :
                      lang === 'en' ? "Elddis Corona Caravan - Back Right" :
                      "Элддис Корона Автодом - Сзади Справа",
        
        gallery3Caption: lang === 'et' ? 'Elddis Corona haagissuvila väljalükatud varjualusega mugavuseks Tartus' :
                        lang === 'en' ? 'Elddis Corona caravan with extended awning for outdoor comfort in Tartu' :
                        'Караван Elddis Corona с выдвинутым навесом для комфортного отдыха на природе в Тарту',
        gallery3Title: lang === 'et' ? "Elddis Corona Haagissuvila - Varjualusega" :
                      lang === 'en' ? "Elddis Corona Caravan - With Awning" :
                      "Элддис Корона Автодом - С Навесом",
        
        gallery4Caption: lang === 'et' ? 'Elddis Corona haagissuvila sisustus mugava suletud voodi istumisalaga' :
                        lang === 'en' ? 'Elddis Corona caravan interior with comfortable closed bed seating area' :
                        'Интерьер каравана Elddis Corona с удобной закрытой кроватью и зоной отдыха',
        gallery4Title: lang === 'et' ? "Elddis Corona Haagissuvila - Sisustus Istumisala" :
                      lang === 'en' ? "Elddis Corona Caravan - Interior Seating Area" :
                      "Элддис Корона Автодом - Внутренняя Зона Отдыха",
        
        gallery5Caption: lang === 'et' ? 'Elddis Corona haagissuvila sisustus avatud voodiga magamiseks' :
                        lang === 'en' ? 'Elddis Corona caravan interior with bed open for sleeping arrangement' :
                        'Интерьер каравана Elddis Corona с открытой кроватью для сна',
        gallery5Title: lang === 'et' ? "Elddis Corona Haagissuvila - Sisustus Voodi Avatud" :
                      lang === 'en' ? "Elddis Corona Caravan - Interior Bed Open" :
                      "Элддис Корона Автодом - Внутренняя Кровать Открыта",
        
        gallery6Caption: lang === 'et' ? 'Täielikult varustatud köök Elddis Corona haagissuvilas pliidi ja kraanikausi' :
                        lang === 'en' ? 'Fully equipped kitchen in Elddis Corona caravan rental with stove and sink' :
                        'Полностью оборудованная кухня в каравана Elddis Corona с плитой и раковиной',
        gallery6Title: lang === 'et' ? "Elddis Corona Haagissuvila - Köök" :
                      lang === 'en' ? "Elddis Corona Caravan - Kitchen" :
                      "Элддис Корона Автодом - Кухня",
        
        gallery7Caption: lang === 'et' ? 'Elddis Corona haagissuvila sisustus istumisala mis muutub magamisruumiks' :
                        lang === 'en' ? 'Elddis Corona caravan interior seating area that converts to sleeping space' :
                        'Интерьер каравана Elddis Corona с зоной отдыха, которая трансформируется в спальное место',
        gallery7Title: lang === 'et' ? "Elddis Corona Haagissuvila - Vasak Istumisala" :
                      lang === 'en' ? "Elddis Corona Caravan - Left Seating Area" :
                      "Элддис Корона Автодом - Левая Зона Отдыха",
        
        gallery8Caption: lang === 'et' ? 'Elddis Corona haagissuvila sisustus väljalükatud voodiga mugavaks magamiseks' :
                        lang === 'en' ? 'Elddis Corona caravan interior with bed extended for comfortable sleeping' :
                        'Интерьер каравана Elddis Corona с разложенной кроватью для комфортного сна',
        gallery8Title: lang === 'et' ? "Elddis Corona Haagissuvila - Vasak Voodi Väljas" :
                      lang === 'en' ? "Elddis Corona Caravan - Left Bed Extended" :
                      "Элддис Корона Автодом - Левая Кровать Выдвинута",
        
        gallery9Caption: lang === 'et' ? 'Puhas ja funktsionaalne vannituba Elddis Corona haagissuvilas Tartus' :
                        lang === 'en' ? 'Clean and functional bathroom in Elddis Corona caravan rental in Tartu' :
                        'Чистая и функциональная ванная комната в каравана Elddis Corona в аренду в Тарту',
        gallery9Title: lang === 'et' ? "Elddis Corona Haagissuvila - Vannituba" :
                      lang === 'en' ? "Elddis Corona Caravan - Bathroom" :
                      "Элддис Корона Автодом - Ванная Комната"
      };
    };
    
    // Get image translations for the default language (for sitemap)
    const imageTranslations = getImageTranslationsForLang(defaultLanguage);
    
    // Define image formats and base names
    const imageFormats = ['webp', 'avif', 'jpg'];
    const imageBaseNames = [
      { base: 'out_front_right_1200w', caption: 'heroImageCaption', title: 'heroImageTitle' },
      { base: 'out_front_left_1200w', caption: 'gallery1Caption', title: 'gallery1Title' },
      { base: 'out_back_right_1200w', caption: 'gallery2Caption', title: 'gallery2Title' },
      { base: 'out_front_right_awning_1200w', caption: 'gallery3Caption', title: 'gallery3Title' },
      { base: 'in_right_closedbed_1200w', caption: 'gallery4Caption', title: 'gallery4Title' },
      { base: 'in_right_openbed_1200w', caption: 'gallery5Caption', title: 'gallery5Title' },
      { base: 'in_kitchen_1200w', caption: 'gallery6Caption', title: 'gallery6Title' },
      { base: 'in_left_closedbed_1200w', caption: 'gallery7Caption', title: 'gallery7Title' },
      { base: 'in_left_openbed_1200w', caption: 'gallery8Caption', title: 'gallery8Title' },
      { base: 'in_bathroom_1200w', caption: 'gallery9Caption', title: 'gallery9Title' }
    ];
    
    let imagesSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/${defaultLanguage}/</loc>`;
    
    // Add all image formats for each base image
    for (const imageBase of imageBaseNames) {
      for (const format of imageFormats) {
        imagesSitemapContent += `
    <image:image>
      <image:loc>${baseUrl}/img/gallery/${imageBase.base}.${format}</image:loc>
      <image:caption>${imageTranslations[imageBase.caption]}</image:caption>
      <image:title>${imageTranslations[imageBase.title]}</image:title>
    </image:image>`;
      }
    }
    
    imagesSitemapContent += `
  </url>
</urlset>`;
    
    await writeFile(path.join(__dirname, '../sitemap-images.xml'), imagesSitemapContent, 'utf8');
    console.log('  sitemap-images.xml generated successfully');
    
    // Generate sitemap index
    console.log('  Generating sitemap index...');
    let sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-en.xml</loc>
    <lastmod>${todayTime}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-et.xml</loc>
    <lastmod>${todayTime}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-ru.xml</loc>
    <lastmod>${todayTime}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${todayTime}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-amp.xml</loc>
    <lastmod>${todayTime}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    await writeFile(path.join(__dirname, '../sitemap-index.xml'), sitemapIndexContent, 'utf8');
    console.log('  sitemap-index.xml generated successfully');
    
    // Main sitemap.xml generation removed as it's redundant with sitemap-index.xml approach
    
    console.log('All sitemaps generated successfully');
  } catch (error) {
    console.error('  Error generating sitemaps:', error.message);
    throw error; // Re-throw to be caught by the main try-catch
  }
}

// Function to generate robots.txt
async function generateRobotsTxt() {
  console.log('Generating robots.txt...');
  
  try {
    const robotsTxtContent = `User-agent: *
Allow: /
Allow: /en/
Allow: /et/
Allow: /ru/

Sitemap: ${baseUrl}/sitemap-index.xml
`;
  
    await writeFile(path.join(__dirname, '../robots.txt'), robotsTxtContent, 'utf8');
    console.log('  Robots.txt generated successfully');
  } catch (error) {
    console.error('  Error generating robots.txt:', error.message);
    throw error; // Re-throw to be caught by the main try-catch
  }
}

// Run the build process
async function main() {
  try {
    console.log('=== Caravan Rental Website Build Process ===');
    console.log(`Started at: ${new Date().toLocaleString()}`);
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Languages: ${languages.join(', ')} (default: ${defaultLanguage})`);
    console.log(`Templates: ${templates.map(t => t.name).join(', ')}`);
    console.log('==========================================');
    
    console.time('Build completed in');
    await buildSite();
    
    console.log('==========================================');
    console.timeEnd('Build completed in');
    console.log(`Build completed at: ${new Date().toLocaleString()}`);
    console.log('Build successful! 🎉');
  } catch (error) {
    console.error('==========================================');
    console.error('BUILD FAILED! ❌');
    console.error(`Error: ${error.message}`);
    console.error('==========================================');
    process.exit(1); // Exit with error code
  }
}

// Start the build process
main().catch(error => {
  console.error('Unhandled error in main process:', error);
  process.exit(1);
});
