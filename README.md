# Livestock Weight Calculator PWA

A Progressive Web App for farmers to calculate livestock weight using heart girth and length measurements in the field. Works offline and can be installed on mobile devices.

## Features

- ✅ **Offline Functionality**: Works without internet connection
- ✅ **Mobile-First Design**: Optimized for smartphones and tablets
- ✅ **Installable**: Can be installed as a native app on Android/iOS
- ✅ **Local Storage**: Saves measurement history on device
- ✅ **Animal Types**: Supports Pig, Cattle, Sheep, and Goat
- ✅ **Dark Mode**: Automatically adapts to device theme
- ✅ **Help System**: Built-in measurement instructions

## How to Use

### Taking Measurements

1. **Heart Girth**: Measure around the animal just behind the front legs
2. **Length**: Measure from the base of the ears to the base of the tail

### Using the App

1. Select the animal type (Pig, Cattle, Sheep, or Goat)
2. Enter the heart girth measurement in inches
3. Enter the length measurement in inches
4. Tap "Calculate Weight" to get the estimated weight
5. View measurement history in the History tab

### Calculation Formula

The app uses the following formula:
```
Weight (lbs) = (Heart Girth²) × Length ÷ Coefficient
```

**Animal Coefficients:**
- Pig: 400
- Cattle: 300
- Sheep: 500
- Goat: 450

### Example

For a pig with Heart Girth: 50" and Length: 40":
```
Weight = (50 × 50) × 40 ÷ 400 = 250 pounds
```

## Installation

### Self-Hosting

1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for PWA features)
3. Access the app via your domain

### Local Development

1. Download all files to a local directory
2. Serve using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open http://localhost:8000 in your browser

### Mobile Installation

1. Open the web app in Chrome (Android) or Safari (iOS)
2. Tap the install prompt or "Add to Home Screen"
3. The app will be installed as a native app

## File Structure

```
livestock-weight-pwa/
├── index.html          # Main application
├── styles.css          # Stylesheet
├── app.js             # JavaScript functionality
├── sw.js              # Service Worker for offline support
├── manifest.json      # PWA manifest
├── generate-icons.html # Icon generator utility
├── icons/             # App icons directory
└── README.md          # This file
```

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers with PWA support

## Features in Detail

### Offline Support
- App works completely offline after first load
- Calculations performed locally
- Data stored in browser's local storage

### Data Storage
- Measurement history saved locally
- No data sent to external servers
- Privacy-focused design

### Responsive Design
- Optimized for mobile devices
- Works on tablets and desktops
- Touch-friendly interface

## Customization

### Adding New Animal Types

Edit the animal selection in `index.html`:
```html
<button class="animal-btn" data-animal="horse" data-coefficient="330">
    🐴 Horse
</button>
```

And update the JavaScript in `app.js` if needed.

### Modifying Coefficients

Update the `data-coefficient` attributes in the HTML or modify the calculation logic in `app.js`.

### Styling

Customize the appearance by editing `styles.css`. The app supports CSS custom properties for easy theming.

## Deployment

### GitHub Pages
1. Push files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via https://yourusername.github.io/repository-name

### Netlify
1. Drag and drop the folder to Netlify
2. Get instant HTTPS deployment
3. Automatic PWA optimization

### Apache/Nginx
Ensure proper MIME types for PWA files:
```apache
# Apache .htaccess
AddType application/manifest+json .webmanifest .json
```

```nginx
# Nginx
location ~* \.(?:manifest|appcache|html?|xml|json)$ {
    add_header Cache-Control "max-age=0";
}
```

## Troubleshooting

### PWA Not Installing
- Ensure HTTPS is enabled
- Check browser developer tools for errors
- Verify manifest.json is valid

### Offline Mode Not Working
- Check if Service Worker registered successfully
- Verify cache is populated
- Clear browser cache and try again

### Icons Not Showing
1. Open `generate-icons.html` in a browser
2. Download the generated icons
3. Save them in the `icons/` directory

## Contributing

This is a simple standalone PWA. To contribute:
1. Test on various devices
2. Report issues or suggest improvements
3. Submit optimizations for performance

## License

Open source project - feel free to use and modify for your needs.

## Support

For agricultural measurement techniques, consult with local veterinarians or agricultural extension services.

For technical issues, check browser console for error messages.
