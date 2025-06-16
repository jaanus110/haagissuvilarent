// Simple HTML validation script

const fs = require('fs');
const path = require('path');

// List of HTML files to validate
const htmlFiles = [
    'index.html',
    'rental-terms.html',
    'privacy-policy.html',
    'cookie-policy.html'
];

// Common HTML validation checks
function validateHTML(content, filename) {
    const issues = [];
    
    // Check for missing alt attributes on images
    const imgRegex = /<img(?![^>]*alt=)[^>]*>/g;
    const imgMatches = content.match(imgRegex);
    if (imgMatches) {
        imgMatches.forEach(match => {
            issues.push(`Missing alt attribute on image: ${match}`);
        });
    }
    
    // Check for missing lang attribute on html tag
    if (!content.match(/<html[^>]*lang=/)) {
        issues.push('Missing lang attribute on html tag');
    }
    
    // Check for missing viewport meta tag
    if (!content.match(/<meta[^>]*name=["']viewport["'][^>]*>/)) {
        issues.push('Missing viewport meta tag');
    }
    
    // Check for missing title tag
    if (!content.match(/<title[^>]*>/)) {
        issues.push('Missing title tag');
    }
    
    // Check for empty links
    const emptyLinkRegex = /<a[^>]*href=["']?(?:#|javascript:void\(0\)|["'])[^>]*>/g;
    const emptyLinkMatches = content.match(emptyLinkRegex);
    if (emptyLinkMatches) {
        emptyLinkMatches.forEach(match => {
            // Exclude language selector links which use # intentionally
            if (!match.includes('data-lang=')) {
                issues.push(`Empty or javascript link: ${match}`);
            }
        });
    }
    
    // Check for deprecated HTML tags
    const deprecatedTags = ['center', 'font', 'marquee', 'blink', 'u'];
    deprecatedTags.forEach(tag => {
        const regex = new RegExp(`<${tag}[^>]*>`, 'g');
        const matches = content.match(regex);
        if (matches) {
            matches.forEach(match => {
                issues.push(`Deprecated HTML tag: ${match}`);
            });
        }
    });
    
    // Check for missing closing tags (simplified check)
    const openTags = content.match(/<([a-z][a-z0-9]*)[^>]*>/gi) || [];
    const closeTags = content.match(/<\/([a-z][a-z0-9]*)>/gi) || [];
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
    
    const openTagCounts = {};
    const closeTagCounts = {};
    
    openTags.forEach(tag => {
        const tagName = tag.match(/<([a-z][a-z0-9]*)/i)[1].toLowerCase();
        if (!selfClosingTags.includes(tagName)) {
            openTagCounts[tagName] = (openTagCounts[tagName] || 0) + 1;
        }
    });
    
    closeTags.forEach(tag => {
        const tagName = tag.match(/<\/([a-z][a-z0-9]*)/i)[1].toLowerCase();
        closeTagCounts[tagName] = (closeTagCounts[tagName] || 0) + 1;
    });
    
    Object.keys(openTagCounts).forEach(tag => {
        if (openTagCounts[tag] !== (closeTagCounts[tag] || 0)) {
            issues.push(`Mismatched tag count for <${tag}>: ${openTagCounts[tag]} opening tags, ${closeTagCounts[tag] || 0} closing tags`);
        }
    });
    
    // Check for accessibility issues (basic checks)
    
    // Check for missing form labels
    const inputRegex = /<input[^>]*>/g;
    const inputMatches = content.match(inputRegex) || [];
    inputMatches.forEach(match => {
        const idMatch = match.match(/id=["']([^"']*)["']/);
        if (idMatch) {
            const id = idMatch[1];
            const labelRegex = new RegExp(`<label[^>]*for=["']${id}["'][^>]*>`, 'g');
            if (!content.match(labelRegex)) {
                issues.push(`Input with id "${id}" has no associated label`);
            }
        } else if (!match.match(/type=["']hidden["']/)) {
            issues.push(`Input has no id attribute for label association: ${match}`);
        }
    });
    
    // Check for ARIA roles on interactive elements
    const interactiveElements = content.match(/<(button|a)[^>]*>/g) || [];
    interactiveElements.forEach(element => {
        if (!element.match(/role=["'][^"']*["']/)) {
            issues.push(`Interactive element missing ARIA role: ${element}`);
        }
    });
    
    return issues;
}

// Main validation function
function validateFiles() {
    let totalIssues = 0;
    
    htmlFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const issues = validateHTML(content, file);
            
            if (issues.length > 0) {
                console.log(`\n\x1b[1m${file}\x1b[0m - ${issues.length} issues found:`);
                issues.forEach((issue, index) => {
                    console.log(`  ${index + 1}. ${issue}`);
                });
                totalIssues += issues.length;
            } else {
                console.log(`\x1b[32m✓ ${file} - No issues found\x1b[0m`);
            }
        } catch (error) {
            console.error(`\x1b[31mError reading file ${file}: ${error.message}\x1b[0m`);
        }
    });
    
    if (totalIssues > 0) {
        console.log(`\n\x1b[33mTotal issues found: ${totalIssues}\x1b[0m`);
    } else {
        console.log(`\n\x1b[32mAll files validated successfully with no issues!\x1b[0m`);
    }
}

// Run validation
console.log('\x1b[1mRunning HTML validation...\x1b[0m');
validateFiles();