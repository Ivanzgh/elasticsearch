const { Client } = require("@elastic/elasticsearch");
const config = require("../../config");
const client = new Client({ node: config.elasticsearch });

/**
 * 搜索
 * @param index 索引
 * @param location 坐标点 数组
 * @param keyword 关键字 匹配name 地址等信息
 * @pagesize 搜索结果分页 每页多少条
 * @pagenum 搜索结果分页 第几页
 * @distance 距离
 * @returns {Promise<ApiResponse<any>>}
 */
function searchData(index, location, pagesize, pagenum, distance, keyword) {
  pagesize = pagesize ? pagesize : 10;
  pagenum = pagenum ? pagenum - 1 : 0;
  distance = distance ? distance : "1000000km";
  let filter = {};
  let body = {
    query: {
      bool: {
        must: {},
      },
    },
  };

  if (keyword) {
    body.query.bool.must = {
      multi_match: {
        query: keyword,
        fields: ["properties.name", "properties.Name", "properties.Address"],
        type: "phrase",
      },
    };
  } else {
    body.query.bool.must = {
      match_all: {},
    };
  }

  // if(!Array.isArray(location)){
  //   return null;
  // }

  if (Array.isArray(location) && location.length !== 0) {
    if (Array.isArray(location[0]) && location.length === 2) {
      let lon1 = location[0][0],
        lon2 = location[1][0],
        lat1 = location[0][1],
        lat2 = location[1][1];
      // 从左上角到右下角
      if (lon1 < lon2 && lat1 > lat2) {
        filter.geo_bounding_box = {
          "geometry.coordinates": {
            top_left: location[0],
            bottom_right: location[1],
          },
        };
      }
      // 从右下角到左上角
      if (lon1 > lon2 && lat1 < lat2) {
        filter.geo_bounding_box = {
          "geometry.coordinates": {
            top_left: location[1],
            bottom_right: location[0],
          },
        };
      }
      // 从左下角到右上角
      if (lon1 < lon2 && lat1 < lat2) {
        filter.geo_bounding_box = {
          "geometry.coordinates": {
            top_right: location[1],
            bottom_left: location[0],
          },
        };
      }
      // 从右上角到左下角
      if (lon1 > lon2 && lat1 > lat2) {
        filter.geo_bounding_box = {
          "geometry.coordinates": {
            top_right: location[0],
            bottom_left: location[1],
          },
        };
      }
    } else {
      filter.geo_distance = {
        distance: distance,
        "geometry.coordinates": location,
      };
    }

    body.query.bool.filter = filter;
  }

  body.track_total_hits = true;

  return client.search({
    index: index,
    size: pagesize || 10,
    from: pagenum * pagesize || 0,
    body: body,
  });
}

/**
 * 搜索庞各庄数据
 * @param {string} index 索引
 * @param {string} keyword 关键字
 */
function searchPgzlkByXZC(keyword, pagesize, pagenum) {
  pagesize = pagesize ? pagesize : 10;
  pagenum = pagenum ? pagenum - 1 : 0;
  let filter = {};
  let body = {
    track_total_hits: true,
    query: {
      bool: {
        must: {
          match_all: {},
        },
      },
    },
  };
  if (keyword) {
    filter.match_phrase = {
      "properties.XZC": keyword,
    };
    body.query.bool.filter = filter;
  }
  body.track_total_hits = true;
  return client.search({
    index: "pgz_jzwlk",
    size: pagesize || 10,
    from: pagenum * pagesize || 0,
    body: body,
  });
}

/**
 * 根据fileds字段 获取相关关键字 的index 数据
 * @param index 索引， 多个以 , 分隔
 * @param fileds 数组
 * @param keywords 关键字
 * @param pagesize 每页多少条数据
 * @param pagenum 第几页
 * @returns {Promise<ApiResponse<any>>}
 */
