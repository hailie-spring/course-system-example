import express from 'express';
import { checkSignInState, checkSignUpState, insertLoginInfo, updateLoginInfo, returnSignInResult, destroySession } from '../controllers/logincontroller.mjs';
import { validateLoginOperation, validateLoginUpdate } from '../lib/validator.mjs';
import { authSession } from '../lib/auth.mjs';
const router = express.Router();

router.get('/healthcheck',
    function (req, res, next) {
        res.send({
            message: 'welcome to course system example backend'
        });
        next();
    }
);

router.post('/signin',
    express.json({ limit: 10240 }),
    validateLoginOperation,
    checkSignInState,
    returnSignInResult
);

router.post('/signup',
    express.json({ limit: 10240 }),
    validateLoginOperation,
    checkSignUpState,
    insertLoginInfo,
    returnSignInResult
);

router.patch('/signup',
    express.json({ limit: 10240 }),
    authSession,
    validateLoginOperation,
    validateLoginUpdate,
    checkSignInState,
    updateLoginInfo
);

router.get('/signout',
    express.json({ limit: 10240 }),
    authSession,
    destroySession
);

export const loginRouter = router;