# WebP Implementation Guide

This guide provides instructions for implementing WebP images on your website to improve performance. WebP images offer significantly better compression than JPEG and PNG while maintaining similar quality.

## Why WebP Matters

According to the PageSpeed Insights report, your website could save approximately 665 KiB by using modern image formats like WebP. This would significantly improve load times, especially on mobile devices.

## Implementation Steps

### Step 1: Convert Images to WebP

Use the provided `convert-to-webp.js` script to convert your existing JPG/PNG images to WebP format:

1. Install Node.js if you don't have it already (https://nodejs.org/)
2. Install the Sharp library: `npm install sharp`
3. Run the script: `node convert-to-webp.js`

This will create WebP versions of all your images while preserving the originals.

### Step 2: Update HTML to Use WebP with Fallbacks

Replace your current `<img>` tags with `<picture>` elements to provide WebP with fallbacks for browsers that don't support WebP:

#### Before:
```html
<img src="image.jpg" alt="Description">
```

#### After:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

### Step 3: Update Responsive Images

For responsive images with multiple sizes, use the following pattern:

```html
<picture>
  <source 
    srcset="image-400w.webp 400w, image-800w.webp 800w" 
    sizes="(max-width: 576px) 400px, 800px"
    type="image/webp">
  <img 
    srcset="image-400w.jpg 400w, image-800w.jpg 800w" 
    sizes="(max-width: 576px) 400px, 800px"
    src="image-800w.jpg" 
    width="382" height="287"
    loading="lazy"
    class="img-fluid rounded shadow-sm gallery-image"
    alt="Image description">
</picture>
```

### Step 4: Example Implementation for Your Gallery

Here's an example of how to update one of your gallery items:

```html
<div class="col-md-4 mb-3 gallery-item">
  <a href="../img/gallery/out_front_left_1200w.jpg" data-bs-toggle="modal" data-bs-target="#imageModal" data-bs-image="../img/gallery/out_front_left_1200w.jpg">
    <picture>
      <source 
        srcset="../img/gallery/out_front_left_400w.webp 400w,
                ../img/gallery/out_front_left_800w.webp 800w"
        sizes="(max-width: 576px) 400px, 800px"
        type="image/webp">
      <img 
        srcset="../img/gallery/out_front_left_400w.jpg 400w,
                ../img/gallery/out_front_left_800w.jpg 800w"
        sizes="(max-width: 576px) 400px, 800px"
        src="../img/gallery/out_front_left_800w.jpg"
        width="382" height="287"
        loading="lazy"
        class="img-fluid rounded shadow-sm gallery-image"
        alt="Elddis Corona haagissuvila rent Tartus - välivaade eest vasakult">
    </picture>
  </a>
</div>
```

### Step 5: Update CSS Background Images

For CSS background images, use the following approach:

```css
.element {
  background-image: url('image.webp');
}

/* Fallback for browsers that don't support WebP */
.no-webp .element {
  background-image: url('image.jpg');
}
```

Add this JavaScript to detect WebP support:

```javascript
// WebP feature detection
function checkWebpSupport() {
  var img = new Image();
  img.onload = function() {
    var result = (img.width > 0) && (img.height > 0);
    if (result) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  };
  img.onerror = function() {
    document.documentElement.classList.add('no-webp');
  };
  img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
}

// Run the detection when the page loads
window.addEventListener('load', checkWebpSupport);
```

## Testing WebP Implementation

After implementing WebP images, verify they're working correctly:

1. Use Chrome DevTools Network tab to check that WebP images are being loaded
2. Test in different browsers to ensure fallbacks work correctly
3. Run PageSpeed Insights again to confirm the improvement

## Additional Recommendations

- Keep original JPG/PNG files as fallbacks for browsers that don't support WebP
- Consider using a CDN that can automatically serve WebP to supported browsers
- Update your image editing workflow to generate WebP versions for new images
- Consider using the `<picture>` element for all images, not just gallery images
- For hero/banner images, use WebP with appropriate fallbacks

By implementing WebP images with proper fallbacks, you'll significantly improve your website's performance while maintaining compatibility with all browsers.