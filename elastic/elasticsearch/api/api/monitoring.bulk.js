// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

'use strict'

/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

function buildMonitoringBulk (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts

  const acceptedQuerystring = [
    'system_id',
    'system_api_version',
    'interval'
  ]

  const snakeCase = {
    systemId: 'system_id',
    systemApiVersion: 'system_api_version'

  }

  /**
   * Perform a monitoring.bulk request
   * Used by the monitoring features to send monitoring data.
   * https://www.elastic.co/guide/en/elasticsearch/reference/master/monitor-elasticsearch-cluster.html
   */
  return function monitoringBulk (params, options, callback) {
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

    // check required parameters
    if (params['body'] == null) {
      const err = new ConfigurationError('Missing required parameter: body')
      return handleError(err, callback)
    }

    // validate headers object
    if (options.headers != null && typeof options.headers !== 'object') {
      const err = new ConfigurationError(`Headers should be an object, instead got: ${typeof options.headers}`)
      return handleError(err, callback)
    }

    var warnings = []
    var { method, body, type, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    if ((type) != null) {
      if (method == null) method = 'POST'
      path = '/' + '_monitoring' + '/' + encodeURIComponent(type) + '/' + 'bulk'
    } else {
      if (method == null) method = 'POST'
      path = '/' + '_monitoring' + '/' + 'bulk'
    }

    // build request object
    const request = {
      method,
      path,
      bulkBody: body,
      querystring
    }

    options.warnings = warnings.length === 0 ? null : warnings
    return makeRequest(request, options, callback)
  }
}

module.exports = buildMonitoringBulk
