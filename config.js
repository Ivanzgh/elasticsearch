module.exports = {
    'geoserver': process.env.GEOSERVER ? process.env.GEOSERVER : 'http://130.10.8.111:8600/geoserver',
    // 'elasticsearch': process.env.ELASTICSEARCH ? process.env.ELASTICSEARCH : 'http://localhost:9200'
    'elasticsearch': process.env.ELASTICSEARCH ? process.env.ELASTICSEARCH : 'http://130.10.8.111:9200'
};