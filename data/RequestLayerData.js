let axios = require('axios');
let config = require('../config');

/**
 * 请求geoserver图层数据
 * @param layer 图层名称
 * @returns {AxiosPromise}
 */
function requestLayerData(layer) {
  return axios({
    url: config.geoserver + '/wlxt_beijing/ows',
    method: 'get',
    params: {
      'service': 'WFS',
      'version': '1.0.0',
      'request': 'GetFeature',
      'typeName': 'wlxt_beijing:' + layer,
      'outputFormat': 'application/json'
    }
  });
}

/**
 * 请求geoserver庞各庄图层数据
 * @param {string} layer 图层名称
 */
function requestPgzLayerData(layer) {
  return axios({
    url: config.geoserver + '/other/ows',
    method: 'get',
    params: {
      'service': 'WFS',
      'version': '1.0.0',
      'request': 'GetFeature',
      'typeName': 'other:' + layer,
      'outputFormat': 'application/json'
    }
  });
}
module.exports = {
  requestLayerData,
  requestPgzLayerData
} 