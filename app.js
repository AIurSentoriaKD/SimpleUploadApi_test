const path = require("path");
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/media", express.static(path.join(__dirname, "media")));

app.get("/", (req, res) => {
  res.send(`
  
  <form action="/upload" method="post" enctype="multipart/form-data">
  <label for="file" class="file-label">
    <span class="file-icon">
      <i class="fas fa-cloud-upload-alt"></i>
    </span>
    <span class="file-text">Choose a file...</span>
  </label>
  <input id="file" type="file" name="file" class="file-input" />
  <button type="submit" class="upload-btn">Upload</button>
</form>
<div class="centered-link">
  <a href="/files" class="view-files-link">View Uploaded Files</a>
</div>
<style>
  form {
    margin-top: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
  }

  .file-label {
    display: inline-block;
    position: relative;
    background-color: #f2f2f2;
    color: #333;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .file-label:hover {
    background-color: #e0e0e0;
  }

  .file-icon {
    margin-right: 10px;
  }

  .file-text {
    vertical-align: middle;
  }

  .file-input {
    display: none;
  }

  .upload-btn {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .upload-btn:hover {
    background-color: #45a049;
  }

  .centered-link {
    text-align: center;
    margin-top: 20px;
  }

  .view-files-link {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .view-files-link:hover {
    background-color: #45a049;
  }
</style>

  `);
});

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;
  const uploadPath = path.join(__dirname, "uploads", file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }

    return res.send("File uploaded successfully");
  });
});

app.get("/files", (req, res) => {
  const filesPath = path.join(__dirname, "uploads");
  const fileNames = fs.readdirSync(filesPath);

  const fileList = fileNames.map((fileName) => {
    const filePath = path.join("/uploads", fileName);
    return `
    <tr>
    <td><a href="${filePath}">${fileName}</a></td>
    <td>
      <form action="/files/${fileName}" method="post" style="display: inline;">
        <button type="submit" class="delete-btn">Delete</button>
      </form>
    </td>
  </tr>`;
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
  
      table {
        margin: 0 auto;
        border-collapse: collapse;
        width: 80%;
      }
  
      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
  
      th {
        background-color: #4CAF50;
        color: white;
      }
  
      a {
        text-decoration: none;
      }
  
      .delete-btn {
        padding: 4px 8px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
  
      .delete-btn:hover {
        background-color: #d32f2f;
      }
    </style>
  </head>
  <body>
  <h1>UPLOADED FILES</h1>
    <table>
      <tr>
        <th>File Name</th>
        <th>Actions</th>
      </tr>
      ${fileList}
    </table>
    <center>
    <img src="media/imagee.png" alt="Italian Trulli" width="700" height="400" style="align: center;">
</center>



  </body>
  </html>
  
  `;

  res.send(html);
});

app.post("/files/:filename", (req, res) => {
  const filesPath = path.join(__dirname, "uploads");
  const filename = req.params.filename;
  const filePath = path.join(filesPath, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }

    return res.redirect("/files");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
