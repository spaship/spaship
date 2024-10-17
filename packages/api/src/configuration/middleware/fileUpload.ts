import { Injectable, NestMiddleware } from '@nestjs/common';
import * as multer from 'multer';
import { DIRECTORY_CONFIGURATION, VALIDATION } from 'src/Configuration';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const storage = multer.diskStorage({
      destination: DIRECTORY_CONFIGURATION.baseDir,
      filename: (request, file, callback) => {
        const filename = `${Date.now()}-${file.originalname.replace(VALIDATION.FILE, '_')}`;
        callback(null, filename);
      }
    });

    const upload = multer({
      storage,
      fileFilter: (request, file, cb) => {
        file.filename = `${Date.now()}-${file.originalname.replace(VALIDATION.FILE, '_')}`;
        cb(null, true);
      }
    }).single('upload');

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      next();
    });
  }
}
