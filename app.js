const path = require('path');
const express = require('express');
const fs = require("fs");
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" value="Upload" />
    </form>
    <br/>
    <a href="/files">View Uploaded Files</a>
  `);
});

app.post('/uploads', (req, res) => {
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

app.get('/files', (req, res) => {
  const filesPath = path.join(__dirname, 'uploads');
  const fileNames = fs.readdirSync(filesPath);

  const fileList = fileNames.map((fileName) => {
    const filePath = path.join('/uploads', fileName);
    return `<li><a href="${filePath}">${fileName}</a></li>`;
  });

  const html = `
    <h2>Uploaded Files</h2>
    <ul>${fileList.join('')}</ul>
  `;

  res.send(html);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
