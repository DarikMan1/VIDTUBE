import multer from "multer";
import path from "path";

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");  // Folder where files will be stored temporarily
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);  // Extract file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);  // Naming convention
  }
});

// Export uploadFields to handle multiple fields (avatar, coverImage)
export const uploadFields = multer({ storage }).fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 }
]);
