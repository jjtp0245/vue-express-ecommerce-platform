import multer from 'multer';
import path from 'path';

// ตั้งค่า multer สำหรับการจัดการอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'users/uploads/');  // เส้นทางสำหรับบันทึกไฟล์
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);  // ตั้งชื่อไฟล์ด้วย timestamp และนามสกุลเดิม
        req.savedFileName = uniqueSuffix;  // บันทึกชื่อไฟล์ลงใน req เพื่อใช้ในภายหลัง
        cb(null, uniqueSuffix);  // บันทึกไฟล์ด้วยชื่อที่ไม่ซ้ำกัน
    }
});

// ฟังก์ชันตรวจสอบนามสกุลไฟล์
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');  // หากไม่ใช่ภาพประเภทที่กำหนด
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },  // ขนาดไฟล์สูงสุด 5MB
    fileFilter: fileFilter
});

export default upload;
