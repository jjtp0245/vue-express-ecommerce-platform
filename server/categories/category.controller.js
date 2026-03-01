import CategoryService from "./category.service.js";

// ดึงข้อมูลหมวดหมู่ทั้งหมด
export const getCategories = async (req, res) => {
    try {
        const result = await new CategoryService().getCategories();
        res.status(200).send({
            status: "success",
            code: 1,
            result: result,
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

// ดึงข้อมูลหมวดหมู่ตาม ID
export const getCategoryById = async (req, res) => {
    const { category_id } = req.params;
    try {
        const result = await new CategoryService().getCategoryById(category_id);
        if (result.length > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                result: result[0],
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Category not found",
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

// เพิ่มหมวดหมู่ใหม่
export const insertCategory = async (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).send({
            status: "fail",
            code: 0,
            message: "Category name is required",
            result: "",
        });
    }

    const category = { category_name };

    try {
        const result = await new CategoryService().insertCategory(category);
        if (result.insertId) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Category added successfully",
                result: result,
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

// อัปเดตข้อมูลหมวดหมู่
export const updateCategory = async (req, res) => {
    const { category_id } = req.params;
    const { category_name } = req.body;

    const category = { category_name };

    try {
        const result = await new CategoryService().updateCategory(category_id, category);
        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Category updated successfully",
                result: result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Category not found",
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

// ลบหมวดหมู่
export const deleteCategory = async (req, res) => {
    const { category_id } = req.params;

    try {
        const result = await new CategoryService().deleteCategory(category_id);
        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Category deleted successfully",
                result: result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Category not found",
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
