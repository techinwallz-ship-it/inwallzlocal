# InWallz - Digital Signage Platform

A modern, responsive web application built with React JS featuring dark/light theme toggle, smooth animations, and a professional UI.

## 🚀 Features

- ✨ **Dual Theme Support** - Seamless dark/light mode toggle
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean, professional design with smooth animations
- ⚡ **Performance Optimized** - Built with Vite for lightning-fast development
- 🎭 **Framer Motion** - Smooth, professional animations throughout
- 🎯 **Easy Customization** - All content in a single CONFIG object

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Customization Guide](#customization-guide)
- [Components](#components)
- [Theme System](#theme-system)
- [Deployment](#deployment)

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Navigate to the project directory:**
   ```bash
   cd inwallz-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 Quick Start

The application will start in dark mode by default. You can toggle between dark and light themes using the sun/moon icon in the navigation bar.

### Building for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
inwallz-app/
├── src/
│   ├── main.jsx          # Application entry point
│   └── index.css         # Tailwind imports and utilities
├── InWallz.jsx           # Main application component
├── styles.css            # Custom styles and animations
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🎨 Customization Guide

### Editing Content

All content is centralized in the `CONFIG` object at the top of `InWallz.jsx`. Here's how to customize:

#### 1. Company Information

```javascript
const CONFIG = {
  companyName: "InWallz",  // Change your company name
  tagline: "Transform Your Walls Into Dynamic Digital Experiences",
  description: "Your description here...",
  // ...
}
```

#### 2. Hero Stats

```javascript
heroStats: [
  { value: "500+", label: "Active Clients" },
  { value: "10K+", label: "Displays Deployed" },
  // Add or modify stats
],
```

#### 3. Features

```javascript
features: [
  {
    icon: "🎯",  // Use emoji or change to custom icon
    title: "Your Feature Title",
    description: "Feature description..."
  },
  // Add more features
],
```

#### 4. Founders Information

```javascript
founders: [
  {
    name: "Your Name",
    role: "Your Role",
    email: "your.email@company.com",
    phone: "+1 (555) 123-4567",
    bio: "Your bio...",
    image: "https://your-image-url.com/photo.jpg"
  },
  // Add more founders
],
```

#### 5. Pricing Plans

```javascript
pricing: [
  {
    name: "Plan Name",
    price: "$29",
    period: "/month",
    description: "Plan description",
    features: [
      "Feature 1",
      "Feature 2",
      // Add more features
    ],
    highlighted: false,  // Set to true for popular plan
    cta: "Button Text"
  },
],
```

#### 6. Contact Information

```javascript
contact: {
  email: "hello@yourcompany.com",
  phone: "+1 (555) 123-4500",
  address: "Your address",
  hours: "Mon-Fri: 9:00 AM - 6:00 PM PST",
  social: {
    twitter: "https://twitter.com/yourcompany",
    linkedin: "https://linkedin.com/company/yourcompany",
    facebook: "https://facebook.com/yourcompany",
    instagram: "https://instagram.com/yourcompany"
  }
},
```

### Changing Colors

#### Dark Theme Colors

Edit the CSS variables in `styles.css`:

```css
.dark {
  --color-accent-cyan: #22d3ee;    /* Primary accent color */
  --color-accent-blue: #3b82f6;    /* Secondary accent */
  --color-accent-purple: #a855f7;  /* Tertiary accent */
}
```

#### Light Theme Colors

```css
.light {
  --color-accent-cyan: #0891b2;
  --color-accent-blue: #2563eb;
  --color-accent-purple: #7c3aed;
}
```

### Changing Fonts

1. Update the Google Fonts import in `styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;700&display=swap');
```

2. Update the font variables:

```css
:root {
  --font-primary: 'YourFont', sans-serif;
  --font-display: 'YourDisplayFont', sans-serif;
}
```

## 🧩 Components

### Main Components

1. **Navbar** - Sticky navigation with theme toggle
2. **Hero** - Landing section with animated background
3. **Features** - Feature showcase with cards
4. **Pricing** - Pricing plans comparison
5. **Founders** - Team member profiles
6. **Contact** - Contact form and information
7. **Footer** - Site footer with links and info

### Theme Provider

The `ThemeProvider` component manages the dark/light theme state globally:

```javascript
const { isDark, toggleTheme } = useTheme();
```

## 🎨 Theme System

### Using Theme in Components

```javascript
const { isDark } = useTheme();

// Conditional styling based on theme
<div className={isDark ? 'dark-class' : 'light-class'}>
  Content
</div>
```

### Theme Toggle Button

The theme toggle is in the Navbar component. Click the sun/moon icon to switch themes.

## 🚀 Deployment

### Vercel

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify](https://netlify.com)

### Custom Server

1. Build: `npm run build`
2. Serve the `dist` directory with any static file server

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚡ Performance Tips

1. **Images**: Use optimized images (WebP format recommended)
2. **Lazy Loading**: Large images load on demand
3. **Code Splitting**: Vite automatically splits code for optimal loading
4. **Caching**: Built-in caching for static assets

## 🎭 Animation Customization

Edit animation durations in component files:

```javascript
transition={{ duration: 0.6, delay: 0.2 }}
```

Or modify animation keyframes in `styles.css`.

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

Change the port in `vite.config.js`:

```javascript
server: {
  port: 3001,  // Use different port
}
```

## 📄 License

This project is open source and available for customization.

## 🤝 Support

For questions or issues, contact the founders through the contact information in the application.

## 🎉 Credits

- **Framework**: React 18
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Heroicons (via SVG)

---

**Built with ❤️ for InWallz**
