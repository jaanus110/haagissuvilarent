// Performance optimization script

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
    // HTML files to analyze
    htmlFiles: [
        'index.html',
        'rental-terms.html',
        'privacy-policy.html',
        'cookie-policy.html'
    ],
    // CSS files to analyze
    cssFiles: [
        'css/styles.css'
    ],
    // JS files to analyze
    jsFiles: [
        'js/main.js',
        'js/language-detector.js'
    ],
    // Image directories to analyze
    imageDirectories: [
        'img/gallery',
        'img/ui'
    ]
};

// Performance analysis functions
function analyzeHTML(content, filename) {
    console.log(`\n\x1b[1mAnalyzing HTML file: ${filename}\x1b[0m`);
    
    // Check for render-blocking resources
    const renderBlockingCSS = content.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/g) || [];
    const renderBlockingJS = content.match(/<script[^>]*src=[^>]*>[^<]*<\/script>/g) || [];
    
    console.log(`- Found ${renderBlockingCSS.length} CSS files that could block rendering`);
    console.log(`- Found ${renderBlockingJS.length} JavaScript files that could block rendering`);
    
    // Suggest improvements
    if (renderBlockingCSS.length > 0) {
        console.log('  \x1b[33mSuggestion: Consider adding media="print" or loading="lazy" for non-critical CSS\x1b[0m');
    }
    
    if (renderBlockingJS.length > 0) {
        console.log('  \x1b[33mSuggestion: Consider adding async or defer attributes to script tags\x1b[0m');
    }
    
    // Check for unoptimized images
    const images = content.match(/<img[^>]*src=[^>]*>/g) || [];
    const responsiveImages = content.match(/<img[^>]*srcset=[^>]*>/g) || [];
    
    console.log(`- Found ${images.length} images, ${responsiveImages.length} with srcset (responsive)`);
    
    if (images.length > responsiveImages.length) {
        console.log('  \x1b[33mSuggestion: Add srcset and sizes attributes to all images for better responsiveness\x1b[0m');
    }
    
    // Check for lazy loading
    const lazyLoadedImages = content.match(/<img[^>]*loading=["']lazy["'][^>]*>/g) || [];
    
    console.log(`- Found ${lazyLoadedImages.length} images with lazy loading`);
    
    if (lazyLoadedImages.length < images.length) {
        console.log('  \x1b[33mSuggestion: Add loading="lazy" attribute to all non-critical images\x1b[0m');
    }
    
    // Check for proper heading structure
    const h1Tags = content.match(/<h1[^>]*>/g) || [];
    
    console.log(`- Found ${h1Tags.length} h1 tags`);
    
    if (h1Tags.length !== 1) {
        console.log('  \x1b[33mSuggestion: Each page should have exactly one h1 tag for proper SEO\x1b[0m');
    }
}

function analyzeCSS(content, filename) {
    console.log(`\n\x1b[1mAnalyzing CSS file: ${filename}\x1b[0m`);
    
    // Check for unused selectors (simplified approach)
    const selectors = content.match(/[.#][a-zA-Z0-9_-]+\s*\{/g) || [];
    
    console.log(`- Found ${selectors.length} CSS selectors`);
    
    // Check for media queries (responsive design)
    const mediaQueries = content.match(/@media[^{]+\{/g) || [];
    
    console.log(`- Found ${mediaQueries.length} media queries`);
    
    if (mediaQueries.length < 3) {
        console.log('  \x1b[33mSuggestion: Consider adding more media queries for better responsiveness\x1b[0m');
    }
    
    // Check for vendor prefixes
    const vendorPrefixes = content.match(/-(webkit|moz|ms|o)-/g) || [];
    
    console.log(`- Found ${vendorPrefixes.length} vendor prefixes`);
    
    // Check for potential performance issues
    if (content.includes('!important')) {
        console.log('  \x1b[33mWarning: Using !important can lead to specificity issues and maintenance problems\x1b[0m');
    }
    
    if (content.includes('*')) {
        console.log('  \x1b[33mWarning: Universal selector (*) can impact performance\x1b[0m');
    }
}

function analyzeJS(content, filename) {
    console.log(`\n\x1b[1mAnalyzing JavaScript file: ${filename}\x1b[0m`);
    
    // Check for console.log statements
    const consoleLogs = content.match(/console\.log\(/g) || [];
    
    console.log(`- Found ${consoleLogs.length} console.log statements`);
    
    if (consoleLogs.length > 0) {
        console.log('  \x1b[33mSuggestion: Remove console.log statements in production code\x1b[0m');
    }
    
    // Check for event listeners without removal
    const eventListeners = content.match(/addEventListener\(/g) || [];
    const eventListenerRemovals = content.match(/removeEventListener\(/g) || [];
    
    console.log(`- Found ${eventListeners.length} event listeners, ${eventListenerRemovals.length} removals`);
    
    if (eventListeners.length > eventListenerRemovals.length) {
        console.log('  \x1b[33mSuggestion: Consider removing event listeners when they are no longer needed\x1b[0m');
    }
    
    // Check for potential memory leaks
    if (content.includes('new Image()')) {
        console.log('  \x1b[33mWarning: Creating Image objects without proper cleanup can cause memory leaks\x1b[0m');
    }
}

function analyzeImages() {
    console.log('\n\x1b[1mAnalyzing images\x1b[0m');
    
    config.imageDirectories.forEach(directory => {
        const dirPath = path.join(__dirname, directory);
        
        try {
            if (!fs.existsSync(dirPath)) {
                console.log(`\x1b[33mDirectory not found: ${directory}\x1b[0m`);
                return;
            }
            
            const files = fs.readdirSync(dirPath);
            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
            });
            
            console.log(`\n- Found ${imageFiles.length} images in ${directory}`);
            
            // Analyze image sizes
            let totalSize = 0;
            let largeImages = 0;
            
            imageFiles.forEach(file => {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                const fileSizeKB = stats.size / 1024;
                totalSize += fileSizeKB;
                
                if (fileSizeKB > 200) {
                    largeImages++;
                    console.log(`  \x1b[33m${file}: ${fileSizeKB.toFixed(2)} KB (consider optimizing)\x1b[0m`);
                }
            });
            
            console.log(`- Total size: ${(totalSize / 1024).toFixed(2)} MB`);
            console.log(`- Large images (>200KB): ${largeImages}`);
            
            if (largeImages > 0) {
                console.log('  \x1b[33mSuggestion: Optimize large images to improve page load time\x1b[0m');
                console.log('  Tools like ImageOptim, TinyPNG, or Sharp can help reduce image sizes');
            }
            
            // Check for WebP format
            const webpImages = imageFiles.filter(file => path.extname(file).toLowerCase() === '.webp');
            
            console.log(`- WebP images: ${webpImages.length} of ${imageFiles.length}`);
            
            if (webpImages.length < imageFiles.length) {
                console.log('  \x1b[33mSuggestion: Convert images to WebP format for better compression\x1b[0m');
            }
            
        } catch (error) {
            console.error(`\x1b[31mError analyzing directory ${directory}: ${error.message}\x1b[0m`);
        }
    });
}

// Main function to run all analyses
function runPerformanceAnalysis() {
    console.log('\x1b[1mRunning performance analysis...\x1b[0m');
    
    // Analyze HTML files
    config.htmlFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            analyzeHTML(content, file);
        } catch (error) {
            console.error(`\x1b[31mError reading file ${file}: ${error.message}\x1b[0m`);
        }
    });
    
    // Analyze CSS files
    config.cssFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            analyzeCSS(content, file);
        } catch (error) {
            console.error(`\x1b[31mError reading file ${file}: ${error.message}\x1b[0m`);
        }
    });
    
    // Analyze JS files
    config.jsFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            analyzeJS(content, file);
        } catch (error) {
            console.error(`\x1b[31mError reading file ${file}: ${error.message}\x1b[0m`);
        }
    });
    
    // Analyze images
    analyzeImages();
    
    console.log('\n\x1b[1mPerformance analysis complete!\x1b[0m');
    console.log('\nTo run the local server and test the website, use:');
    console.log('\x1b[32m  node server.js\x1b[0m');
}

// Run the analysis
runPerformanceAnalysis();