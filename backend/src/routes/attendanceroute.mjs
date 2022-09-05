import express from 'express';
import { checkExistContract, insertAttendanceInfo, updateUsedQuantityInfo, updateAttendanceInfo } from '../controllers/attendancecontroller.mjs';
import { validateAttendanceInsert, validateAttendancePatch } from '../lib/validator.mjs';
import { authSession } from '../lib/auth.mjs';

const router = express.Router();

router.post('/attendance',
    express.json({ limit: 10240 }),
    authSession,
    validateAttendanceInsert,
    checkExistContract,
    insertAttendanceInfo,
    updateUsedQuantityInfo
);

router.patch('/attendance',
    express.json({ limit: 10240 }),
    authSession,
    validateAttendancePatch,
    updateAttendanceInfo
);

export const attendanceRouter = router;