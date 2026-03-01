import AddressService from './address.service.js';

// ดึงข้อมูลที่อยู่ของผู้ใช้
export const getAddresses = async (req, res) => {
    const { user_id } = req.query;

    try {
        const result = await new AddressService().getAddressesByUserId(user_id);
        res.status(200).send({
            status: 'success',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

// ดึงข้อมูลที่อยู่จาก address_id
export const getAddressById = async (req, res) => {
    const { address_id } = req.params;

    try {
        const result = await new AddressService().getAddressById(address_id);
        res.status(200).send({
            status: 'success',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

// เพิ่มที่อยู่ใหม่
export const insertAddress = async (req, res) => {
    console.log("Received data:", req.body);
    const { recipient_name, address, telephone, sub_district, district, province, postcode, user_id } = req.body;

    if (!recipient_name || !address || !telephone) {
        return res.status(400).send({
            status: "error",
            message: "Missing required fields"
        });
    }

    const newAddress = {
        recipient_name,
        address,
        telephone,
        sub_district,
        district,
        province,
        postcode,
        user_id,
    };

    try {
        const result = await new AddressService().insertAddress(newAddress);
        res.status(200).send({
            status: 'success',
            message: 'Address added successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

// อัปเดตข้อมูลที่อยู่
export const updateAddress = async (req, res) => {
    const { address_id } = req.params;
    const { recipient_name, address, telephone, sub_district, district, province, postcode, user_id } = req.body;

    const updatedAddress = {
        recipient_name,
        address,
        telephone,
        sub_district,
        district,
        province,
        postcode,
        user_id,
    };

    try {
        const result = await new AddressService().updateAddress(address_id, updatedAddress);
        res.status(200).send({
            status: 'success',
            message: 'Address updated successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

// ลบที่อยู่
export const deleteAddress = async (req, res) => {
    const { address_id } = req.params;

    try {
        const result = await new AddressService().deleteAddress(address_id);
        res.status(200).send({
            status: 'success',
            message: 'Address deleted successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};
// ตั้งค่าที่อยู่เป็นค่าเริ่มต้น
export const setDefaultAddress = async (req, res) => {
    const { address_id, user_id } = req.body;

    if (!address_id || !user_id) {
        return res.status(400).send({
            status: 'error',
            message: 'Missing address_id or user_id',
        });
    }

    try {
        const addressService = new AddressService();

        // ตั้งค่าที่อยู่เดิมทั้งหมดของผู้ใช้นี้ให้ไม่เป็นค่าเริ่มต้น
        await addressService.clearDefaultAddress(user_id);

        // ตั้งค่าที่อยู่ที่เลือกเป็นค่าเริ่มต้น
        const result = await addressService.setDefaultAddress(address_id);

        res.status(200).send({
            status: 'success',
            message: 'Address set as default successfully',
            result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

export const getDefaultAddress = async (req, res) => {
    const { userId } = req.params;
    const addressService = new AddressService();

    try {
        if (!userId) {
            return res.status(400).json({ status: 'error', message: 'user_id is required' });
        }

        const address = await addressService.getDefaultAddressByUserId(userId);
        if (!address) {
            return res.status(404).json({ status: 'fail', result: 'No default address found for this user' });
        }

        res.status(200).json({ status: 'success', result: address });
    } catch (error) {
        console.error('Error fetching default address:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching default address' });
    }
};



