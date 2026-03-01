import { Router } from "express";
import * as brandController from "./brand.controller.js";

const router = Router();

router.get("/", brandController.getBrands);
router.get("/:brand_id", brandController.getBrandById);
router.post("/add", brandController.insertBrand);
router.put("/update/:brand_id", brandController.updateBrand);
router.delete("/delete/:brand_id", brandController.deleteBrand);
router.get("/count", brandController.getBrandCount);

export default router;
