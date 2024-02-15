
import { Router } from "express";
import { authenticate } from "@/middleware/authenticated.middleware";
import { addPictureToUserAlbum, createAlbumFormValidator, createUser, createUserFormValidator, deleteUser, getUserAlbum, getUserById, getUsers } from "@/resources/user/user.handlers";
import validationMiddleware from "@/middleware/validation.middleware";
import multer from "multer";
import { GetUsersSchema, GetUserByIdSchema, DeleteUserSchema, GetUserAlbumSchema } from "./user.validate";

const router = Router();

router.get(`/`, validationMiddleware(GetUsersSchema), getUsers);
router.post(`/`, multer({ storage: multer.memoryStorage() }).single('profile'), createUserFormValidator, createUser);

router.get(`/:id`, validationMiddleware(GetUserByIdSchema), authenticate, getUserById);
router.delete(`/:id`, validationMiddleware(DeleteUserSchema), authenticate, deleteUser);

router.post(`/:id/album`, authenticate, multer({ storage: multer.memoryStorage() }).single('photo'), createAlbumFormValidator, addPictureToUserAlbum);
router.get(`/:id/album`, validationMiddleware(GetUserAlbumSchema), authenticate, getUserAlbum);

export default router;