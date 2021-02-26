let express = require("express");
let router = express.Router();

let searchData = require("../elastic/search").searchData;

let searchPgzlkByXZC = require("../elastic/search").searchPgzlkByXZC;

let searchByfiledKeyWord = require("../elastic/search").searchByfiledKeyWord;

let getCount = require("../elastic/search").getCount;

let searchLgbzdzkBydz = require("../elastic/search").searchLgbzdzkBydz;

let searchLgbzdzkByPolygon = require("../elastic/search")
  .searchLgbzdzkByPolygon;

let ReturnData = require("../util/ReturnData");

let elasticResultToGeoJson = require("../util/elasticResultToGeoJson")
  .elasticResultToGeoJson;

let lgMulityInsert = require("../elastic/insert").lgMulityInsert;

let delLgbzdzk = require("../elastic/delete").delLgbzdzk;

let updateLgbzdzk = require("../elastic/update").updateLgbzdzk;

/**
 * 此方法误删 ，测试网关使用
 */
router.get("/", (req, res, next) => {
  res.send("hello world!");
});

/**
 * poi搜索
 * @param location 坐标点 (数组 二维数组)
 * @param keyword 关键字 匹配name 地址等信息
 * @param pagesize 搜索结果分页 每页多少条
 * @param pagenum 搜索结果分页 第几页
 * @param distance 距离
 * @example
 * http://localhost:5000/searchpoi?keyword=东
 * http://localhost:5000/searchpoi?location=[116.4,39.6]&distance=10km
 * http://localhost:5000/searchpoi?location=[[116.4,39.8],[116.5,39.7]]&keyword=东
 */
