import path from "path";

const validImageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

export function isImageFile(file: Express.Multer.File) {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();
  return validImageExtensions.includes(extension) && mimeType.startsWith("image/");
}
