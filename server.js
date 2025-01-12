const express = require('express');
const path = require('path');
const app = express();

// سرو فایل‌های استاتیک
app.use(express.static(__dirname));

// هدایت همه درخواست‌ها به index.html
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// راه‌اندازی سرور روی پورت 5500
app.listen(5500, () => {
    console.log('Server is running on http://localhost:5500');
}); 