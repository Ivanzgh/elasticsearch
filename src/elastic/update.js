const { Client } = require('@elastic/elasticsearch');
const config = require('../../config');
const client = new Client({node: config.elasticsearch});


/**
 * 更改流管标准地址库数据
 * 单独更新一个文档
 * @param {array} data 修改的数据
 * @returns {Promise<[]>}  data中的字段若存在则覆盖，没有则创建新字段
 */
async function updateLgbzdzk(data) {
    let body = {}, _id = "";
    let updated = []
    for (let i = 0; i < data.length; i++) {
        _id = data[i].RDJ_GRBH
        body.doc = data[i].data
        await client.update({
            index: "lgbzdzk",
            id: _id,
            body: body
        }).then(res => {
            updated.push(res.body)
        })
    }
    return updated;
}



// function updateLgbzdzk(data) {
//     let body = {
//         script: {
//             lang: 'painless',
//             source: 'ctx._source["BIP_XM"] = data.data.BIP_XM'
//         },
//         query: {
//             match: {
//                 "RDJ_GRBH": data.RDJ_GRBH
//             }
//         }
//     }
//     return client.updateByQuery({
//         index: "lgbzdzk",
//         refresh: true,
//         body: body
//     })
// }

// function updateLgbzdzk(grbh,data) {
//     let body = {}, _id = "";
//     if (grbh && data) {
//         body.doc = data
//         _id = grbh
//     }
//     return client.update({
//         index: "lgbzdzk",
//         id: _id,
//         body: body
//     })
// }

module.exports = {
    updateLgbzdzk
}