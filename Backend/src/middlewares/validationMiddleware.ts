// import { Request, Response, NextFunction, RequestHandler } from "express";
// import { body, validationResult } from "express-validator";
// import { Messages } from "../constants/messageConstants";
// import { HttpStatus } from "../constants/statusContstants";

// export const validRegistration:RequestHandler[] = [
//     body('name').notEmpty().withMessage(Messages.INVALID_NAME),
//     body('email').isEmail().withMessage(Messages.INVALID_EMAIL),
//     body('password').notEmpty().isLength({ min: 8 }).withMessage(Messages.PASSWORD_LENGTH),
//     body('role').isIn(['freelancer', 'client', 'admin']).withMessage(Messages.INVALID_ROLE),

//     (req: Request, res: Response, next: NextFunction) => {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return res.status(HttpStatus.BAD_REQUEST).json({ erros: errors.array() })
//         }
//         next()
//     }
// ];