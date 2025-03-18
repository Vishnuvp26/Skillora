import { Request, Response, NextFunction } from "express";
import { IProfileController } from "../../interfaces/freelancer/profile/IProfileController";
import { IProfileService } from "../../interfaces/freelancer/profile/IProfileService";
import { HttpStatus } from "../../constants/statusContstants";
import { Messages } from "../../constants/messageConstants";

export class ProfileController implements IProfileController {
    constructor(private _profileService: IProfileService) { }
    
    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this._profileService.getProfile(req.params.id)
            res.status(HttpStatus.OK).json({data: response})
        } catch (error) {
            next(error)
        }
    };

    // async addProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const userId = req.params.id;
    //         const profileData = req.body;

    //         const updatedProfile = await this._profileService.addProfile(userId, profileData);
    //         res.status(HttpStatus.OK).json({ message: "Profile updated successfully", data: updatedProfile });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const profileData = req.body;
            console.log('UPDATE PROFILE DATA RECIEVED :', profileData);
            const updatedProfile = await this._profileService.updateProfile(userId, profileData);
            res.status(HttpStatus.OK).json({ message: Messages.PROFILE_UPDATED, data: updatedProfile });
        } catch (error) {
            next(error);
        }
    };

    async uploadProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            if (!req.file) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.NO_FILE });
            }

            const imageUrl = req.file?.path;
            await this._profileService.updateProfile(userId, { profilePic: imageUrl });

            res.status(HttpStatus.OK).json({ message: Messages.PROFILE_PICTURE_UPDATE, imageUrl });
        } catch (error) {
            next(error);
        }
    };
}