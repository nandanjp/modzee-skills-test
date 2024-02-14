import validationMiddleware from "@/middleware/validation.middleware";
import { Router } from "express"; import { DeletePhotoSchema, GetPhotoIdSchema, GetPhotosSchema } from "@/resources/photo/photo.validate";
import { createPhoto, createPhotoFormValidator, deletePhoto, getPhotoById, getPhotos } from "@/resources/photo/photo.handlers";
import { authenticate } from "@/middleware/authenticated.middleware";
import multer from "multer";


const router = Router();

router.get(`/`, validationMiddleware(GetPhotosSchema), getPhotos);
router.get(`/:id`, authenticate, validationMiddleware(GetPhotoIdSchema), getPhotoById);
router.post(`/`, multer({ storage: multer.memoryStorage() }).single("img"), createPhotoFormValidator, createPhoto);
router.delete(`/:id`, authenticate, validationMiddleware(DeletePhotoSchema), deletePhoto);

export default router;