import { v4 as uuidv4 } from 'uuid';
import { searchDocs, updateDoc, updateDocByQuery } from '../models/esclient.mjs'
import { searchExistRegistrationDSL } from '../services/esdslservice.mjs'
import { commonErrorReturned } from '../lib/utils.mjs'
import { logger } from '../lib/logger.mjs';
import { REGISTRATION_INDEX_PREFIX, ATTENDANCE_INDEX_PREFIX } from '../config/config.mjs'

export async function checkExistContract(req, res, next) {
    const dslQuery = searchExistRegistrationDSL({
        contractNumber: req.body.contractNumber,
        telephoneNumber: req.body.telephoneNumber, studentName: req.body.studentName, courseName: req.body.courseName
    });
    logger.info({ req_id: req._id }, `query dsl: ${JSON.stringify(dslQuery)}`);
    try {
        const response = await searchDocs(`${REGISTRATION_INDEX_PREFIX}-*`, dslQuery);
        const hits = response['hits']['hits'];
        if (hits.length === 0) {
            logger.warn({ req_id: req._id }, `contractNumber -> ${req.body.contractNumber} not exist in ${REGISTRATION_INDEX_PREFIX}-*, need to sign contract first`);
            return commonErrorReturned(400, req, next);
        } else if (hits.length > 1) {
            logger.warn({ req_id: req._id }, `contractNumber -> ${req.body.contractNumber} exist repeated data in ${REGISTRATION_INDEX_PREFIX}-*, need to check`);
        }
        const totalQuantity = hits[0]._source.totalQuantity;
        const consumedQuantity = hits[0]._source.consumedQuantity;
        if (consumedQuantity >= totalQuantity) {
            logger.warn({ req_id: req._id }, `contractNumber -> ${req.body.contractNumber} already consumed all classes, need to remider customer to renew`);
            return commonErrorReturned(400, req, next);
        }
        req.body.indexName = hits[0]._index;
        logger.warn({ req_id: req._id }, `found contractNumber -> ${req.body.contractNumber} in index -> ${hits[0]._index}, begin to create a new attendance record`);
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id }, `check contractNumber -> ${contractNumber} whether exist error`);
        return commonErrorReturned(500, req, next);
    }
}

export async function insertAttendanceInfo(req, res, next) {
    const index = `${ATTENDANCE_INDEX_PREFIX}-${new Date().toISOString().split('T')[0]}`;
    const docId = uuidv4();
    try {
        const body = {
            script: {
                source: 'ctx._source.evaluation = params.evaluation',
                lang: 'painless',
                params: {
                    evaluation: req.body.evaluation
                }
            },
            upsert: {
                contractNumber: req.body.contractNumber,
                telephoneNumber: req.body.telephoneNumber,
                studentName: req.body.studentName,
                courseName: req.body.courseName,
                schoolDate: req.body.schoolDate,
                startSchoolTime: req.body.startSchoolTime,
                endSchoolTime: req.body.endSchoolTime,
                evaluation: req.body.evaluation,
                gmtCreated: req.body.gmtCreated,
                docId
            }
        }
        const response = await updateDoc(docId, index, body);
        logger.warn({ req_id: req._id }, `create attendace record success by docId -> ${docId} to index -> ${index} with result -> ${response.result}, begin to consume the class quantity`);
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id }, `create docId -> ${docId} to es index -> ${index} error`);
        return commonErrorReturned(500, req, next);
    }
}

export async function updateAttendanceInfo(req, res, next) {
    const index = `${ATTENDANCE_INDEX_PREFIX}-*`;
    try {
        const body = {
            script: {
                source: 'ctx._source.evaluation = params.evaluation',
                lang: 'painless',
                params: {
                    evaluation: req.body.evaluation
                }
            },
            query: {
                term: {
                    docId: req.body.docId
                }
            }
        }
        const response = await updateDocByQuery(index, body);
        logger.warn({ req_id: req._id }, `update attendance evaluation success by docID -> ${req.body.docId} to index -> ${index} with result -> ${response.result}`);
        res.send({
            code: 200,
            message: 'update attendance success'
        });
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id }, `update evaluation to  docId -> ${req.body.docId} to es index -> ${index} error`);
        return commonErrorReturned(500, req, next);
    }
}

export async function updateUsedQuantityInfo(req, res, next) {
    const contractNumber = req.body.contractNumber;
    try {
        const body = {
            script: {
                source: 'ctx._source.consumedQuantity += 1',
                lang: 'painless'
            }
        }
        const response = await updateDoc(contractNumber, req.body.indexName, body);
        logger.warn({ req_id: req._id }, `consumed the quantity from constractNumber -> ${contractNumber} success with result -> ${response.result}`);
        res.send({
            code: 200,
            message: 'insert attendance success'
        });
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id }, `create docId -> ${contractNumber} to es index -> ${index} error`);
        return commonErrorReturned(500, req, next);
    }
}
