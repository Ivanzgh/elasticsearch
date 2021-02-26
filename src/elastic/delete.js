const { Client } = require("@elastic/elasticsearch");
const config = require("../../config");
const client = new Client({ node: config.elasticsearch });

// client.delete({
//     index: "beijingbusstops"
//   })

// client.deleteByQuery({
//     index: 'beijingbusstops,canyin',
//     body: {
//       "query": {
//         "bool": {
//           "must": {
//             "match_all": {}
//           },
//           "filter": {
//             "match_phrase": {
//                 "properties.name": "饕餮"
//             }
//           }
//         }
//     }
//   }
// }).then(res => {
//     if(res.statusCode === 200) {
//         console.log(res.body);
//     }
// })

/**
 * 删除数据
 * @param {string} index 索引
 * @param {string} keyword 关键字
 * @returns {Promise<ApiResponse<any>>}
 */
function deleteData(index, keyword) {
  let filter = {};
  let body = {
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
      "properties.name": keyword,
    };
    body.query.bool.filter = filter;
  }

  return client.deleteByQuery({
    index,
    body: body,
  });
}

/**
 * 删除流管标准地址库数据
 * @param index 索引
 * @param _id 匹配唯一值id
 * @param {array} data 个人编号
 * @returns {Promise<ApiResponse<any>>}
 */
function delLgbzdzk(index, _id, data) {
  let body = {
    query: {
      bool: {
        must: {
          match_all: {},
        },
        filter: {
          terms: {
            _id: data,
          },
        },
      },
    },
  };

  return client.deleteByQuery({
    index: index,
    body: body,
  });
}

module.exports = {
  deleteData,
  delLgbzdzk,
};
