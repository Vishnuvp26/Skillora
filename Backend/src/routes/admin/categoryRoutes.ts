import express from 'express';
import { CategoryController } from '../../controllers/admin/categoryController';
import { CategoryService } from '../../services/admin/categoryService';
import { CategoryRepository } from '../../repository/categoryRepository';

const router = express.Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.post('/add-category', categoryController.addCategory.bind(categoryController));
router.put('/edit-category/:id', categoryController.editCategory.bind(categoryController));
router.get('/get-categories', categoryController.getCategory.bind(categoryController));
router.put('/list-category/:id', categoryController.listCategory.bind(categoryController));
router.put('/unlist-category/:id', categoryController.unlistCategory.bind(categoryController));

export default router