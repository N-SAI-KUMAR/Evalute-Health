const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.status(200).json({
    success: true,
    message: "File Uploaded Successfully",
    file: req.file.filename,
  });
};

module.exports = {
  uploadFile,
};