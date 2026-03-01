import BrandService from "./brand.service.js";

// ดึงข้อมูลแบรนด์ทั้งหมด
export const getBrands = async (req, res) => {
    try {
        const result = await new BrandService().getBrands();
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

// ดึงข้อมูลแบรนด์ตาม ID
export const getBrandById = async (req, res) => {
    const { brand_id } = req.params;
    try {
        const result = await new BrandService().getBrandById(brand_id);
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
                message: "Brand not found",
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

// เพิ่มแบรนด์ใหม่
export const insertBrand = async (req, res) => {
    const { brand_name } = req.body;

    if (!brand_name) {
        return res.status(400).send({
            status: "fail",
            code: 0,
            message: "Brand name is required",
            result: "",
        });
    }

    const brand = { brand_name };

    try {
        const result = await new BrandService().insertBrand(brand);
        if (result.insertId) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Brand added successfully",
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

// อัปเดตข้อมูลแบรนด์
export const updateBrand = async (req, res) => {
    const { brand_id } = req.params;
    const { brand_name } = req.body;

    const brand = { brand_name };

    try {
        const result = await new BrandService().updateBrand(brand_id, brand);
        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Brand updated successfully",
                result: result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "Brand not found",
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

// ลบแบรนด์
export const deleteBrand = async (req, res) => {
    const { brand_id } = req.params;

    try {
        await new BrandService().deleteBrand(brand_id);
        res.status(200).send({
            status: 'success',
            message: 'Brand and related products deleted successfully',
        });
    } catch (error) {
        console.error("Error deleting brand:", error); // แสดงข้อผิดพลาดใน console
        res.status(500).send({
            status: 'error',
            message: 'Failed to delete brand',
            cause: error.message,
        });
    }
};

export const getBrandCount = async (req, res) => {
    try {
        const count = await new BrandService().countBrands();
        res.status(200).send({
            status: "success",
            code: 1,
            result: {
                totalBrands: count,
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