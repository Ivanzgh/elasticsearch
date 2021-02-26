const { Client } = require("@elastic/elasticsearch");
const config = require("../../config");
const client = new Client({ node: config.elasticsearch });
const index = require("./index");
const elasticTransform = require("../util/elasticDataTranform");
const pgz = require("../../data/pgz_jzlk.json");
const xiangzhendaoluData = require("../../data/wlxt_beijing_xiangzhendaolu.json");

/**
 * 批量将data数据导入elasticsearch中
 * @param indexName index索引
 * @param data 导入的数据
 * @type 导入数据类型  目前接收 geo_point 和 geo_shape
 * @returns {Promise<ApiResponse<any>>} 返回异步对象，如果index存在且type参数为空，返回null
 */
async function mulityInsert(indexName, data, type) {
  indexName = indexName.toLowerCase();
  let indexExists = await index.indexExists(indexName);
  if (!indexExists.body) {
    if (!type) {
      return null;
    } else {
      if (type == "geo_point") {
        await index.indicesCreate(indexName, type);
      }
      if (type == "geo_shape") {
        await index.indicesCreateShape(indexName, type);
      }
    }
  }

  let bulk = elasticTransform.bulkData(indexName, data);
  return client.bulk({
    index: indexName,
    body: bulk,
  });
}

/**
 * 导入庞各庄建筑轮廓数据
 */
async function pgz_jzlk() {
  let indexExists = await index.indexExists("pgz_jzwlk");
  if (!indexExists.body) {
    //await index.indicesCreateShape('pgz_jzwlk','geo_shape')
    await client.indices.create({
      index: "pgz_jzwlk",
    });
  }
  let bulk = elasticTransform.bulkData("pgz_jzwlk", {
    data: pgz,
  });
  return client.bulk({
    index: "pgz_jzwlk",
    body: bulk,
  });
}

/**
 * 导入乡镇道路数据
 */
async function xiangzhendaolu() {
  return mulityInsert(
    "wlxt_beijing_xiangzhendaolu",
    { data: xiangzhendaoluData },
    "geo_shape"
  );
}

/**
 * 数据处理，添加location字段；
 * @param data  流管标准地址库数据
 * @returns {[]} 返回处理后的结果
 */
function dealData(data) {
  data.map((item, index, arr) => {
    item.location = {
      lat: item["WD"] ? item["WD"] : 0,
      lon: item["JD"] ? item["JD"] : 0,
    };
  });
  let result = [];
  data.forEach((item, index) => {
    const page = Math.floor(index / 300);
    if (!result[page]) {
      result[page] = [];
    }
    result[page].push(item);
  });
  return result;
}

/**
 * 在elasticsearch上为每条数据添加_index和_id字段
 * @param data 流管标准地址库数据
 * @returns {[]}
 */
function elasticDealData(_index, _id, data) {
  let bulkbody = [];
  data.forEach((item) => {
    bulkbody.push({
      index: {
        _index: _index,
        _id: item[_id],
      },
    });
    bulkbody.push(item);
  });
  return bulkbody;
}

/**
 * 批量导入流管标准地址库数据，每次导入1000条
 * @param index 索引
 * @param _id 唯一值
 * @param {array} data  流管标准地址库数据
 * @param {string} type  地理数据的类型，一般为'geo_point'
 * @returns {Promise<void>}
 */
async function lgMulityInsert(index, _id, data, type) {
  let indexName = index.toLowerCase();
  let er_arr = dealData(data);
  // 300 条数据 导入一次
  for (let i = 0; i < er_arr.length; i++) {
    let bulkbody = elasticDealData(index, _id, er_arr[i]);
    await client.bulk(
      {
        index: indexName,
        body: bulkbody,
      },
      (error, result) => {
        if (error) {
          console.log("数据导入失败,第" + i + "个三百条数据");
          console.log(error);
        } else {
          console.log("数据导入成功,第" + i + "个三百条数据");
        }
      }
    );
  }
}

module.exports = {
  mulityInsert,
  pgz_jzlk,
  xiangzhendaolu,
  lgMulityInsert,
};
