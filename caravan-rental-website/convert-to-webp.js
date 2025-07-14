/**
 * Image Conversion Script for WebP Format
 * 
 * This script helps convert JPG/PNG images to WebP format for better compression
 * and performance. It requires Node.js and the sharp library.
 * 
 * Installation:
 * 1. Make sure Node.js is installed (https://nodejs.org/)
 * 2. Run: npm install sharp
 * 3. Place this script in your project root
 * 4. Run: node convert-to-webp.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const sourceDir = 'img/gallery';
const quality = 80; // WebP quality (0-100)

// Function to recursively get all files in a directory
function getAllFiles(dir) {
  const files = [];
  
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(filePath));
    } else {
      files.push(filePath);
    }
  });
  
  return files;
}

// Function to convert an image to WebP
async function convertToWebP(filePath) {
  // Only process JPG and PNG files
  if (!/\.(jpe?g|png)$/i.test(filePath)) {
    return;
  }
  
  const outputPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
  
  try {
    await sharp(filePath)
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`Converted: ${filePath} -> ${outputPath}`);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);
    
    console.log(`Size reduction: ${savings}% (${(originalSize/1024).toFixed(2)}KB -> ${(webpSize/1024).toFixed(2)}KB)`);
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error);
  }
}

// Main function
async function main() {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(sourceDir)) {
      console.error(`Source directory ${sourceDir} does not exist!`);
      return;
    }
    
    // Get all image files
    const files = getAllFiles(sourceDir).filter(file => /\.(jpe?g|png)$/i.test(file));
    
    if (files.length === 0) {
      console.log('No JPG or PNG files found to convert.');
      return;
    }
    
    console.log(`Found ${files.length} images to convert to WebP...`);
    
    // Convert all images
    for (const file of files) {
      await convertToWebP(file);
    }
    
    console.log('Conversion complete!');
    console.log('Next steps:');
    console.log('1. Update your HTML to use the WebP images with fallbacks for older browsers');
    console.log('2. Example:');
    console.log(`
    <picture>
      <source srcset="image.webp" type="image/webp">
      <img src="image.jpg" alt="Description">
    </picture>
    `);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();