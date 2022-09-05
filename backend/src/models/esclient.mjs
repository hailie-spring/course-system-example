'use strict'

import { Client } from '@elastic/elasticsearch';
import { config } from '../config/config.mjs';
import { readFileSync } from 'node:fs';

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html
// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/basic-config.html
const esConfig = config.es;
esConfig.tls = {
    ca: readFileSync('./models/ca.crt'),
    rejectUnauthorized: false
}
const client = new Client(esConfig);

export async function createDoc(id, index, body) {
    return await client.create({
        id,
        index,
        refresh: true,
        body
    });
}

export async function updateDoc(id, index, body) {
    return await client.update({
        id: id,
        index: index,
        refresh: 'true',
        timeout: '30s',
        retry_on_conflict: 5,
        body: body
    });
}

export async function updateDocByQuery(index, body) {
    return await client.updateByQuery({
        index: index,
        refresh: 'true',
        timeout: '30s',
        conflicts: 'abort',
        body: body
    });
}

export async function searchDocs(index, body) {
    return await client.search({
        index,
        body
    });
}
