import express from 'express';
import { body } from 'express-validator';

import {
  loginController,
  mentorLoginController,
  registerMentorController,
  registerStudentController
} from '../controllers/userController.js';

import {
  createDoubtController,
  deleteDoubtController,
  getAllDoubtsController,
  getDoubtsController,
  getShowOneDoubtsController,
  getStudentDoubtsController,
  replyToDoubtController,
  updateDoubtController
} from '../controllers/doubtController.js';
import { addMessageController, resolveDoubtController } from '../controllers/doubtController.js';

import upload from '../middleware/upload.js';
import protect from '../middleware/auth.js';
import permit from '../middleware/role.js';

const router = express.Router();


// Register as Mentor
// Only an admin can register a mentor
router.post('/register-mentor',protect,  permit('admin'),   
  registerMentorController
);


// Register as Student
router.post('/register-student', registerStudentController);

// Mentor Login
router.post(
  '/login-mentor',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  mentorLoginController
);

// Student Login
router.post('/student-login', loginController);



// Create a doubt (student)
router.post('/doubts', protect, upload.single("image"), createDoubtController);

// Get all doubts for logged-in student
router.get('/doubts', protect, getStudentDoubtsController);

// Get full detail of a specific doubt
router.get('/doubts/:id', protect, getShowOneDoubtsController);

// Mentor reply to a doubt
router.post('/doubts/:id/reply', protect, permit('mentor'), replyToDoubtController);

// Add a chat message to a doubt (student or mentor). Optional image upload.
router.post('/doubts/:id/messages', protect, upload.single('image'), addMessageController);

// Resolve a doubt (student or mentor can mark resolved)
router.post('/doubts/:id/resolve', protect, resolveDoubtController);

// Update doubt (only student can do this)
router.put('/doubts/:id', protect, upload.single("image"), updateDoubtController);

router.delete('/doubts/:id', protect, deleteDoubtController);


// Get all doubts for mentors
router.get('/all-doubts', protect, permit('mentor'), getAllDoubtsController);



export default router;
