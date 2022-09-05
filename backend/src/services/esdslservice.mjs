import { REGISTRATION_INDEX_PREFIX, ATTENDANCE_INDEX_PREFIX } from '../config/config.mjs';

export function searchCommonDSL(parameters) {
    const { search_after, fieldName, courseName, fieldValue, size, startTime, endTime, source } = parameters;
    const query = {
    };
    query.size = size;
    if (search_after) {
        query['search_after'] = search_after;
    }
    query.sort = [
        { gmtCreated: { order: 'desc', format: 'strict_date_optional_time' } },
    ]
    if (source === REGISTRATION_INDEX_PREFIX) {
        query.sort.push({
            contractNumber: { order: 'desc' }
        });
    } else if (source === ATTENDANCE_INDEX_PREFIX) {
        query.sort.push({
            docId: { order: 'desc' }
        });
    }
    query['track_total_hits'] = true;
    query.query = {
        constant_score: {
            filter: { bool: { must: [generateRangeQuery('gmtCreated', startTime, endTime)] } }
        }
    }
    if (courseName) {
        query.query.constant_score.filter.bool.must.push(
            generateTermQuery('courseName', courseName)
        );
    }
    if (fieldValue && fieldName) {
        query.query.constant_score.filter.bool.must.push(
            generateWildcardQuery(fieldName, fieldValue)
        );
    }
    return query;
}

export function searchExistRegistrationDSL(parameters) {
    const query = {
    };
    query.size = 1;
    query['track_total_hits'] = false;
    const conditions = [];
    for (const [key, value] of Object.entries(parameters)) {
        conditions.push(generateTermQuery(key, value));
    }
    query.query = {
        constant_score: {
            filter: { bool: { must: conditions } }
        }
    }
    return query;
}

function generateRangeQuery(filedName, start, end) {
    return {
        range: {
            [filedName]: {
                gte: start,
                lte: end
            }
        }
    }
}
function generateTermQuery(fieldName, value) {
    return {
        term: {
            [fieldName]: value
        }
    }
}

function generateWildcardQuery(fieldName, value) {
    return {
        wildcard: {
            [fieldName]: {
                value: `*${value}*`
            }
        }
    }
}

function generateOrQuery(parameters) {
    const orQuery = { bool: { should: [] } };
    for (const [filedName, value, isWildcard] of Object.entries(parameters)) {
        if (!isWildcard) {
            orQuery.bool.should.push(generateTermQuery(filedName, value));
        } else {
            orQuery.bool.should.push(generateWildcardQuery(filedName, value));
        }
    }
}