router.get("/searchpoi", (req, res, next) => {
  let param = req.query || req.params;
  let returnD = new ReturnData();
  let location = param.location ? JSON.parse(param.location) : [];
  let index =
    "wlxt_beijing_weishengshebao," +
    "wlxt_beijing_yundongxiuxian," +
    "wlxt_beijing_shangyesheshijifuwu," +
    "wlxt_beijing_qichexiaoshoujifuwu," +
    "wlxt_beijing_pifalingshou," +
    "wlxt_beijing_nonglinmuyuye," +
    "wlxt_beijing_kejijijishufuwu," +
    "wlxt_beijing_juminfuwu," +
    "wlxt_beijing_jinrongbaoxian," +
    "wlxt_beijing_jiaoyuwenhua," +
    "wlxt_beijing_gongsiqiye," +
    "wlxt_beijing_jiaotongyunshucangchu," +
    "wlxt_beijing_gongyongsheshi," +
    "beijingbusstops," +
    "wlxt_beijing_ditiezhan," +
    "wlxt_beijing_canyin," +
    "wlxt_beijing_zhusu," +
    "wlxt_beijing_xingququ";

  searchData(
    index,
    location,
    param.pagesize,
    param.pagenum,
    param.distance,
    param.keyword
  )
    .then((result) => {
      returnD.setSuccess();
      returnD.setReturnData(result.body.hits.hits);
      res.send(returnD);
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 公交站点搜索
 * @param keyword 公交站点关键字
 * @param pagesize 搜索结果分页 每页多少条
 * @param pagenum 搜索结果分页 第几页
 * @example
 * http://localhost:5000/busstation?keyword=西直门
 */
router.get("/busstation", (req, res, next) => {
  var param = req.query || req.params;
  var returnD = new ReturnData();
  searchData(
    "beijingbusstops",
    [],
    param.pagesize,
    param.pagenum,
    "",
    param.keyword
  )
    .then((result) => {
      returnD.setSuccess();
      returnD.setReturnData(result.body.hits.hits);
      res.send(returnD);
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 按行政村名字查询庞各庄建筑轮廓
 * @param xzc
 */
router.get("/searchpgzlkbyxzc", (req, res, next) => {
  var param = req.query || req.params;
  var returnD = new ReturnData();

  getCount("pgz_jzwlk", {
    query: {
      bool: {
        must: {
          match_all: {},
        },
        filter: {
          match_phrase: {
            "properties.XZC": param.xzc,
          },
        },
      },
    },
  })
    .then((r) => {
      let count = r.body.count;
      searchPgzlkByXZC(param.xzc, count, 1).then((result) => {
        returnD.setSuccess();
        returnD.setReturnData(elasticResultToGeoJson(result.body.hits.hits));
        res.send(returnD);
      });
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 地理编码（POI搜索） 根据输入的关键词，返回当前城市中匹配度最高POI信息及其位置坐标。
 * @keyword 地址关键字
 * @param pagesize 搜索结果分页 每页多少条
 * @param pagenum 搜索结果分页 第几页
 */
router.get("/geocoding2", (req, res, next) => {
  let param = req.query || req.params;
  let index =
    "wlxt_beijing_weishengshebao," +
    "wlxt_beijing_yundongxiuxian," +
    "wlxt_beijing_shangyesheshijifuwu," +
    "wlxt_beijing_qichexiaoshoujifuwu," +
    "wlxt_beijing_pifalingshou," +
    "wlxt_beijing_nonglinmuyuye," +
    "wlxt_beijing_kejijijishufuwu," +
    "wlxt_beijing_juminfuwu," +
    "wlxt_beijing_jinrongbaoxian," +
    "wlxt_beijing_jiaoyuwenhua," +
    "wlxt_beijing_gongsiqiye," +
    "wlxt_beijing_jiaotongyunshucangchu," +
    "wlxt_beijing_gongyongsheshi," +
    "beijingbusstops," +
    "wlxt_beijing_ditiezhan," +
    "wlxt_beijing_canyin," +
    "wlxt_beijing_zhusu," +
    "wlxt_beijing_xingququ";
  let returnD = new ReturnData();
  searchData(index, [], param.pagesize, param.pagenum, "", param.keyword)
    .then((result) => {
      returnD.setSuccess();
      returnD.setReturnData(result.body.hits.hits);
      res.send(returnD);
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 行政区划 	根据地理坐标信息，掌握地点所在省/市区域、以及区域形状点数据。
 * @keyword 地址关键字
 * @param pagesize 搜索结果分页 每页多少条
 * @param pagenum 搜索结果分页 第几页
 */
router.get("/adminByPoint", (req, res, next) => {
  let index =
    "wlxt_beijing_shijie," +
    "wlxt_beijing_quxianjiexian," +
    "wlxt_beijing_xiangzhenjie";
  let param = req.query || req.params;
  let returnD = new ReturnData();
  searchData(index, [], param.pagesize, param.pagenum, "", param.keyword)
    .then((result) => {
      returnD.setSuccess();
      returnD.setReturnData(result.body.hits.hits);
      res.send(returnD);
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 根据关键字 返回相关区所有镇界区域数据
 * @keyword 区域关键字
 */
router.get("/town", (req, res, next) => {
  let param = req.query || req.params;
  let index = "wlxt_beijing_xiangzhenjie";
  let returnD = new ReturnData();
  let keyword = param.keyword || "";

  // 获取总数
  getCount(index, {
    query: {
      bool: {
        must: {
          multi_match: {
            query: keyword,
            fields: ["properties.cd_name"],
          },
        },
      },
    },
  })
    .then((r) => {
      let count = r.body.count;
      searchByfiledKeyWord(index, ["properties.cd_name"], keyword, count, 1)
        .then((result) => {
          returnD.setSuccess();
          returnD.setReturnData(elasticResultToGeoJson(result.body.hits.hits));
          res.send(returnD);
        })
        .catch((e) => {
          returnD.setSysException(e);
          res.send(returnD);
        });
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 根据关键字 返回乡镇界区域数据
 * @keyword 区域关键字
 */
router.get("/getTownByName", (req, res, next) => {
  let param = req.query || req.params;
  let index = "wlxt_beijing_xiangzhenjie";
  let returnD = new ReturnData();
  let keyword = param.keyword || "";

  // 获取总数
  getCount(index, {
    query: {
      bool: {
        must: {
          multi_match: {
            query: keyword,
            fields: ["properties.name"],
          },
        },
      },
    },
  })
    .then((r) => {
      let count = r.body.count;
      searchByfiledKeyWord(index, ["properties.name"], keyword, count, 1)
        .then((result) => {
          returnD.setSuccess();
          returnD.setReturnData(elasticResultToGeoJson(result.body.hits.hits));
          res.send(returnD);
        })
        .catch((e) => {
          returnD.setSysException(e);
          res.send(returnD);
        });
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * @index 索引
 */
router.get("/layer", (req, res, next) => {
  let param = req.query || req.params;
  let index = param.index;
  var returnD = new ReturnData();
  searchData(index, [])
    .then((result) => {
      returnD.setSuccess();
      returnD.setReturnData(result.body);
      res.send(returnD);
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 根据关键字，搜索流管标准地址库人员数据
 * @param keyword 地址关键字
 * @param pagesize 搜索结果分页 每页多少条
 * @param pagenum 搜索结果分页 第几页
 * 此处不用getCount()获取总数的原因是数据量太大会造成系统异常
 */
router.get("/searchlgbzdzk", (req, res, next) => {
  var param = req.query || req.params;
  var returnD = new ReturnData();
  searchLgbzdzkBydz(param.keyword, param.pagesize, param.pagenum)
    .then((result) => {
      returnD.setSuccess();
      returnD.setReturnData(result.body.hits.hits);
      res.send(returnD);
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 流管标准地址库区域统计，可为圆形区域、矩形区域和多边形区域
 * @param location 经纬度坐标
 * @param distance 距离
 * @param pagesize 搜索结果分页 每页多少条，默认10条
 * @param pagenum 搜索结果分页 第几页，默认第1页
 * @example:  http://localhost:5000/lgAreaCount?location=[[113.5,39.8],[116.4,35.8]]
 * @example:  http://localhost:5000/lgAreaCount?location=[116.52325,39.87126]&distance=10km
 * @example:  http://localhost:5000/lgAreaCount?location=[[116.5,39.8],[116.7,39.5],[116.8,39.7],[116.6,39.9]]
 */
router.get("/lgAreaCount", (req, res, next) => {
  let param = req.query || req.params;
  let returnD = new ReturnData();
  let location = JSON.parse(param.location);
  let distance = param.distance;

  searchLgbzdzkByPolygon("lgbzdzk_ry", location, distance, 10, 1)
    .then((result1) => {
      searchLgbzdzkByPolygon("lgbzdzk_fw", location, distance, 10, 1)
        .then((result2) => {
          returnD.setSuccess();
          returnD.setReturnData({
            ry_count: result1.body.hits.total,
            fw_count: result2.body.hits.total,
          });
          res.send(returnD);
        })
        .catch((e) => {
          returnD.setSysException(e);
          res.send(returnD);
        });
    })
    .catch((e) => {
      returnD.setSysException(e);
      res.send(returnD);
    });
});

/**
 * 上传数组，每次1000条数据
 * 流管标准地址库批量添加人员数据
 * @param data 要添加的数据
 * @param geo_point 地理数据类型
 */
router.post("/lgMulityInsert/ry", (req, res, next) => {
  let { data } = req.body;
  let returnD = new ReturnData();
  if (Array.isArray(data) && data.length <= 1000) {
    lgMulityInsert("lgbzdzk_ry", "RDJ_GRBH", data, "geo_point")
      .then((result) => {
        returnD.setSuccess();
        returnD.setReturnData(result);
        res.send(returnD);
      })
      .catch((err) => {
        returnD.setSysException(err);
        res.send(returnD);
      });
  } else {
    returnD.setError();
    returnD.setReturnData("数组格式错误或数据长度超过1000条");
    res.send(returnD);
  }
});

/**
 * 批量导入房屋数据
 */
router.post("/lgMulityInsert/fw", (req, res, next) => {
  let { data } = req.body;
  let returnD = new ReturnData();
  if (Array.isArray(data) && data.length <= 1000) {
    lgMulityInsert("lgbzdzk_fw", "BIH_ID", data, "geo_point")
      .then((result) => {
        returnD.setSuccess();
        returnD.setReturnData(result);
        res.send(returnD);
      })
      .catch((err) => {
        returnD.setSysException(err);
        res.send(returnD);
      });
  } else {
    returnD.setError();
    returnD.setReturnData("数组格式错误或数据长度超过1000条");
    res.send(returnD);
  }
});

/**
 * 流管标准地址库删除数据
 * @param RDJ_GRBH 个人编号
 * @param BIH_ID 房屋id
 * @example  "RDJ_GRBH": ["7d7cd2282c0f00","7d7cd2282c0f01","7d7cd2282c0f02","7d7cd2282c0f03","7d7cd2282c0f04"]
 * @example  "BIH_ID": ["bbfcd36fd51900", "bc6bc4135ba700", "fb2b737be9d400"]
 */
router.post("/delLgbzdzk", (req, res, next) => {
  let param = req.body.RDJ_GRBH
    ? req.body.RDJ_GRBH
    : req.body.BIH_ID
    ? req.body.BIH_ID
    : "";
  let returnD = new ReturnData();
  if (Array.isArray(param) && param.length <= 1000 && req.body.RDJ_GRBH) {
    delLgbzdzk("lgbzdzk_ry", "RDJ_GRBH", param)
      .then((result) => {
        returnD.setSuccess();
        returnD.setReturnData(result.body);
        res.send(returnD);
      })
      .catch((err) => {
        returnD.setSysException(err);
        res.send(returnD);
      });
  } else if (Array.isArray(param) && param.length <= 1000 && req.body.BIH_ID) {
    delLgbzdzk("lgbzdzk_fw", "BIH_ID", param)
      .then((result) => {
        returnD.setSuccess();
        returnD.setReturnData(result.body);
        res.send(returnD);
      })
      .catch((err) => {
        returnD.setSysException(err);
        res.send(returnD);
      });
  } else {
    returnD.setError();
    returnD.setReturnData("数组格式错误或数据长度超过1000条");
    res.send(returnD);
  }
});

/**
 * 如果无法区分数据是新增还是更改，请使用批量插入接口，此接口暂时保留！
 * 流管标准地址库更改数据
 * @param RDJ_GRBH 个人编号
 * @param data 要更改的数据
 * @example
 * "data": [ { "RDJ_GRBH": "fa8483c582fd01", "data": {"RZF_XZDXXDZ": "北京市翻斗大街翻斗花园1号楼","TJSJ": "20200115000666"} },
 *           { "RDJ_GRBH": "fa8483c582fd02", "data": {"RZF_XZDXXDZ": "北京市翻斗大街翻斗花园2号楼","TJSJ": "20200115000233"} } ]
 */
router.post("/updateLgbzdzk", (req, res, next) => {
  let { data } = req.body;
  let returnD = new ReturnData();
  if (Array.isArray(data) && data.length <= 1000) {
    updateLgbzdzk(data)
      .then((result) => {
        let updatedNum = 0;
        result.forEach((item) => {
          if (item.result === "updated") {
            updatedNum++;
          }
        });
        returnD.setSuccess();
        returnD.setReturnData({ updatedNum: updatedNum });
        res.send(returnD);
      })
      .catch((err) => {
        returnD.setSysException(err);
        res.send(returnD);
      });
  } else {
    returnD.setError();
    returnD.setReturnData("数组格式错误或数据长度超过1000条");
    res.send(returnD);
  }
});

/**
 * 此方法暂时保留，不可用！！！
 * 流管标准地址库批量添加数据
 * @param data 要添加的数据
 * @param geo_point 地理数据类型
 */
const multiparty = require("multiparty");
const iconv = require("iconv-lite");
router.post("/lgMulityInsertByCsv", (req, res, next) => {
  let returnD = new ReturnData();

  let form = new multiparty.Form({
    encoding: "utf8",
    autoFiles: true,
    maxFilesSize: 30 * 1024 * 1024,
    uploadDir: "./src/data/upload",
  });
  form.on("close", () => {
    console.log("upload complete");
  });
  form.on("error", (err) => {
    console.log(err);
    returnD.setError();
    returnD.setReturnData("上传文件大小不能超过 30MB!");
    res.send(returnD);
    return false;
  });
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err);
    } else {
      let uploadPath = files.file[0].path;
      let dstPath = "./src/data/upload/" + files.file[0].originalFilename;
      fs.rename(uploadPath, dstPath, (err) => {
        if (err) throw err;

        // 先统一用二进制编码方式读取，然后再用GBK解码
        // let data = fs.readFileSync(dstPath,{'encoding':'binary'});
        // const buf = Buffer.from(data, 'binary');
        // const str = iconv.decode(buf, 'gbk');
        // console.log(str)

        let data = cvsToData(dstPath);
        lgMulityInsert(data, "geo_point")
          .then((result) => {
            returnD.setSuccess();
            returnD.setReturnData(result);
            res.send(returnD);
          })
          .catch((err) => {
            returnD.setSysException(err);
            res.send(returnD);
          });
      });
    }
  });
});

module.exports = router;
