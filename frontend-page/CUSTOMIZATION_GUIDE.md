# InWallz Customization Guide

This guide will help you customize every aspect of your InWallz web application without needing deep technical knowledge.

## 📋 Table of Contents

1. [Quick Edits (CONFIG Object)](#quick-edits)
2. [Visual Customization](#visual-customization)
3. [Adding New Sections](#adding-new-sections)
4. [Advanced Customization](#advanced-customization)

---

## 🎯 Quick Edits (CONFIG Object)

All basic content edits are done in the `CONFIG` object at the top of `InWallz.jsx` (lines 16-146).

### Company Information

```javascript
companyName: "YourCompany",  // Change company name
tagline: "Your amazing tagline here",  // Main heading on home page
description: "Detailed description of what your company does...",
```

### Hero Statistics

Add or modify the statistics shown on the home page:

```javascript
heroStats: [
  { value: "1000+", label: "Happy Customers" },
  { value: "50+", label: "Countries" },
  { value: "99.9%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
  // Add more stats as needed
],
```

### Features Section

Customize or add new features:

```javascript
features: [
  {
    icon: "🚀",  // Use any emoji
    title: "Fast Deployment",
    description: "Deploy in minutes, not hours..."
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    description: "Enterprise-grade security..."
  },
  // Add up to 6 features for best layout
],
```

**Tips:**
- Use emojis for icons (they look great on all devices)
- Keep titles under 5 words
- Keep descriptions under 20 words for consistency

### Founders Information

```javascript
founders: [
  {
    name: "Jane Smith",
    role: "CEO & Co-Founder",
    email: "jane@yourcompany.com",
    phone: "+1 (555) 987-6543",
    bio: "20+ years in tech industry",
    image: "https://yourdomain.com/images/jane.jpg"
  },
  // Add or remove founders as needed
],
```

**Image Tips:**
- Use square images (1:1 ratio)
- Recommended size: 400x400px minimum
- Format: JPG or PNG
- Host images on: Imgur, Cloudinary, or your own server

### Pricing Plans

```javascript
pricing: [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "Perfect for individuals",
    features: [
      "5 Projects",
      "10GB Storage",
      "Email Support",
      "Basic Analytics"
    ],
    highlighted: false,  // Set true for "Popular" badge
    cta: "Get Started"
  },
  // Add up to 3-4 plans for best layout
],
```

**Pricing Tips:**
- Keep plan names short (1 word is best)
- Use "$X" format for prices, or "Custom" for enterprise
- List 5-8 features per plan
- Set `highlighted: true` for your most popular plan

### Contact Information

```javascript
contact: {
  email: "hello@yourcompany.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, City, State 12345",
  hours: "Mon-Fri: 9 AM - 5 PM EST",
  social: {
    twitter: "https://twitter.com/yourcompany",
    linkedin: "https://linkedin.com/company/yourcompany",
    facebook: "https://facebook.com/yourcompany",
    instagram: "https://instagram.com/yourcompany"
  }
},
```

---

## 🎨 Visual Customization

### Changing Theme Colors

Edit `styles.css` (lines 20-44):

#### Dark Theme Colors

```css
.dark {
  --color-accent-cyan: #22d3ee;    /* Primary color */
  --color-accent-blue: #3b82f6;    /* Secondary color */
  --color-accent-purple: #a855f7;  /* Accent color */
}
```

**Popular Color Schemes:**

**Blue & Green (Tech/Corporate):**
```css
--color-accent-cyan: #10b981;
--color-accent-blue: #3b82f6;
--color-accent-purple: #6366f1;
```

**Orange & Red (Energy/Creative):**
```css
--color-accent-cyan: #f97316;
--color-accent-blue: #ef4444;
--color-accent-purple: #ec4899;
```

**Purple & Pink (Modern/Luxury):**
```css
--color-accent-cyan: #a855f7;
--color-accent-blue: #ec4899;
--color-accent-purple: #8b5cf6;
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

1. **Find a font on [Google Fonts](https://fonts.google.com)**

2. **Update the import in `styles.css` (line 7):**

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Playfair+Display:wght@700;900&display=swap');
```

3. **Update font variables (lines 12-13):**

```css
--font-primary: 'Poppins', sans-serif;     /* Body text */
--font-display: 'Playfair Display', serif; /* Headings */
```

**Recommended Font Combinations:**

- **Modern Tech:** Outfit + Sora (current)
- **Professional:** Poppins + Montserrat
- **Editorial:** Crimson Text + Work Sans
- **Playful:** Quicksand + Fredoka One
- **Elegant:** Playfair Display + Lato

### Changing Logo

The logo is currently text-based. To use an image:

In `InWallz.jsx`, find the Navbar component (around line 255) and replace:

```javascript
// Replace this:
<div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
  isDark 
    ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600' 
    : 'bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600'
}`}>
  <span className="text-white font-bold text-lg sm:text-xl">IW</span>
</div>

// With this:
<img 
  src="/path/to/your/logo.png" 
  alt="Company Logo"
  className="w-10 h-10 sm:w-12 sm:h-12"
/>
```

---

## 🔧 Adding New Sections

### Adding a Testimonials Section

1. **Add testimonials to CONFIG:**

```javascript
testimonials: [
  {
    name: "John Doe",
    role: "CEO",
    company: "TechCorp",
    content: "This product changed our business!",
    rating: 5,
    image: "https://..."
  },
],
```

2. **Create the component in `InWallz.jsx`:**

```javascript
const Testimonials = () => {
  const { isDark } = useTheme();

  return (
    <section id="testimonials" className={`py-24 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16">
          What Our Clients Say
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {CONFIG.testimonials.map((testimonial, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white/5">
              <p className="text-lg mb-4">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  className="w-12 h-12 rounded-full"
                  alt={testimonial.name}
                />
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

3. **Add to the App component:**

```javascript
<Hero />
<Features />
<Testimonials />  {/* Add this line */}
<Pricing />
```

### Adding a FAQ Section

Similar process - add FAQ data to CONFIG, create the component, and include it in the App.

---

## 🚀 Advanced Customization

### Changing Animation Speed

In any component, find the `transition` prop and modify:

```javascript
// Slower animation
transition={{ duration: 1.2, delay: 0.3 }}

// Faster animation
transition={{ duration: 0.3, delay: 0.1 }}
```

### Adding Custom Animations

In `styles.css`, add new keyframes:

```css
@keyframes myAnimation {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Use in component:

```javascript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  // Or use CSS animation:
  style={{ animation: 'myAnimation 1s ease-out' }}
>
```

### Modifying Responsive Breakpoints

In Tailwind classes, use these prefixes:
- `sm:` - Tablets (768px+)
- `md:` - Small desktops (1024px+)
- `lg:` - Large desktops (1280px+)
- `xl:` - Extra large (1536px+)

Example:
```javascript
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
// Mobile: 2xl, Tablet: 3xl, Desktop: 4xl, Large: 5xl
```

### Adding a Blog Section

1. Create a new route/page
2. Add blog posts to CONFIG
3. Create BlogPost component
4. Link from navigation

---

## 📝 Best Practices

### Content Guidelines

1. **Headlines**: Keep under 10 words
2. **Descriptions**: 15-25 words ideal
3. **Features**: 4-6 features recommended
4. **Pricing**: 3-4 plans maximum
5. **Founders**: 2-4 people ideal

### Image Guidelines

1. **Optimize images** before uploading (use tinypng.com)
2. **Use WebP format** when possible for better performance
3. **Responsive images**: Provide 1x, 2x versions for retina
4. **Alt text**: Always include descriptive alt text

### Performance Tips

1. Keep CONFIG object reasonable size
2. Lazy load images for faster initial load
3. Minimize custom CSS
4. Use Tailwind utilities when possible
5. Test on mobile devices regularly

---

## 🆘 Common Issues & Solutions

### Issue: Changes not showing

**Solution**: Clear browser cache or do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Issue: Layout breaking on mobile

**Solution**: Check responsive classes (sm:, md:, lg:) are properly applied

### Issue: Colors not matching

**Solution**: Ensure you've updated colors in BOTH dark and light theme sections

### Issue: Fonts not loading

**Solution**: 
1. Check Google Fonts URL is correct
2. Ensure font name matches exactly in CSS variables
3. Check browser console for errors

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Google Fonts](https://fonts.google.com)
- [Coolors (Color Schemes)](https://coolors.co)
- [Heroicons](https://heroicons.com)

---

## 💡 Need Help?

1. Check the README.md for basic setup
2. Review this customization guide
3. Check browser console for error messages
4. Reach out to the founders via the contact form

---

**Happy Customizing! 🎨**

Built with ❤️ for InWallz
