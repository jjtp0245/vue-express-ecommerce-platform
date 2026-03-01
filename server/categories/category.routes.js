import { Router } from "express";
import * as categoryController from "./category.controller.js";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:category_id", categoryController.getCategoryById);
router.post("/add", categoryController.insertCategory);
router.put("/update/:category_id", categoryController.updateCategory);
router.delete("/delete/:category_id", categoryController.deleteCategory);

export default router;
