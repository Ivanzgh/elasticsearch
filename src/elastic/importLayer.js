let requestLayerData = require("../../data/RequestLayerData").requestLayerData;
let insert = require("./insert");

/**
 * 将图层的数据导入 elasticsearch
 * @param layer
 * @returns {Promise<ApiResponse<any>>}
 */
async function importLayer(layer) {
  let result;
  try {
    result = await requestLayerData(layer);
  } catch (e) {
    return null;
  }

  let geotype;
  try {
    geotype = result.data.features[0]["geometry"]["type"].toLowerCase();
  } catch (e) {
    return null;
  }

  if (geotype == "point") {
    geotype = "geo_point";
  } else {
    geotype = "geo_shape";
  }

  return insert.mulityInsert(layer, result, geotype);
}

module.exports.importLayer = importLayer;
