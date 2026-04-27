/**
 * Script to generate AVIF images from existing WebP and JPEG files
 * This script requires the following packages:
 * - sharp: for image processing
 * - glob: for file pattern matching
 * 
 * Install dependencies:
 * npm install sharp glob
 */

const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

// Configuration
const QUALITY = 70; // AVIF quality (0-100)
const SOURCE_PATTERNS = [
  '../img/gallery/**/*.webp',
  '../img/gallery/**/*.jpg'
];
const EXCLUDE_PATTERNS = [
  '**/*_avif_*.*', // Avoid processing any temporary files
  '**/favicon/**/*' // Skip favicon directory
];

// Function to convert a file to AVIF
async function convertToAvif(filePath) {
  try {
    // Skip if this is already an AVIF file
    if (filePath.toLowerCase().endsWith('.avif')) {
      return;
    }
    
    // Generate output path by replacing extension with .avif
    const outputPath = filePath.replace(/\.(webp|jpg|jpeg)$/i, '.avif');
    
    // Skip if AVIF file already exists and is newer than source
    if (fs.existsSync(outputPath)) {
      const sourceStats = fs.statSync(filePath);
      const destStats = fs.statSync(outputPath);
      if (destStats.mtime > sourceStats.mtime) {
        console.log(`Skipping ${filePath} (AVIF already exists and is newer)`);
        return;
      }
    }
    
    console.log(`Converting ${filePath} to AVIF...`);
    
    // Process the image with sharp
    await sharp(filePath)
      .avif({
        quality: QUALITY,
        effort: 7 // Higher effort = better compression but slower (0-9)
      })
      .toFile(outputPath);
    
    console.log(`Created ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${filePath} to AVIF:`, error);
  }
}

// Main function
async function main() {
  // Get all files matching the source patterns
  let files = [];
  
  for (const pattern of SOURCE_PATTERNS) {
    const matches = glob.sync(pattern);
    files = files.concat(matches);
  }
  
  // Filter out excluded files
  for (const excludePattern of EXCLUDE_PATTERNS) {
    const excludeMatches = glob.sync(excludePattern);
    files = files.filter(file => !excludeMatches.includes(file));
  }
  
  // Remove duplicates (in case a file matches multiple patterns)
  files = [...new Set(files)];
  
  console.log(`Found ${files.length} files to convert to AVIF`);
  
  // Process files in batches to avoid memory issues
  const BATCH_SIZE = 5;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(convertToAvif));
  }
  
  console.log('AVIF conversion complete!');
}

// Run the main function
main().catch(error => {
  console.error('Error in main process:', error);
  process.exit(1);
});