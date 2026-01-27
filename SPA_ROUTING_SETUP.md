# SPA Router Configuration Guide

## Problem
When you reload the page on any route (e.g., `/login`, `/collections`), you get a 404 error because the server tries to find a physical file instead of serving `index.html`.

## Solution
Configure your web server to serve `index.html` for all routes that don't have physical files.

### Apache (.htaccess)
A `.htaccess` file has been created in the `build/` directory. It will:
- Allow requests for existing files and directories to pass through
- Rewrite all other requests to `index.html`

Make sure your Apache server has `mod_rewrite` enabled.

### Nginx
If using Nginx, add this to your server block configuration:

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  
  root /path/to/build;
  
  location / {
    # Try to serve the file directly
    # If not found, fall back to index.html
    try_files $uri $uri/ /index.html;
  }
  
  # Cache assets with hash in filename for long time
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  
  # Don't cache index.html
  location = /index.html {
    expires 0;
    add_header Cache-Control "public, must-revalidate";
  }
}
```

### Node.js / Express
If using a Node.js server, ensure your static file serving is configured like:

```javascript
app.use(express.static('build'));

// SPA fallback - must be after static middleware
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

### Vercel / Netlify
These platforms automatically handle SPA routing, so no configuration is needed.

## After Deployment
1. Deploy the `build/` folder contents to your server
2. Ensure the `.htaccess` file is included (if using Apache)
3. Restart your web server
4. Test by accessing `/login` or other routes directly and reloading the page

It should now work without 404 errors!
