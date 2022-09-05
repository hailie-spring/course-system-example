import { searchDocs } from '../models/esclient.mjs'
import { searchCommonDSL } from '../services/esdslservice.mjs'
import { commonErrorReturned, generateIndexPattern } from '../lib/utils.mjs'
import { logger } from '../lib/logger.mjs';

async function search(req, res, next) {
    const dslQuery = searchCommonDSL(req.query);
    logger.info({ req_id: req._id }, `query dsl: ${JSON.stringify(dslQuery)}`);
    const { source, startTime, endTime } = req.query;
    const indexes = generateIndexPattern(source, startTime, endTime);
    try {
        const response = await searchDocs(indexes, dslQuery);
        const hits = response['hits']['hits'];
        const totalValue = response['hits']['total']['value'];
        res.send({
            count: totalValue,
            data: generateResponseBody(hits)
        });
        logger.info({ req_id: req._id }, `search data from source -> ${source} success with totalValue -> ${totalValue}, return counts -> ${hits.length}`);
        next();
    } catch (err) {
        logger.error({ err, req_id: req._id }, `search docs from source -> ${source} error`);
        return commonErrorReturned(500, req, next);
    }
}


function generateResponseBody(hits) {
    const data = []
    for (const hit of hits) {
        data.push(hit._source);
    }
    return data;
}
export const searchRegistrationInfo = search; 