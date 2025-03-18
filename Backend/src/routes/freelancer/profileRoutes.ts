import express from 'express'
import { ProfileRepository } from '../../repository/profileRepository'
import { ProfileService } from '../../services/freelancer/profileService'
import { ProfileController } from '../../controllers/freelancer/profileController'
import upload from '../../config/multer'

const router = express.Router()

const profileRepository = new ProfileRepository()
const profileService = new ProfileService(profileRepository)
const profileController = new ProfileController(profileService)

router.get("/get-profile/:id", profileController.getProfile.bind(profileController));
router.put("/update-profile/:id", profileController.updateProfile.bind(profileController))
router.post("/upload-image/:id", upload.single("profilePic"), profileController.uploadProfileImage.bind(profileController))

export default router