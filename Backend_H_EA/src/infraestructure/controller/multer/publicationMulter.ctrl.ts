import path from 'path';
import multer from "multer";
import express from 'express';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploadsPublication"),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});
export const uploadPublication=multer({storage});
export const deleteLocalFilePublication = (req: Express.Request & { file: Express.Multer.File }, res: express.Response, next: express.NextFunction) => {
  if (req.file) {
    const filePath = req.file.path;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      next();
    });
  } else {
    next();
  }
};