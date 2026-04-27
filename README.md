# Caravan Rental Website

A multilingual website for renting an Elddis Corona caravan in Tartu, Estonia.

## Features

- Responsive design for mobile, tablet, and desktop
- Multilingual support (English, Estonian, Russian)
- Image gallery with responsive images
- Detailed specifications and pricing information
- Interactive map integration
- Legal documents (Rental Terms, Privacy Policy, Cookie Policy)

## Getting Started

### Prerequisites

- Node.js (v12 or higher)

### Running the Website Locally

1. Clone the repository or download the files
2. Navigate to the project directory
3. Start the local server:

```bash
node server.js
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

## Testing and Validation

The project includes several testing and validation tools:

### HTML Validation

Run the HTML validator to check for common issues:

```bash
node validate.js
```

This will check all HTML files for:
- Missing alt attributes on images
- Missing language attributes
- Proper heading structure
- Accessibility issues
- And more

### Performance Optimization

Run the performance analyzer to identify potential improvements:

```bash
node optimize.js
```

This will analyze:
- Image sizes and formats
- CSS efficiency
- JavaScript performance
- Render-blocking resources
- And provide suggestions for improvement

## Browser Compatibility

The website has been tested and is compatible with:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)

## Responsive Design

The website is designed to be responsive across different screen sizes:
- Mobile phones (< 576px)
- Tablets (576px - 992px)
- Desktops (> 992px)

## Accessibility

The website follows accessibility best practices:
- Semantic HTML
- Proper heading structure
- Alt text for images
- Keyboard navigation support
- ARIA attributes where appropriate

## Performance Optimization

Several performance optimizations have been implemented:
- Responsive images with srcset
- Lazy loading of images
- Minified CSS and JavaScript
- Efficient event handling
- Local server for CORS issue resolution

## Multilingual Support

The website supports three languages:
- English (default)
- Estonian
- Russian

Language detection is based on:
1. User selection (stored in localStorage)
2. Browser language
3. Default fallback to English

## Directory Structure

```
caravan-rental-website/
├── css/
│   ├── bootstrap.min.css
│   └── styles.css
├── img/
│   ├── gallery/
│   │   └── [image files]
│   └── ui/
│       └── [UI elements]
├── js/
│   ├── language-detector.js
│   └── main.js
├── locales/
│   ├── en.json
│   ├── et.json
│   └── ru.json
├── index.html
├── rental-terms.html
├── privacy-policy.html
├── cookie-policy.html
├── server.js
├── validate.js
├── optimize.js
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the responsive framework
- Google Maps for the embedded map