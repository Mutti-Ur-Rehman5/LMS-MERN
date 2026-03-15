import User from '../models/User.js';      // students/teachers
import Admin from '../models/Admin.js';    // separate admin collection
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ------------------ REGISTER ------------------
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ❌ Prevent frontend from creating admin
        if(role === 'admin'){
            return res.status(403).json({ error: "Cannot register admin from frontend" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (student/teacher)
        const newUser = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------ LOGIN ------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user;
        let role;

        // 1️⃣ Check admin collection first
        const admin = await Admin.findOne({ email });
        if(admin){
            user = admin;
            role = 'admin';
        } else {
            // 2️⃣ Then check normal users collection
            user = await User.findOne({ email });
            role = user?.role;
        }

        if(!user) return res.status(400).json({ error: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ error: "Invalid password" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: "Login success",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};