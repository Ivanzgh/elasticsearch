const { Client } = require('@elastic/elasticsearch');
const config = require('../config');
const client = new Client({node: config.elasticsearch});

// client.count({
//     index: 'lgbzdzk_ry',
//     body: {
//         "query": {
//             "match_all": {}
//         }
//     }
// }).then(res => {
//     console.log(res)   // lgbzdzk_ry: 1413950
// })

// client.search({
//     index: 'lgbzdzk_ry',
//     from: 0,
//     size: 3,
//     body: {
//         "query": {
//             "match_all": {}
//         }
//     }
// }).then(res => {
//     console.log(res.body.hits.hits)
// })

// client.search({
//     index: 'lgbzdzk_ry',
//     size: 0,
//     from: 10,
//     body: {
//         "query": {
//             "bool": {
//                 "must":{
//                     "match_all": {}
//                 },
//                 "filter": {
//                     "terms": {
//                         "RDJ_GRBH": ['bc291223284b00','bc03eab292ee00','bc013a175cda00','7dac12aed33c00','bc14aa94b2ce00','7daadbb06ed500','bc1c8a938db500','bc2342909c3e00']
//                     }
//                 }
//             }
//         }
//     }
// }).then(res => {
//     console.log(res.body.hits)
// })

// client.deleteByQuery({
//     index: 'lgbzdzk_fw',
//     body: {
//         "query": {
//             "bool": {
//                 "must":{
//                     "match_all": {}
//                 },
//                 "filter": {
//                     "terms": {
//                         "BIH_ID": ['bc97e180949100',
//                             'bc97e181569600',
//                             'bc97e18943ba00',
//                             'bc97e18958b200',
//                             'bc97e189bc6400',
//                             'bc97e18a071f00',
//                             'bc97e18b1f5900',
//                             'bc97e18b335600',
//                             'bc97e18b871a00',
//                             'bc97e18c66b900',
//                             'bc97e18cb56500']
//                     }
//                 }
//             }
//         }
//     }
// }).then(res => {
//     console.log(res)
// })

// client.search({
//     index: 'lgbzdzk_ry',
//     from: 0,
//     size: 10,
//     body: {
//         "query": {
//             "bool": {
//                 must:{
//                     "match_all": {}
//                 },
//                 filter: {
//                     "terms": {
//                         "RDJ_GRBH": ["bc03eab292ee00"]
//                     }
//                 }
//             }
//         }
//     }
// }).then(res => {
//     console.log(res.body.hits.hits)
// })

// client.exists({
//     id: "7d7c742c1e6100",
//     index : 'lgbzdzk'
// }).then(res => {
//     console.log(res)
// })

// client.search({
//     index: 'lgbzdzk_ry',
//     size: 0,
//     from: 10,
//     body: {
//         "track_total_hits": true,
//         "query": {
//             "match": {
//                 "RDJ_GRBH": "bc14b316301f00"
//             }
//         }
//     }
// }).then(res => {
//     console.log(res.body.hits)
// })

let obj = {
    _index: 'lgbzdzk',
    _type: '_doc',
    _id: 'fa83c219428000',
    _score: 11.000479,
    _source: {
        RDJ_GRBH: 'fa83c219428000',
        BIP_XM: '张三',
        BIP_SFZHM: '152104194212240027',
        FWZJBXXDJB_FWZBH: 'bc2443dfb28000',
        RZF_XZDXZQH: '110111012006',
        RZF_XZDXXDZ: '北京市翻斗大街翻斗花园1号楼',
        DZBM: '1101111129000_0066_00_00_0007_0002_0003_0003',
        JD: '116.1259350005',
        WD: '39.73211',
        TJSJ: '20200115000111',
        location: [Object]
    }
}

