let importAllLayer = require("./resource/handle/importAllLayer").importAllLayer;

importAllLayer();

let insert = require("./elastic/insert");

async function insertOtherData() {
  try {
    await insert.qitadaolu();
    await insert.xiangzhendaolu();
    await insert.pgz_jzlk();
    console.log("数据导入完毕");
  } catch (e) {
    console.log("数据导入失败");
  }
}

insertOtherData();
