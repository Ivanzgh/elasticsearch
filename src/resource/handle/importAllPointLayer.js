let importLayer = require('../../elastic/importLayer').importLayer;

 function importAllPointLayer() {
   let layers = [
     'wlxt_beijing_weishengshebao',
     'wlxt_beijing_yundongxiuxian',
     'wlxt_beijing_shangyesheshijifuwu',
     'wlxt_beijing_qichexiaoshoujifuwu',
     'wlxt_beijing_pifalingshou',
     'wlxt_beijing_nonglinmuyuye',
     'wlxt_beijing_kejijijishufuwu',
     'wlxt_beijing_juminfuwu',
     'wlxt_beijing_jinrongbaoxian',
     'wlxt_beijing_jiaoyuwenhua',
     'wlxt_beijing_gongsiqiye',
     'wlxt_beijing_jiaotongyunshucangchu',
     'wlxt_beijing_gongyongsheshi',
     'wlxt_beijing_beijingbusstops',
     'wlxt_beijing_ditiezhan',
     'wlxt_beijing_canyin',
     'wlxt_beijing_zhusu',
     'wlxt_beijing_xingququ'
   ];

  try {
    layers.forEach(async function (item) {
      await importLayer(item);
    })
    return true;
  }catch (e) {
    return e;
  }
  
  
}

module.exports = {
  importAllPointLayer
}