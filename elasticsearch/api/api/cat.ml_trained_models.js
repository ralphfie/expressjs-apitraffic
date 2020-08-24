/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict'

/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

function buildCatMlTrainedModels (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts

  const acceptedQuerystring = [
    'allow_no_match',
    'from',
    'size',
    'bytes',
    'format',
    'h',
    'help',
    's',
    'time',
    'v'
  ]

  const snakeCase = {
    allowNoMatch: 'allow_no_match'

  }

  /**
   * Perform a cat.ml_trained_models request
   * Gets configuration and usage information about inference trained models.
   * https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-trained-model.html
   */
  return function catMlTrainedModels (params, options, callback) {
    options = options || {}
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (typeof params === 'function' || params == null) {
      callback = params
      params = {}
      options = {}
    }

    // validate headers object
    if (options.headers != null && typeof options.headers !== 'object') {
      const err = new ConfigurationError(`Headers should be an object, instead got: ${typeof options.headers}`)
      return handleError(err, callback)
    }

    var warnings = []
    var { method, body, modelId, model_id, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    if ((model_id || modelId) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_cat' + '/' + 'ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)
    } else {
      if (method == null) method = 'GET'
      path = '/' + '_cat' + '/' + 'ml' + '/' + 'trained_models'
    }

    // build request object
    const request = {
      method,
      path,
      body: null,
      querystring
    }

    options.warnings = warnings.length === 0 ? null : warnings
    return makeRequest(request, options, callback)
  }
}

module.exports = buildCatMlTrainedModels
