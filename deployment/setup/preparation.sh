#!/bin/bash

function putEsTemplate() {
    set -o allexport
    source .env
    set +o allexport
    baseCurl="curl --insecure -u ${ELASTIC_USERNAME}:${ELASTIC_PASSWORD} "
    baseUrl="https://localhost:${ELASTICSEARCH_PORT}"
    #set -x
    until $(${baseCurl} -o /dev/null -s --head --fail -X GET ${baseUrl}); do
        echo "Waiting for ES to start..."
        sleep 5
    done
    for file_path in $(find ./estemplate/ -name '*.json' -type f); do
        echo "${file_path}" | grep "\-policy.json" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            # policy
            es_policy_name=$(basename ${file_path} | awk -F'.' '{print $1}')
            ${baseCurl} \
                -X PUT "${baseUrl}/_ilm/policy/${es_policy_name}" \
                -H 'Content-Type: application/json' \
                -d @${file_path}
        else
            # template
            es_template_name=$(basename ${file_path} | awk -F'.' '{print $1}')
            ${baseCurl} \
                -X PUT "${baseUrl}/_template/${es_template_name}?pretty" \
                -H 'Content-Type: application/json' \
                -d @${file_path}
        fi
    done
}

putEsTemplate