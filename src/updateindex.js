const { Client } = require("@elastic/elasticsearch");
const config = require("../config");
const client = new Client({ node: config.elasticsearch });
let geo_point = [
  "wlxt_beijing_weishengshebao",
  "wlxt_beijing_yundongxiuxian",
  "wlxt_beijing_shangyesheshijifuwu",
  "wlxt_beijing_qichexiaoshoujifuwu",
  "wlxt_beijing_pifalingshou",
  "wlxt_beijing_nonglinmuyuye",
  "wlxt_beijing_kejijijishufuwu",
  "wlxt_beijing_juminfuwu",
  "wlxt_beijing_jinrongbaoxian",
  "wlxt_beijing_jiaoyuwenhua",
  "wlxt_beijing_gongsiqiye",
  "wlxt_beijing_jiaotongyunshucangchu",
  "wlxt_beijing_gongyongsheshi",
  "beijingbusstops",
  "wlxt_beijing_ditiezhan",
  "wlxt_beijing_canyin",
  "wlxt_beijing_zhusu",
  "wlxt_beijing_xingququ",
];

let geo_shape = [
  "beijingbuslines",
  "wlxt_beijing_ditie_color",
  "wlxt_beijing_ditie",
  "wlxt_beijing_dushigaosulu",
  "wlxt_beijing_gaosugonglu",
  "wlxt_beijing_global",
  "wlxt_beijing_gongnengmian",
  "wlxt_beijing_guodao",
  "wlxt_beijing_jiujilu",
  "wlxt_beijing_qitadaolu",
  "wlxt_beijing_quxianjiexian",
  "wlxt_beijing_shengdao",
  "wlxt_beijing_shijie",
  "wlxt_beijing_tielu",
  "wlxt_beijing_xiandao",
  "wlxt_beijing_xiangzhendaolu",
  "wlxt_beijing_xianjishi",
  "wlxt_beijing_xingrendaolu",
  "wlxt_beijing_quxianjie",
  "wlxt_beijing_xiangzhenjie",
];

geo_point.forEach((item) => {
  return client.indices
    .create({
      index: item,
      body: {
        mappings: {
          properties: {
            "geometry.coordinates": {
              type: "geo_point",
            },
          },
        },
      },
    })
    .catch((e) => {
      console.log(e);
    });
});

geo_shape.forEach((item) => {
  return client.indices
    .create({
      index: item,
      body: {
        mappings: {
          properties: {
            geometry: {
              type: "geo_shape",
            },
          },
        },
      },
    })
    .catch((e) => {
      console.log(e);
    });
});
