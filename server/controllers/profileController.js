const User = require("../models/User");

// Fetch User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -otp -otpExpires");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Profile fetched successfully", data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, department, designation } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if(req.file){
            user.profilePicture = `/uploads/${req.file.filename}`;
        }
        // Update Fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (department) user.department = department;
        if (designation) user.designation = designation;

        await user.save();
        res.json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
