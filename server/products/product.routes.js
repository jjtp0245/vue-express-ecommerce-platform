import { Router } from "express";
import * as productController from "./product.controller.js";

const router = Router();

router.get("/", productController.getProducts);
router.post("/add", productController.insertProduct); // ไม่ต้องใช้ upload.single
router.put("/update/:product_id", productController.updateProduct); // ไม่ต้องใช้ upload.single
router.delete("/delete/:product_id", productController.deleteProduct);
router.get("/search", productController.searchProducts);
router.get("/:product_id", productController.getProduct);
router.get("/count", productController.getCounts);

export default router;
