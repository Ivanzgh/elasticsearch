let importLayer = require('../../elastic/importLayer').importLayer;

 function importLayers(layers) {
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
  importLayers
}