const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
};

const socialImgurUrls = {
    facebook: null,
    instagram: null,
    website: null
};

function uploadBase64ToImgur(base64Image) {
    return new Promise((resolve, reject) => {
        const postData = 'image=' + encodeURIComponent(base64Image);
        const options = {
            hostname: 'api.imgur.com',
            port: 443,
            path: '/3/image',
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID 546c25a59c58ad7',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    if (data.success && data.data && data.data.link) {
                        resolve(data.data.link);
                    } else {
                        reject(new Error(data.data ? (data.data.error || 'Unknown Imgur error') : 'Unknown Imgur error'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function uploadFileToImgur(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`File does not exist for Imgur upload: ${filePath}`);
            return null;
        }
        const fileData = fs.readFileSync(filePath);
        const base64Image = fileData.toString('base64');
        const url = await uploadBase64ToImgur(base64Image);
        console.log(`Hosted ${path.basename(filePath)} successfully at: ${url}`);
        return url;
    } catch (e) {
        console.error(`Error uploading ${filePath} to Imgur:`, e.message);
        return null;
    }
}

async function initializeSocialUrls() {
    console.log('\n==================================================');
    console.log('Hosting social icons to Imgur for public access...');
    socialImgurUrls.facebook = await uploadFileToImgur(path.join(__dirname, 'assets', 'social', 'Facebook.png'));
    socialImgurUrls.instagram = await uploadFileToImgur(path.join(__dirname, 'assets', 'social', 'Instagram.png'));
    socialImgurUrls.website = await uploadFileToImgur(path.join(__dirname, 'assets', 'social', 'web.png'));
    console.log('==================================================\n');
}

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    const decodedUrl = decodeURIComponent(req.url);
    const pathname = decodedUrl.split('?')[0];
    
    // Handle social icons API
    if (req.method === 'GET' && pathname === '/social-urls') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(socialImgurUrls));
        return;
    }
    
    // Handle image upload endpoint for production/hosting
    if (req.method === 'POST' && pathname === '/upload') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                if (!data.image) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'No image data provided' }));
                    return;
                }
                const base64Data = data.image.replace(/^data:image\/png;base64,/, "");
                
                // Save locally first
                const dir = path.join(__dirname, 'assets', 'hosted');
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir, { recursive: true });
                }
                const filename = `signature_${Date.now()}.png`;
                const destPath = path.join(dir, filename);
                fs.writeFileSync(destPath, base64Data, 'base64');
                
                // Try uploading to Imgur
                let publicUrl = null;
                try {
                    publicUrl = await uploadBase64ToImgur(base64Data);
                    console.log(`Banner hosted successfully on Imgur: ${publicUrl}`);
                } catch (imgurErr) {
                    console.error('Imgur upload failed in /upload, falling back to local:', imgurErr.message);
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    url: publicUrl || `/assets/hosted/${filename}` 
                }));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: e.message }));
            }
        });
        return;
    }
    
    // Resolve file path
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    
    // Get extension
    const ext = path.extname(filePath);
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`   Usa Ctrl+C para detener el servidor.`);
    console.log(`==================================================\n`);
    
    // Run social URLs upload in background
    initializeSocialUrls().catch(err => {
        console.error('Failed to initialize social URLs:', err);
    });
});
