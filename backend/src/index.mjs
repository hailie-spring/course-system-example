import express from 'express';
import createError from 'http-errors';
import helmet from 'helmet';
import cors from 'cors';
import { v4 } from 'uuid';
import { registrationRouter } from './routes/registrationroute.mjs';
import { searchRouter } from './routes/searchroute.mjs';
import { attendanceRouter } from './routes/attendanceroute.mjs';
import { loginRouter } from './routes/loginroute.mjs';
import { logger } from './lib/logger.mjs';
import { hrTimeDurationInMs } from './lib/utils.mjs';

const app = express();
const port = 8000;

app.use(function preRequest(req, res, next) {
    req._id = v4();
    req._timeStart = process.hrtime();
    next();
});

app.use('/course/api/v1', registrationRouter);
app.use('/course/api/v1', searchRouter);
app.use('/course/api/v1', attendanceRouter);
app.use('/course/api/v1', loginRouter);

app.use(function auditLog(req, res, next) {
    const _timeDiff = process.hrtime(req._timeStart);
    const latency = hrTimeDurationInMs(_timeDiff[0], _timeDiff[1]);
    const audit = {
        req_id: req._id,
        remoteAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        remotePort: req.socket.remotePort,
        req: {
            query: req.query,
            method: req.method,
            params: req.params,
            url: req.url,
            body: req.body,
            httpVersion: req.httpVersion,
            headers: req.headers
        },
        res: {
            statusCode: res.statusCode,
            headers: res.getHeaders()
        },
        msg: `handled: ${res.statusCode}`,
        latency
    }
    logger.info(
        audit
    );
});

app.use(function formatErrorBody(err, req, res, next) {
    const _timeDiff = process.hrtime(req._timeStart);
    const latency = hrTimeDurationInMs(_timeDiff[0], _timeDiff[1]);
    const audit = {
        req_id: req._id,
        remoteAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        remotePort: req.socket.remotePort,
        req: {
            query: req.query,
            method: req.method,
            params: req.params,
            url: req.url,
            // body: req.body,
            httpVersion: req.httpVersion,
            headers: req.headers
        },
        res: {
            statusCode: err.statusCode,
            headers: res.getHeaders()
        },
        latency
    }
    audit.err = {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: err.code
    }
    // audit.msg = `handled: ${err.statusCode}`;
    logger.info(
        audit, `handled: ${err.statusCode}`
    );
    if (createError.isHttpError(err)) {
        let formattedError = {
            status: err.statusCode,
            message: err.message
        }
        return res.status(err.statusCode).json(formattedError);
    }
    next(err);
});

app.listen(port, function () {
    logger.info(`course-system-example listening on port ${port}!`)
});