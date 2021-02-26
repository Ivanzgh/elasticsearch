let importLayer = require('../../elastic/importLayer').importLayer;

 function importAllLayer() {
   let layers = [
     'wlxt_beijing_weishengshebao', // 663172
     'wlxt_beijing_yundongxiuxian', // 23074
     'wlxt_beijing_shangyesheshijifuwu',//ok 13629
     'wlxt_beijing_qichexiaoshoujifuwu', //ok 8503
     'wlxt_beijing_pifalingshou', //ok 98777
     'wlxt_beijing_nonglinmuyuye', //ok 694
     'wlxt_beijing_kejijijishufuwu', // ok 3065
     'wlxt_beijing_juminfuwu',//ok 54288
     'wlxt_beijing_jinrongbaoxian', //ok 14696
     'wlxt_beijing_jiaoyuwenhua', //ok 22811
     'wlxt_beijing_gongsiqiye', //50053
     'wlxt_beijing_jiaotongyunshucangchu', // ok 33256
     'wlxt_beijing_gongyongsheshi', //ok 18715
     'BeijingBusStops', //ok 42161
     'wlxt_beijing_ditiezhan', //ok 315
     'wlxt_beijing_canyin', //ok 54887
     'wlxt_beijing_zhusu', //ok 31115
     'wlxt_beijing_xingququ', //ok 114
     'BeijingBusLines',//ok 1543
     'wlxt_beijing_ditie', // ok 42
     'wlxt_beijing_ditie_color',//ok 42
     'wlxt_beijing_dushigaosulu', //ok 6985
     'wlxt_beijing_gaosugonglu', //ok 10017
     'wlxt_beijing_global',//ok 1
     'wlxt_beijing_gongnengmian',//ok 98
     'wlxt_beijing_guodao', //ok 7362
     'wlxt_beijing_jiujilu',//ok 3784
     // 'wlxt_beijing_qitadaolu', // 50
     'wlxt_beijing_quxianjiexian', // 3749
     'wlxt_beijing_shengdao', // ok 35272
     'wlxt_beijing_shijie', //ok 1
     //'wlxt_beijing_shuixi',
     //'wlxt_beijing_shuixi_xian',
     'wlxt_beijing_tielu', //ok 17
     'wlxt_beijing_xiandao', // ok 37822
  //   'wlxt_beijing_xiangzhendaolu', 50
     'wlxt_beijing_xianjishi', //ok 16
     'wlxt_beijing_xingrendaolu', //ok 24048
     //'wlxt_beijing_zhibei',
     'wlxt_beijing_xiangzhenjie',
     'wlxt_beijing_quxianjie'
   ];

   // let layers = [
   //   'wlxt_beijing_shangyesheshijifuwu',
   //   'wlxt_beijing_yundongxiuxian',
   //   'wlxt_beijing_gaosugonglu',
   //   'wlxt_beijing_xingrendaolu'
   // ]
  // let layers = [
  //   'wlxt_beijing_quxianjie',
  // ];
  try {
    layers.forEach(async function (item) {
      await importLayer(item);
    });

    return true;
  }catch (e) {
    return e;
  }
  
  
}

module.exports = {
  importAllLayer
}