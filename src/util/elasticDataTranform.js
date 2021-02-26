/**
 * 将数据转换成elasticsearch bulk方法调用接收的数据
 * @param index 索引
 * @param data 需要转换的数据
 */
function bulkData(index, data) {
  let arr = data.data.features;
  arr.forEach((result) => {
    let coordinates_str = JSON.stringify(result.geometry.coordinates);
    let edit_arr = coordinates_str.replace(
      /\[(\d{3}\.\d+\,\d{2}\.\d+)\,0\]/gim,
      "[$1]"
    );
    let new_coordinates = JSON.parse(edit_arr);
    result.geometry.coordinates = new_coordinates;
  });
  let bulkbody = [];
  arr.forEach((item) => {
    bulkbody.push({
      index: {
        _index: index,
        _id: item.id,
      },
    });
    bulkbody.push(item);
  });
  return bulkbody;
}

module.exports.bulkData = bulkData;
