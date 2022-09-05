import express from 'express';
import { searchRegistrationInfo } from '../controllers/searchcontroller.mjs';
import { validateSearchBody } from '../lib/validator.mjs';
import { authSession } from '../lib/auth.mjs';
const router = express.Router();

router.get('/search',
    authSession,
    validateSearchBody,
    searchRegistrationInfo
);

export const searchRouter = router;