const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const uploadPath = path.join(__dirname, 'uploads', file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    return res.send('File uploaded successfully');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});