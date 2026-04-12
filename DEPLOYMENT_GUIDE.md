# 🚀 Yari Website Deployment Guide

## 📋 What You Have
- A vibrant, animated landing page with Duolingo-inspired design
- Smooth animations and interactions
- Mobile-responsive layout
- Professional startup aesthetic

## 🎯 Before You Deploy - Important Updates

### 1. Update Google Form Link
Open `index.html` and find all instances of `YOUR_GOOGLE_FORM_LINK` (there are 4 of them).

Replace with your actual Google Form URL:
```html
<!-- Search for this: -->
href="YOUR_GOOGLE_FORM_LINK"

<!-- Replace with something like: -->
href="https://forms.google.com/your-actual-form-link"
```

Locations to update:
- Line 23: Navbar "Join Waitlist" button
- Line 41: Hero "Join Early Access" button
- Line 66: Footer link (if you added one)

### 2. Optional Customizations

**Update Student Count:**
In `index.html`, line 34, change:
```html
<span>100+ students already joined waitlist</span>
```

**Update Balance Amount:**
In `script.js`, line 146, change the target value:
```javascript
const target = 120; // Change to any number you want
```

**Update Stats:**
In `index.html`, find the stats section and update `data-target` values:
```html
<div class="stat-value" data-target="100">0</div> <!-- Current waitlist count -->
<div class="stat-value" data-target="5">0</div>   <!-- Partner cafes -->
<div class="stat-value" data-target="50">0</div>  <!-- Events -->
```

## 📤 Deployment Options

### Option 1: GitHub Pages (Recommended - Free with Student Pack)

1. **Create a new GitHub repository:**
   - Go to github.com
   - Click "New repository"
   - Name it: `yari-website` or anything you like
   - Make it public
   - Don't initialize with README

2. **Upload your files:**
   ```bash
   # If you have git installed:
   git init
   git add index.html styles.css script.js
   git commit -m "Initial Yari website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/yari-website.git
   git push -u origin main
   ```

   **OR use GitHub web interface:**
   - Click "uploading an existing file"
   - Drag and drop: `index.html`, `styles.css`, `script.js`
   - Commit changes

3. **Enable GitHub Pages:**
   - Go to repository Settings
   - Click "Pages" in left sidebar
   - Under "Source", select "main" branch
   - Click Save
   - Your site will be live at: `https://YOUR_USERNAME.github.io/yari-website/`

4. **Connect your custom domain (useyari.me):**
   - In GitHub Pages settings, add custom domain: `useyari.me`
   - In your domain registrar (where you got useyari.me):
     - Add A records pointing to:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`
     - Add CNAME record: `www` → `YOUR_USERNAME.github.io`
   - Wait 10-15 minutes for DNS propagation
   - Enable "Enforce HTTPS" in GitHub Pages settings

### Option 2: Netlify (Easiest - Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub Student Pack email
3. Click "Add new site" → "Deploy manually"
4. Drag and drop all three files (`index.html`, `styles.css`, `script.js`)
5. Your site is live instantly!
6. To add custom domain:
   - Go to Site settings → Domain management
   - Add custom domain: `useyari.me`
   - Follow their DNS instructions

### Option 3: Vercel (Developer-Friendly)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository (from Option 1)
4. Deploy automatically
5. Add custom domain in settings

### Option 4: Traditional Web Hosting

If you already have hosting (cPanel, etc.):
1. Login to your hosting control panel
2. Go to File Manager
3. Navigate to `public_html` or `www` folder
4. Upload all three files:
   - `index.html`
   - `styles.css`
   - `script.js`
5. Your site should be live at `useyari.me`

## 🔧 Testing Before Deployment

**Test locally:**
1. Download all three files to a folder
2. Double-click `index.html`
3. Check:
   - ✅ Animations are smooth
   - ✅ Buttons link to your Google Form
   - ✅ Mobile view (resize browser window)
   - ✅ All text is correct
   - ✅ No broken links

## 📱 Mobile Optimization Checklist

Your site is already mobile-responsive, but verify:
- [ ] Hero text is readable on phone
- [ ] Buttons are easy to tap
- [ ] Balance card displays correctly
- [ ] Feature cards stack vertically
- [ ] Phone mockup scales down

## 🎨 Future Enhancements (After Presentation)

After your April 16th presentation, you can add:
1. **Analytics:** Google Analytics or Plausible
2. **Email Collection:** Integrate with Mailchimp or ConvertKit
3. **Chat Widget:** Add Tawk.to or Intercom
4. **More Animations:** Confetti on form submission
5. **Video Demo:** Add a product demo video

## 🆘 Troubleshooting

**Problem: Fonts not loading**
- Solution: Check internet connection. Fonts load from Google Fonts CDN.

**Problem: Animations not working**
- Solution: Ensure `script.js` is in the same folder as `index.html`

**Problem: Custom domain not working**
- Solution: DNS propagation takes 24-48 hours. Use `https://dnschecker.org` to verify.

**Problem: Google Form link not working**
- Solution: Make sure you replaced ALL instances of `YOUR_GOOGLE_FORM_LINK`

## 📊 Presentation Tips (April 16th)

For your incubation center presentation:

1. **Open the live website on a big screen**
2. **Demonstrate key features:**
   - Scroll through each section
   - Show the animated balance card
   - Click the "Join Early Access" button
   - Show mobile view (resize browser)

3. **Talking points:**
   - "Over 100 students already on waitlist" (update with real number)
   - "Vibrant, mobile-first design"
   - "Integrated with Google Forms for early user feedback"
   - "Built to scale with our vision"

4. **Have backup:**
   - Screenshot of the website in case internet fails
   - PDF version of the site

## 🚀 Quick Deploy Checklist

- [ ] Update Google Form links (4 places)
- [ ] Update student count if needed
- [ ] Test locally in browser
- [ ] Choose deployment platform
- [ ] Upload files
- [ ] Connect custom domain
- [ ] Test on mobile device
- [ ] Share link with friends for feedback
- [ ] Prepare presentation demo

## 📞 Support

If you need help:
1. Check GitHub Pages documentation
2. Use Netlify's live chat support
3. Ask on Reddit: r/webdev
4. Come back to Claude for specific issues

Good luck with your presentation! 🎉
