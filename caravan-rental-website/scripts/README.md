# AVIF Image Conversion Script

This script converts existing WebP and JPEG images to the AVIF format for better compression and performance. AVIF offers significantly better compression than WebP and JPEG while maintaining high image quality.

## Prerequisites

- Node.js 14 or higher
- npm (Node Package Manager)

## Installation

1. Navigate to the scripts directory:
   ```
   cd scripts
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

Run the script to convert all images in the specified directories to AVIF format:

### Using npm

```
npm run generate
```

### Using the batch file (Windows)

In Command Prompt:
```
generate-avif.bat
```

In PowerShell:
```
.\generate-avif.bat
```

### Using the shell script (Unix/Linux/Mac)

Make the script executable first:
```
chmod +x generate-avif.sh
```

Then run it:
```
./generate-avif.sh
```

### Configuration

You can modify the following settings in the `generate-avif.js` file:

- `QUALITY`: AVIF quality (0-100), default is 70
- `SOURCE_PATTERNS`: Array of glob patterns to match source images
- `EXCLUDE_PATTERNS`: Array of glob patterns to exclude from conversion

**Note**: The script is configured to look for images in the `../img/gallery/` directory relative to the scripts directory. If your images are in a different location, you'll need to update the `SOURCE_PATTERNS` in the script.

## How It Works

The script:

1. Finds all WebP and JPEG images in the specified directories
2. Converts each image to AVIF format with the configured quality
3. Skips conversion if an AVIF file already exists and is newer than the source
4. Processes images in batches to avoid memory issues

## Performance Benefits

AVIF offers several advantages over other image formats:

- 50% smaller file size compared to JPEG at similar quality
- 20% smaller file size compared to WebP at similar quality
- Better preservation of details at lower file sizes
- Support for HDR and wide color gamut
- Alpha transparency support

## Browser Support

As of 2025, AVIF is supported in:
- Chrome (since version 85)
- Firefox (since version 93)
- Safari (since version 16)
- Edge (since version 85)

The website implementation includes proper fallbacks to WebP and JPEG for browsers that don't support AVIF.