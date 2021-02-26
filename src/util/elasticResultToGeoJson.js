function elasticResultToGeoJson(data) {
  if (Array.isArray(data)) {
    let features = [];
    let geojson = { type: "FeatureCollection", features: features };
    data.forEach((item) => {
      features.push(item["_source"]);
    });
    return geojson;
  } else {
    return false;
  }
}

function elasticResultEdit(data) {}

module.exports.elasticResultToGeoJson = elasticResultToGeoJson;
