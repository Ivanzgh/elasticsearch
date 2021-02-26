let axios = require("axios");
let randomjson = require("randomjson");

let dd = Math.random() * 10;

let modelJson = {
  "data<@{5000}>": [
    {
      RDJ_GRBH: "<@index>" + dd,
      BIP_XM: "姓名",
      BIP_SFZHM: "133024196310251658",
      FWZJBXXDJB_FWZBH: "7da462c1362200",
      RZF_XZDXZQH: "110112001027",
      RZF_XZDXXDZ: "北京市翻斗大街翻斗花园1号楼",
      DZBM: "1101122301000_0026_00_00_0003_0003_0002_0001",
      JD: "116.67528",
      WD: "39.9020300005",
      TJSJ: "20200115000555",
      user: "2333",
    },
  ],
};

let myjson = randomjson(modelJson);
console.log(Array.isArray(myjson.data));
console.log(myjson.data.length);
// console.log(myjson)

axios
  .post("http://192.168.130.63:5000/lgMulityInsert/ry", myjson)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  });
