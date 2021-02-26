const { Client } = require("@elastic/elasticsearch");
const config = require("../../config");
const client = new Client({ node: config.elasticsearch });

/**
 * elasticsearch 创建index以及mapping 封装的是地理数据 点数据
 * @param name index 的名称
 * @param type 地理数据的类型 一般传 geo_point
 * @returns {Promise<ApiResponse<any>>}
 */
function indicesCreate(name, type) {
  return client.indices.create({
    index: name,
    body: {
      mappings: {
        properties: {
          "geometry.coordinates": {
            type: type,
          },
        },
      },
    },
  });
}

/**
 * elasticsearch 创建index以及mapping 封装的是地理数据 形状数据
 * @param name name index 的名称
 * @param type 地理数据的类型 一般传 geo_shape
 * 可以插入的地理数据类型有：point、linestring、polygon、multipoint、multilinestring、multipolygon、geometrycollection
 * @returns {Promise<ApiResponse<any>>}
 */
function indicesCreateShape(name, type) {
  return client.indices.create({
    index: name,
    body: {
      mappings: {
        properties: {
          geometry: {
            type: type,
          },
        },
      },
    },
  });
}

/**
 * 判断elasticsearch中index是否存在
 * @param index index索引
 * @returns {Promise<ApiResponse<any>>}
 */
function indexExists(index) {
  return client.indices.exists({
    index: index,
  });
}

module.exports = {
  indicesCreate,
  indicesCreateShape,
  indexExists,
};
