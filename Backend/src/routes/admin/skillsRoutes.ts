import express from 'express';
import { SkillsRepository} from '../../repository/skillsRepository';
import { SkillsService } from '../../services/admin/skillsService';
import { SKillsController } from '../../controllers/admin/skillsController';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware';

const router = express.Router();

const skillsRepository = new SkillsRepository()
const skillsService = new SkillsService(skillsRepository);
const skillsController = new SKillsController(skillsService);

router.post(
    '/add-skills',
    authenticateToken, 
    authorizeRoles('admin'), 
    skillsController.addSkills.bind(skillsController)
);

router.put(
    '/edit-skills/:id',
    authenticateToken, 
    authorizeRoles('admin'), 
    skillsController.editSkills.bind(skillsController)
);

router.get(
    '/get-skills',
    skillsController.getSkills.bind(skillsController)
);

router.put(
    '/list-skills/:id',
    authenticateToken, 
    authorizeRoles('admin'), 
    skillsController.listSkills.bind(skillsController)
);

router.put(
    '/unlist-skills/:id',
    authenticateToken, 
    authorizeRoles('admin'), 
    skillsController.unlistSkills.bind(skillsController)
);

export default router