function searchByfiledKeyWord(index, fileds, keywords, pagesize, pagenum) {
  pagesize = pagesize ? pagesize : 10;
  pagenum = pagenum ? pagenum - 1 : 0;
  return client.search({
    index: index,
    size: pagesize || 10,
    from: pagenum * pagesize || 0,
    body: {
      track_total_hits: true,
      query: {
        bool: {
          must: {
            multi_match: {
              query: keywords,
              fields: fileds,
              type: "phrase",
            },
          },
        },
      },
    },
  });
}

/**
 * 根据查询条件返回 总数
 * @param index
 * @param body
 * @returns {Promise<ApiResponse<any>>}
 */
function getCount(index, body) {
  return client.count({
    index,
    body,
  });
}

/**
 * 根据地址关键字搜索流管标准地址库人员数据
 * @param keywords 关键字
 * @param pagesize 每页多少条数据
 * @param pagenum 第几页
 */
function searchLgbzdzkBydz(keywords, pagesize, pagenum) {
  pagesize = pagesize ? pagesize : 10;
  pagenum = pagenum ? pagenum - 1 : 0;
  let body = {};
  if (keywords) {
    body.query = {
      multi_match: {
        query: keywords,
        fields: ["RZF_XZDXXDZ"],
      },
    };
    body.track_total_hits = true;
  }
  return client.search({
    index: "lgbzdzk_ry",
    size: pagesize || 10,
    from: pagenum * pagesize || 0,
    body: body,
  });
}

/**
 * 搜索流管标准地址库范围区域内的数据，可为圆形区域、矩形区域和多边形区域
 * @param index 索引，可以是 lgbzdzk_ry 或者 lgbzdzk_fw
 * @param location 坐标点 数组
 * @param distance 距离
 * @param pagesize 每页多少条数据
 * @param pagenum 第几页
 * cardinality 去重计数; house_count为自定义字段
 */
function searchLgbzdzkByPolygon(index, location, distance, pagesize, pagenum) {
  pagesize = pagesize ? pagesize : 10;
  pagenum = pagenum ? pagenum - 1 : 0;
  distance = distance ? distance : "1000000km";
  let filter = {};
  let body = {
    track_total_hits: true,
    query: {
      bool: {
        must: {
          match_all: {},
        },
      },
    },
  };
  if (Array.isArray(location) && location.length !== 0) {
    if (Array.isArray(location[0]) && location.length === 2) {
      let lon1 = location[0][0],
        lon2 = location[1][0],
        lat1 = location[0][1],
        lat2 = location[1][1];
      // 从左上角到右下角
      if (lon1 < lon2 && lat1 > lat2) {
        filter.geo_bounding_box = {
          location: {
            top_left: location[0],
            bottom_right: location[1],
          },
        };
      }
      // 从右下角到左上角
      if (lon1 > lon2 && lat1 < lat2) {
        filter.geo_bounding_box = {
          location: {
            top_left: location[1],
            bottom_right: location[0],
          },
        };
      }
      // 从左下角到右上角
      if (lon1 < lon2 && lat1 < lat2) {
        filter.geo_bounding_box = {
          location: {
            top_right: location[1],
            bottom_left: location[0],
          },
        };
      }
      // 从右上角到左下角
      if (lon1 > lon2 && lat1 > lat2) {
        filter.geo_bounding_box = {
          location: {
            top_right: location[0],
            bottom_left: location[1],
          },
        };
      }
    } else if (Array.isArray(location[0]) && location.length > 2) {
      filter.geo_polygon = {
        location: {
          points: location,
        },
      };
    } else if (Array.isArray(location[0]) && location.length === 1) {
      return false;
    } else {
      filter.geo_distance = {
        distance: distance,
        location: location,
      };
    }
    body.query.bool.filter = filter;
  }

  return client.search({
    index: index,
    size: pagesize || 10,
    from: pagenum * pagesize || 0,
    body: body,
  });
}

module.exports = {
  searchData,
  searchPgzlkByXZC,
  searchByfiledKeyWord,
  getCount,
  searchLgbzdzkBydz,
  searchLgbzdzkByPolygon,
};
