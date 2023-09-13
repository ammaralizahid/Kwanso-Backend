import { Router } from 'express';
import {createTask,getTask,getUser} from '../Controller/Controller';
import { verifyToken } from '../Utils/SharedFunc';

const router = Router();

router.post("/create-task", verifyToken, createTask);
router.get("/list-tasks",verifyToken, getTask);
router.get("/user",verifyToken, getUser);

export default router;
