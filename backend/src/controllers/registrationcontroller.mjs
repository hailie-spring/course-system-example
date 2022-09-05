import { createDoc } from '../models/esclient.mjs'
import { commonErrorReturned } from '../lib/utils.mjs'
import { logger } from '../lib/logger.mjs';
import { REGISTRATION_INDEX_PREFIX } from '../config/config.mjs'

async function insert(req, res, next) {
    const index = `${REGISTRATION_INDEX_PREFIX}-${new Date().toISOString().split('T')[0]}`;
    try {
        const response = await createDoc(req.body.contractNumber, index, req.body);
        logger.warn({ req_id: req._id }, `create new contract success by constractNumber -> ${req.body.contractNumber} to index ->${index} with result -> ${response.result}`);
        res.send({
            code: 200,
            message: 'create contract success'
        });
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id }, `create docId -> ${req.body.contractNumber} to es index -> ${index} error`);
        return commonErrorReturned(500, req, next);
    }
}

export const insertRegistrationInfo = insert;