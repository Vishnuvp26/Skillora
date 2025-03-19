import express from 'express'
import { CProfileRepository } from '../../repository/client/profileRepository'
import { ProfileService } from '../../services/client/profileService'
import { ProfileController } from '../../controllers/client/profileController'
import upload from '../../config/multer'
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware'

const router = express.Router()

const profileRepository = new CProfileRepository()
const profileService = new ProfileService(profileRepository)
const profileController = new ProfileController(profileService)

router.get(
    "/get-profile/:id",
    profileController.getProfile.bind(profileController)
);

router.put(
    "/update-profile/:id",
    authenticateToken,
    authorizeRoles('client'),
    profileController.updateProfile.bind(profileController)
);

router.post(
    "/upload-image/:id",
    upload.single("profilePic"),
    authenticateToken,
    authorizeRoles('client'),
    profileController.uploadImage.bind(profileController)
);

export default router;