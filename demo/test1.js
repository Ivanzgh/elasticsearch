const { Client } = require('@elastic/elasticsearch');
const config = require('../config');
const client = new Client({node: config.elasticsearch});

client.search({
    index: "lgbzdzk_fw",
    from: 0,
    size: 3,
    body: {
        "track_total_hits": true,
        "query": {
            "match_all": {}
        }
    }
}).then(res => {
    let total = res.body.hits.total
    let arrPoint = res.body.hits.hits
    console.log(arrPoint);
    console.log(total);
}).catch(e => {
    console.log(e);
})


// client.search({
//     index: 'lgbzdzk_fw',
//     body: {
//         "query": {
//             "bool": {
//                 "must":{
//                     "match_all": {}
//                 },
//                 "filter": {
//                     "terms": {
//                         "BIH_ID": ['fb31a98a471c00', '7e2311b426e000', '7e1ce21f3dad00','7e246208c85100','fb3cf51ede2f00']
//                         // "RDJ_GRBH": ['7e1822dc497600','7d89cc00555700','bc8c0c13bcc300','bcb993e117a200']
//                     }
//                 }
//             }
//         }
//     }
// }).then(res => {
//     console.log(res.body.hits.hits)
// })

// client.search({
//     index: 'lgbzdzk_ry',
//     from: 0,
//     size: 3,
//     body: {
//         "track_total_hits": true,
//         "query": {
//             // "match": {
//             //     "BIP_SFZHM": "220503198911031320"
//             // }
//
//             "match": {
//                 "RDJ_GRBH": "bc14b316301f00"
//                 // "BIP_SFZHM": "612101196405106220"
//             }
//
//             // "match_all": {}
//         }
//     }
// }).then(res => {
//     console.log(res.body.hits.hits)
// })


// 7daacba102fc00
// bc04e3ccd08c00
// bc14b316301f00
//
// 152725196907250313
// 220211199701170013
// 231083199107203226