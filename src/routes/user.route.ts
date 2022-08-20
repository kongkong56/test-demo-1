import express from 'express';

// import authMiddleware from '../middleware/auth';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  userLogin
} from '../controllers/user.controller';
import { verifyAuthToken } from '../middleware/auth.middleware';

const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', verifyAuthToken, deleteUser);
router.put('/:id', verifyAuthToken, updateUser);
router.get('/:id', getUser);
router.post('/login', userLogin);

export default router;
