const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://192.168.130.64:9200' });
const searchPoint = require('./searchPoint')

/**
 * 关键词首先查询区县点，拿到点的坐标
 * 然后查询区县界线，拿到bbox（左下角，右上角）得到范围
 * 最后判断点坐标是否在这个范围内。若在，返回该区县界线
 */

client.search({
    index: "quxian",
    size: 10,
    from: 0,
    body: {
        "query": {
            "match_phrase": {
                "properties.Name": "东城区",
            }
        }
    }
}).then(res1 => {
    let arrPoint = res1.body.hits.hits
    arrPoint.forEach(item1 => {
        console.log(item1);
        let pointX = item1._source.properties.POINT_X
        let pointY = item1._source.properties.POINT_Y
        console.log(typeof pointX);
        

        client.search({
            index: "beijingquxianjiexian",
            size: 10,
            body: {
                "query": {
                    "bool": {
                        "must": {
                            "match_all": {}
                        }
                    }
                }
            }
        }).then(res2 => {
            let arrArea = res2.body.hits.hits
            arrArea.forEach(item2 => {
                console.log(item2);
                console.log(item2._source.properties.bbox);
                
                let leftlon = item2._source.properties.bbox[0]
                let bottomlat = item2._source.properties.bbox[1]
                let rightlon = item2._source.properties.bbox[2]
                let toplat = item2._source.properties.bbox[3]
                console.log(typeof leftlon);
                
                if(leftlon < pointX && pointX < rightlon && bottomlat < pointY && pointY < toplat) {
                    console.log('success!');
                }else {
                    console.log('error');
                }
            });
        })

    });
})




