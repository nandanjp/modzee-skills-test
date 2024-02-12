
import { Router } from "express";
import { authenticate } from "@/middleware/authenticated.middleware";
import { addPictureToUserAlbum, createAlbumFormValidator, createUser, createUserFormValidator, deleteUser, getUserAlbum, getUserById, getUsers } from "@/resources/user/user.handlers";
import validationMiddleware from "@/middleware/validation.middleware";
import multer from "multer";
import { GetUsersSchema, GetUserByIdSchema, DeleteUserSchema, GetUserAlbumSchema } from "./user.validate";

const router = Router();

router.get(`/`, validationMiddleware(GetUsersSchema), getUsers);
router.post(`/`, createUserFormValidator, multer({ storage: multer.memoryStorage() }).single('profile'), createUser);

router.get(`/:id`, authenticate, validationMiddleware(GetUserByIdSchema), getUserById);
router.delete(`/:id`, authenticate, validationMiddleware(DeleteUserSchema), deleteUser);

router.post(`/:id/album`, authenticate, createAlbumFormValidator, multer({ storage: multer.memoryStorage() }).single('photo'), addPictureToUserAlbum);
router.get(`/:id/album`, authenticate, validationMiddleware(GetUserAlbumSchema), getUserAlbum);

export default router;