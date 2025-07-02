
import bcrypt from 'bcryptjs';
import generateToken from '../utils/genrateToken.js'
import { validationResult } from 'express-validator';
import userModel from '../models/userModel.js';

export const registerStudentController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, mobile } = req.body;

  try {
    const existing = await userModel.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      mobile, 
      role: 'student'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error("Register Student Error:", err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


export const registerMentorController = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    // Check if user already exists
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new mentor
    const user = await userModel.create({
      name,
      email,
      mobile, 
      password: hashedPassword,
      role: 'mentor',
    });

 
    res.status(201).json({
      message: 'Mentor registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Mentor registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const mentorLoginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user || user.role !== 'mentor') {
      return res.status(401).json({ message: 'Access denied. Not a mentor.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error("Mentor Login Error:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

