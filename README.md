# Simple NIMIQ URL Shortener

You need to create a file called '.htaccess' in the root directory of your site containing the following code:

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^\.]+)$ $1.html [NC,L]
```

Tools Used : 

- Jsonstore.io
- HTML
- JavaScript
- Socket.io
- Now.sh

No Need Of Database !

READ THE Original ARTICLE HERE: https://palash.tk/Build-URL-Shortener-With-HTML-JS

