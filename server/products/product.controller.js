import ProductService from './product.service.js';

// ดึงข้อมูลสินค้าทั้งหมด
export const getProducts = async (req, res) => {
    try {
        const result = await new ProductService().getProducts();
        res.status(200).send({
            status: "success",
            code: 1,
            message: result.length > 0 ? "" : "No products found",
            result: result.length > 0 ? result : [],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            result: "",
        });
    }
};

// ดึงข้อมูลสินค้าจาก id
export const getProduct = async (req, res) => {
    const { product_id } = req.params;

    try {
        const product = await new ProductService().getProductById(product_id);
        if (product) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "",
                result: product,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Product not found",
                result: "",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            result: "",
        });
    }
};
// เพิ่มสินค้าใหม่
export const insertProduct = async (req, res) => {
    const { product_name, description, price, category_id, brand_id, image_url } = req.body;

    const product = {
        product_name,
        description,
        price,
        category_id,
        brand_id,
        image_url // ใช้ URL ของภาพที่ได้รับจาก Body
    };

    try {
        const result = await new ProductService().insertProduct(product);
        res.status(201).send({
            status: "success",
            message: "Product added successfully",
            result: { id: result.insertId, ...product },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};

// อัปเดตสินค้า
export const updateProduct = async (req, res) => {
    const { product_id } = req.params;
    const { product_name, description, price, category_id, brand_id, image_url } = req.body;

    const product = {
        product_name,
        description,
        price,
        category_id,
        brand_id,
        image_url // ใช้ URL ของภาพที่ได้รับจาก Body
    };

    try {
        const result = await new ProductService().updateProduct(product_id, product);
        if (result.affectedRows > 0) {
            res.status(200).send({ status: "success", message: "Product updated successfully" });
        } else {
            res.status(404).send({ status: "fail", message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    const { product_id } = req.params;

    try {
        const result = await new ProductService().deleteProduct(product_id);
        if (result.affectedRows > 0) {
            res.status(200).send({ status: "success", message: "Product deleted successfully" });
        } else {
            res.status(404).send({ status: "fail", message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
};

// ค้นหาสินค้า
export const searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        const result = await new ProductService().searchProducts(query);
        res.status(200).send({
            status: "success",
            code: 1,
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            result: "",
        });
    }
};

// นับจำนวนสินค้า
export const getCounts = async (req, res) => {
    console.log("getCounts called");
    try {
        const productCount = await new ProductService().countProducts();
        res.status(200).send({
            status: "success",
            code: 1,
            result: {
                totalProducts: productCount,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            result: "",
        });
    }
};
