const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dudvqdnnx',
  api_key: '651961252596759',
  api_secret: 'h3cEjW6jpJ68SLmaPpcuCccvdXA',
});

// 1x1 pixel transparent PNG (valid)
const pngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

cloudinary.uploader
  .upload('data:image/png;base64,' + pngBase64, { folder: 'test' })
  .then((r) => {
    console.log('UPLOAD OK');
    console.log('URL:', r.secure_url);
    console.log('Public ID:', r.public_id);

    // Now delete the test image
    return cloudinary.uploader.destroy(r.public_id);
  })
  .then(() => {
    console.log('Cleanup delete OK');
    process.exit(0);
  })
  .catch((e) => {
    console.error('ERROR:', e.message);
    if (e.http_code) console.error('HTTP Code:', e.http_code);
    process.exit(1);
  });
