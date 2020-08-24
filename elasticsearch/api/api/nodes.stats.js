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

function buildNodesStats (opts) {
  // eslint-disable-next-line no-unused-vars
  const { makeRequest, ConfigurationError, handleError, snakeCaseKeys } = opts

  const acceptedQuerystring = [
    'completion_fields',
    'fielddata_fields',
    'fields',
    'groups',
    'level',
    'types',
    'timeout',
    'include_segment_file_sizes',
    'pretty',
    'human',
    'error_trace',
    'source',
    'filter_path'
  ]

  const snakeCase = {
    completionFields: 'completion_fields',
    fielddataFields: 'fielddata_fields',
    includeSegmentFileSizes: 'include_segment_file_sizes',
    errorTrace: 'error_trace',
    filterPath: 'filter_path'
  }

  /**
   * Perform a nodes.stats request
   * Returns statistical information about nodes in the cluster.
   * https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-nodes-stats.html
   */
  return function nodesStats (params, options, callback) {
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
    var { method, body, nodeId, node_id, metric, indexMetric, index_metric, ...querystring } = params
    querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring, warnings)

    var ignore = options.ignore
    if (typeof ignore === 'number') {
      options.ignore = [ignore]
    }

    var path = ''

    if ((node_id || nodeId) != null && (metric) != null && (index_metric || indexMetric) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index_metric || indexMetric)
    } else if ((node_id || nodeId) != null && (metric) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats' + '/' + encodeURIComponent(metric)
    } else if ((metric) != null && (index_metric || indexMetric) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_nodes' + '/' + 'stats' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index_metric || indexMetric)
    } else if ((node_id || nodeId) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats'
    } else if ((metric) != null) {
      if (method == null) method = 'GET'
      path = '/' + '_nodes' + '/' + 'stats' + '/' + encodeURIComponent(metric)
    } else {
      if (method == null) method = 'GET'
      path = '/' + '_nodes' + '/' + 'stats'
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

module.exports = buildNodesStats
