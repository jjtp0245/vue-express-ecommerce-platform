import UserService from "./user.service.js";
import md5 from "md5";

export const getUsers = async (req, res) => {
    try {
        const result = await new UserService().getUsers();
        if (result.length > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "",
                cause: "",
                result: result,
            });
        } else {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "No data found",
                cause: "",
                result: "",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};

export const loginuser = async (req, res) => {
    const { email, password } = req.body;
    const Passwordhand = md5(password); // เข้ารหัสรหัสผ่านเป็น MD5
    console.log(email, password);
    try {
        const result = await new UserService().loginuser(email, Passwordhand); // ใช้ Passwordhand ที่ถูกเข้ารหัส
        if (result.length > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "",
                cause: "",
                result: result,
            });
        } else {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "No data found",
                cause: "",
                result: "",
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};

export const udpassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const newPasswordHash = md5(newPassword);

    try {
        const user = await new UserService().getUserByEmail(email);

        if (!user) {
            return res.status(400).send({
                status: "fail",
                code: 0,
                message: "This email is not registered",
                result: ""
            });
        }

        // อัปเดตรหัสผ่านใหม่
        const result = await new UserService().updatePassword(email, newPasswordHash);

        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "Password updated successfully",
                result: result,
            });
        } else {
            res.status(500).send({
                status: "error",
                code: 0,
                message: "Failed to update password",
                result: "",
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            result: "",
        });
    }
};

export const deleteUser = async (req, res) => {
    const { user_id } = req.params;  // รับ user_id จาก URL parameter

    try {
        const result = await new UserService().deleteUser(user_id);

        if (result.affectedRows > 0) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "User deleted successfully",
                result: result,
            });
        } else {
            res.status(404).send({
                status: "fail",
                code: 0,
                message: "User not found",
                result: "",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            code: 0,
            message: "Internal Server Error",
            cause: error.message,
            result: "",
        });
    }
};

export const userRegister = async (req, res) => {
    // ตรวจสอบค่าของ password ก่อนเข้ารหัส
    if (!req.body.password) {
        return res.status(400).send({
            status: "fail",
            message: "Password is required",
        });
    }

    const user = {
        username: req.body.username,
        password: md5(req.body.password),
        email: req.body.email,
        phone_number: null,
        profile_image: null,
    };

    try {
        const result = await new UserService().userRegister(user);
        if (result.insertId) {
            res.status(200).send({
                status: "success",
                code: 1,
                message: "ลงทะเบียนผู้ใช้สำเร็จ",
                result,
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "fail",
            code: 0,
            message: error.message,
        });
    }
};

export const getUserProfile = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await new UserService().getUserByEmail(email);
        if (user.length > 0) {
            let profile_image = user[0].profile_image
                ? `/uploads/${user[0].profile_image}`
                : '/uploads/default-profile.jpg';

            res.status(200).json({
                status: "success",
                data: {
                    ...user[0],
                    profile_image: user[0].profile_image ? `/uploads/${user[0].profile_image}` : '/uploads/default-profile.jpg'
                }
            });
        } else {
            res.status(404).json({ status: "error", message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { username, phone_number, email } = req.body;
    let profile_image = req.savedFileName ? req.savedFileName : null;  // แก้จาก req.savedFilename เป็น req.savedFileName

    const data = {};
    if (username) data.username = username;
    if (phone_number) data.phone_number = phone_number;
    if (profile_image) {
        data.profile_image = profile_image;  // บันทึกชื่อไฟล์จริงลงในฐานข้อมูล
    }

    if (email) data.email = email;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'No data provided for update.'
        });
    }
    try {
        const result = await new UserService().updateUserProfile(req.params.email, data);
        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            result: result,
            profile_image: `/uploads/${profile_image}`
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to update profile',
            error: error.message
        });
    }
};
