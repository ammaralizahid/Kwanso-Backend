import { Router } from 'express';
import {signUp,signIn} from '../Controller/Auth';

const router = Router();

router.post("/register", signUp);
router.post("/login", signIn);

export default router;
