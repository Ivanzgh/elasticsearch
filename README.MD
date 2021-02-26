# elasticsearch

## 下载

[elasticsearch下载](https://www.elastic.co/cn/downloads/)

## 相关文档

+ [elasticsearch官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/docs.html)
+ [最新版本的文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
+ [Elasticsearch Node.js client [7.x]](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
+ [Elasticsearch Node.js client [7.x] api-reference](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html)
+ [Geo queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-queries.html)
+ [集群配置](https://www.elastic.co/guide/en/elasticsearch/reference/7.8/important-settings.html)
+ [更改集群中分片的分配](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-queries.html)

## 已完成的功能

+ 数据批量导入
+ 数据更新
+ 数据删除
+ 数据查询

## 具体业务功能

+ POI搜索（包括关键字搜索、周边搜索、矩形搜索三种筛选机制）
+ 公交站点搜索
+ 地理编码（POI搜索）
+ 行政区划（根据地理坐标信息，掌握地点所在省/市区域、以及区域形状点数据）
+ 乡镇界区域搜索
+ 按行政村名字查询建筑轮廓
+ 流管标准地址库搜索（按地址搜索人房数据，区域统计）

## 目录说明

```sh
+ config.js 配置文件
+ app 静态文件夹
+ data 请求geoserver数据
+ src 源码
    + elastic 操作文件夹
    + resource 开放接口文件夹
    + util 公共工具方法
```
