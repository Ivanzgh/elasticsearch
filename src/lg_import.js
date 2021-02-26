// 流管标准地址库   数据导入
const fs = require("fs");

const { Client } = require("@elastic/elasticsearch");
const config = require("../config");
const client = new Client({ node: config.elasticsearch });
const csv = require("csvtojson");

async function csvtojson(csvFilePath) {
  const jsonArray = await csv().fromFile(csvFilePath);
  return jsonArray;
}

// 该方法作废，由csvtojson库将csv转为json
function cvsToData(filePath) {
  let data = fs.readFileSync(filePath, { encoding: "utf-8" });
  let dataList = data.split("\n");
  let exportData = [];
  let itemList = dataList[0].replace(/\"/g, "").split(",");
  for (let i = 1; i < dataList.length; i++) {
    let obj = {};
    let item = dataList[i].replace(/\"/g, "").split(",");
    for (let m = 0; m < itemList.length; m++) {
      let attr = itemList[m].replace(/\r/g, "");
      obj[attr] = item[m];
    }
    exportData.push(obj);
  }
  return exportData;
}

// 创建index
function indicesCreate(index) {
  return client.indices.create({
    index: index,
    body: {
      mappings: {
        properties: {
          location: {
            type: "geo_point",
          },
        },
      },
    },
  });
}

// indicesCreate("lgbzdzk_ry")
// indicesCreate("lgbzdzk_fw")

// 数据处理
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

// 导入数据
async function mulityInsert(index, _id, data, type) {
  let csvtojson = await data.then((res) => {
    return res;
  });
  console.log(csvtojson.length);
  let indexName = index.toLowerCase();
  let er_arr = dealData(csvtojson);
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

// mulityInsert("lgbzdzk_ry", "RDJ_GRBH", csvtojson('./src/data/ry.csv'),"geo_point");
mulityInsert(
  "lgbzdzk_fw",
  "BIH_ID",
  csvtojson("./src/data/fw.csv"),
  "geo_point"
);


/**
 * 接收前台传入的csv文件，支持post请求
 */
function lgMulityInsertByCsv() {
  let form = new multiparty.Form({
    encoding: "utf8",
    autoFiles: true,
    maxFilesSize: 30 * 1024 * 1024,
    uploadDir: "./src/data/lgUpload", // 文件上传的路径，lgUpload文件夹需手动创建
  });
  form.on("close", () => {
    console.log("upload complete");
  });
  form.on("error", (err) => {
    console.log(err);
    return false;
  });
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err);
    } else {
      let uploadPath = files.file[0].path;
      let dstPath = "./src/data/lgUpload/" + files.file[0].originalFilename;
      fs.rename(uploadPath, dstPath, (err) => {
        if (err) throw err;
        let data = cvsToData(dstPath);
        lgMulityInsert(data, "geo_point")
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  });
}


/**
 * 清空流管标准地址库所有数据，轻易误试！！！  注意索引还在！ 一次删不干净就多删几次(看total和deleted是否都是0)
 */
function dellgAllData() {
  client
    .deleteByQuery({
      index: "lgbzdzk_ry",
      body: {
        query: {
          match_all: {},
        },
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// dellgAllData();
