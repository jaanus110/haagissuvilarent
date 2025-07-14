# SEO Human Tasks Guide: Setup and Verification

This guide provides detailed instructions for the human-required tasks in Phase 1 of the SEO and Google Ads Implementation Plan. These tasks are essential for establishing proper tracking and measurement of your website's performance.

## 1. Google Search Console Setup and Verification

Google Search Console is a free tool that helps you monitor and troubleshoot your website's presence in Google Search results.

### Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console/about)
2. Sign in with your Google account (preferably the same account you'll use for other Google services)

### Step 2: Add Your Property
1. Click the "Add property" button
2. Select "URL prefix" as the property type
3. Enter your website URL: `https://tartuhaagissuvila.ee/`
4. Click "Continue"

### Step 3: Verify Ownership
You have several verification options:

#### Option A: HTML File Upload (Recommended)
1. Download the HTML verification file provided by Google
2. Upload this file to your website's root directory (public_html or www folder)
3. The file should be accessible at: `https://tartuhaagissuvila.ee/[filename].html`
4. Click "Verify" in Search Console

#### Option B: HTML Tag
1. Copy the meta tag provided by Google
2. Add this tag to the `<head>` section of your website's homepage HTML
3. Click "Verify" in Search Console

#### Option C: DNS Record
1. Sign in to your domain name provider
2. Add the TXT record provided by Google to your domain's DNS configuration
3. Wait for DNS propagation (can take up to 72 hours)
4. Click "Verify" in Search Console

#### Option D: Google Analytics
If you already have Google Analytics set up, you can use this method:
1. Select "Google Analytics" verification method
2. Ensure you're using the same Google account for both services
3. Click "Verify"

### Step 4: Set Up Essential Features
After verification:
1. Submit your sitemap: `https://tartuhaagissuvila.ee/sitemap.xml`
2. Set your preferred domain version (www or non-www)
3. Check for any immediate coverage issues or manual actions

## 2. Google Analytics Setup and Tracking Verification

Google Analytics provides insights into your website traffic and user behavior.

### Step 1: Create a Google Analytics 4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Admin" in the bottom left corner
4. In the Account column, select "Create Account" if you don't have one
   - Enter an account name (e.g., "Tartu Haagissuvila")
   - Configure data sharing settings
   - Click "Next"
5. Set up a property:
   - Enter a property name (e.g., "tartuhaagissuvila.ee")
   - Select your reporting time zone and currency
   - Click "Next"
6. Provide business information as requested
7. Click "Create"

### Step 2: Set Up Data Collection
1. In your new GA4 property, click "Data Streams"
2. Select "Web" as your platform
3. Enter your website URL and stream name
4. Click "Create stream"

### Step 3: Install the Google Analytics Tag
You'll be provided with a measurement ID (format: G-XXXXXXXX)

#### Option A: Install via Google Tag Manager (Recommended)
1. Create a Google Tag Manager account if you don't have one
2. Add your GA4 configuration tag in GTM
3. Publish your GTM container
4. Add the GTM snippet to your website

#### Option B: Install Analytics Code Directly
1. Copy the provided Google Analytics tag
2. Add this code to the `<head>` section of all pages on your website
3. The code should look similar to:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```

### Step 4: Verify Tracking is Working
1. Wait 24-48 hours for data to appear
2. In Google Analytics, go to Reports > Realtime
3. Visit your website in another tab/browser
4. Confirm that your visit appears in the Realtime report
5. Check that pageviews are being recorded correctly

### Step 5: Set Up Essential Configurations
1. Define conversion events (e.g., form submissions, phone calls)
2. Set up audience definitions
3. Link Google Search Console to Google Analytics:
   - In GA4, go to Admin > Property Settings > Product Links > Search Console Links
   - Click "Link" and follow the prompts

## 3. Keyword Position Tracking Setup

Tracking keyword rankings helps you monitor your SEO progress over time.

### Option 1: Using SEMrush

#### Step 1: Create an Account
1. Go to [SEMrush](https://www.semrush.com/)
2. Sign up for an account (they offer a free trial)

#### Step 2: Set Up Position Tracking
1. From the dashboard, select "Position Tracking" under "Competitive Research"
2. Enter your domain: `tartuhaagissuvila.ee`
3. Select your target country (Estonia) and device type (Desktop and Mobile)
4. Click "Create Project"

#### Step 3: Add Target Keywords
Add the following keywords (and any others relevant to your business):
- haagissuvila rent
- caravan rental tartu
- haagissuvila rent tartus
- rent caravan estonia
- south estonia travel
- tartu accommodation
- family vacation estonia
- camping estonia
- haagissuvila rent eesti
- caravan rental estonia
- lõuna-eesti turism
- puhkus lõuna-eestis
- perepuhkus eestis

#### Step 4: Set Up Reporting
1. Configure weekly email reports
2. Set up alerts for significant ranking changes

### Option 2: Using Ahrefs

#### Step 1: Create an Account
1. Go to [Ahrefs](https://ahrefs.com/)
2. Sign up for an account (they offer a 7-day trial for $7)

#### Step 2: Set Up Rank Tracker
1. From the dashboard, select "Rank Tracker"
2. Click "New project"
3. Enter your domain: `tartuhaagissuvila.ee`
4. Select your target country (Estonia) and language
5. Click "Create project"

#### Step 3: Add Target Keywords
Add the same keywords as listed in the SEMrush section.

#### Step 4: Configure Settings
1. Set up tracking frequency (weekly is recommended)
2. Configure email notifications
3. Add tags to organize keywords by category

### Option 3: Using Free Alternatives

If you prefer not to use paid tools initially, consider these alternatives:

#### Google Search Console
1. After setting up Search Console (instructions above)
2. Go to "Performance" report
3. This shows your average position for queries your site appears for
4. Not as comprehensive as dedicated tools but provides basic insights

#### SERPWatcher by Mangools
1. Go to [SERPWatcher](https://serpwatcher.com/)
2. They offer a limited free plan
3. Follow their setup instructions to track your main keywords

## Next Steps After Setup

Once you've completed these setup tasks:

1. Document all account credentials in a secure location
2. Share access with relevant team members
3. Allow 2-4 weeks for data collection before making major decisions
4. Update the baseline measurement report with initial data
5. Proceed to Phase 2 of the SEO implementation plan

## Troubleshooting Common Issues

### Google Search Console Verification Issues
- If HTML file verification fails, check file permissions (should be 644)
- For DNS verification issues, contact your domain registrar for assistance
- If meta tag verification fails, ensure the tag is in the `<head>` section and the page is accessible

### Google Analytics Tracking Issues
- Use the [Tag Assistant](https://tagassistant.google.com/) to debug tag implementation
- Check for JavaScript errors in your browser console
- Verify that no ad blockers are interfering with tracking
- Ensure the tracking code is on all pages of your website

### Keyword Tracking Issues
- If keywords show "not found," check for regional settings issues
- Ensure you've selected the correct language (Estonian, English, Russian)
- Some keywords may take time to appear in tracking tools