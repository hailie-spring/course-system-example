import express from 'express';
import { insertRegistrationInfo } from '../controllers/registrationcontroller.mjs';
import { validateRegistrationInsert } from '../lib/validator.mjs';
import { authSession } from '../lib/auth.mjs';
const router = express.Router();

router.post('/registration',
    express.json({ limit: 10240 }),
    authSession,
    validateRegistrationInsert,
    insertRegistrationInfo
);

export const registrationRouter = router;