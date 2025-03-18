import express from 'express';
import { CategoryController } from '../../controllers/admin/categoryController';
import { CategoryService } from '../../services/admin/categoryService';
import { CategoryRepository } from '../../repository/categoryRepository';
import { authenticateToken, authorizeRoles } from '../../middlewares/authMiddleware'; // Import middleware

const router = express.Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.post(
    '/add-category', 
    authenticateToken, 
    authorizeRoles('admin'), 
    categoryController.addCategory.bind(categoryController)
);

router.put(
    '/edit-category/:id', 
    authenticateToken, 
    authorizeRoles('admin'), 
    categoryController.editCategory.bind(categoryController)
);

router.get(
    '/get-categories', 
    categoryController.getCategory.bind(categoryController)
);

router.put(
    '/list-category/:id', 
    authenticateToken, 
    authorizeRoles('admin'), 
    categoryController.listCategory.bind(categoryController)
);

router.put(
    '/unlist-category/:id', 
    authenticateToken, 
    authorizeRoles('admin'), 
    categoryController.unlistCategory.bind(categoryController)
);

export default router;