// client.updateByQuery({
//     index: 'lgbzdzk',
//     refresh: true,
//     body: {
//         script: {
//             lang: 'painless',
//             // source: 'ctx._source["BIP_XM"] = "天秀"'
//             source: 'ctx._source.BIP_XM = params.BIP_XM;ctx._source.DZ = params.DZ',
//             params: {
//                 "BIP_XM": "一枝独秀666",
//                 "DZ": "北京市翻斗大街翻斗花园1号楼"
//             }
//         },
//         "query": {
//             "term": {
//                 "RDJ_GRBH": "fa83c219428000"
//             }
//         }
//     }
// }).then(res => {
//     console.log(res)
// })

// client.update({
//     index: 'lgbzdzk',
//     id: 'fa83c219428000',
//     body: {
//         // "doc": {
//         //     "DZ": "北京市昌平区",
//         //     "author": "zgh"
//         // }
//
//         script: {
//             lang: 'painless',
//             source: 'if (ctx._source.author.contains(params.user)) { ctx.op = "delete" } else { ctx.op = "none"}',
//             params: {
//                 "user": "es"
//             }
//         },
//     }
// }).then(res => {
//     console.log(res)
// })


// client.cat.count({
//     index: 'lgbzdzk'
// }).then(res => {
//     console.log(res)
// })

client.search({
    index: "lgbzdzk_ry",
    body: {
        "track_total_hits": true, // 默认值为10000，设为true后可精确计数
        "query": {
            // "match_all": {}

            // 一般分词器不会对字母、数字进行分词处理
            "match": {
                "RDJ_GRBH": "bc14b316301f00"
            }

            // "bool": {
            //     must:{
            //         "match_all": {}
            //     },
            //     filter: {
            //         "match": {
            //             "RDJ_GRBH": "7d7cd2282c0f00"
            //         }
            //     }
            // }

            // 关键字模糊匹配，默认是or操作
            // "match": {
            //     "RZF_XZDXXDZ": "北京市朝阳区王四营乡王四营村272号"
            // }

            // 执行and操作，效果等同于短语匹配
            // "match": {
            //     "RZF_XZDXXDZ": {
            //         "query": "张家胡同6号",
            //         "operator": "and"
            //     }
            // }

            // 多词匹配，只要一个字段符合就会被匹配出来
            // "multi_match": {
            //     "query": "朝阳",
            //     "fields": ["RZF_XZDXXDZ","BIP_XM"]
            // }

            // 短语匹配，不会分词，类似精确匹配
            // "match_phrase": {
            //     "RZF_XZDXXDZ": '张家胡同6号'
            // }

            // "bool": {
            //   "must": [
            //     {
            //       "match": {
            //         "BIP_XM": '张三'
            //       }
            //     },
            //     {
            //       "term": {
            //         "BIP_SFZHM": '412824196808303929'
            //       }
            //     }
            //   ]
            // }

            // 搜索相关点附近的点
            // "bool": {
            //     "must": {
            //       "match_all": {}
            //     },
            //     "filter": {
            //       "geo_distance": {
            //         "distance": "10km",
            //         "location": [116.52325,39.87126],
            //       }
            //     }
            //   }

            // 搜索矩形范围区域内的点
            // "bool": {
            //     "must": {
            //         "match_all": {}
            //     },
            //     "filter": {
            //       "geo_bounding_box": {
            //         "location": {
            //           "top_left": [116.52325,39.87126],
            //           "bottom_right": [116.53325,39.86126]
            //         }
            //       }
            //     }
            //   },

            // 搜索多边形区域内的点
            // "bool": {
            //     "must": [{
            //         "match_all": {}
            //     }],
            //     "filter": {
            //         "geo_polygon": {
            //             "location": {
            //                 "points": [
            //                     [116.529251, 39.870735],
            //                     [116.487755, 39.670625],
            //                     [116.568255, 39.770525]
            //                 ]
            //             }
            //         }
            //     }
            // }

        },
        // "aggs": {
        //     "house_count": {
        //         "cardinality": {
        //             "field": "RZF_XZDXXDZ.keyword"
        //         }
        //     }
        // }
    }
}).then(res => {
    let total = res.body.hits.total
    let arrPoint = res.body.hits.hits
    console.log(arrPoint);
    console.log(total);
    // console.log(res.body.aggregations);  // 房屋去重计数
}).catch(e => {
    console.log(e);
})



