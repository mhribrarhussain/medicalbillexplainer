# Deployment Instructions

## 1. Prepare Files
The complete website is located in: `C:\Users\DELL\Desktop\medical bill\Medical Bill Explainer`

Ensure the folder includes:
- `index.html`, `style.css`, `script.js`
- `cpt/` folder (with 50+ HTML files)
- `sitemap.xml`, `robots.txt`
- Legal pages (`privacy-policy.html`, etc.)

## 2. Deploy to Netlify
### Option A: Drag & Drop (Easiest)
1. Go to [app.netlify.com](https://app.netlify.com).
2. Log in or Sign up.
3. Drag and drop the **entire "Medical Bill Explainer" folder** into the "Drag and drop your site folder here" area.

### Option B: Via GitHub (Recommended for Updates)
1. Create a new repository on GitHub.
2. Push this code to GitHub (see commands below).
3. Log in to Netlify -> "Add new site" -> "Import an existing project".
4. Select GitHub and choose your repository.

## GitHub Push Instructions
Run these commands in your terminal:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
git push -u origin main
```

## 3. Post-Deployment Checks
- **Click Links**: Open the live URL. Click "Search Codes" > Select a code. Ensure it loads `/cpt/XXXXX.html`.
- **Test Tool**: Go to "Explainer Tool". Paste "99213". Click Analyze. Ensure it finds the code.
- **Check Sitemap**: Visit `your-site-name.netlify.app/sitemap.xml`. Ensure it lists all URLs.

## 4. Updates
To add new CPT codes:
1. Edit `data/cpt_codes.js` to add the new object.
2. Run `node build_cpt_pages.js` locally.
3. Re-deploy the folder to Netlify.
