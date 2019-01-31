import authFile from "../auth.json";

// Initialize the population layer
var dataset = ee.ImageCollection('CIESIN/GPWv4/population-count');
var populationCount = dataset.select('population-count').mean();

// For running in the earth engine online code editor (testing purpose)
var populationCountVis = {
  // The data range for the four colors to represent
  min: 0.0,
  max: 3000.0,
  palette: ['ffffff', 'FFE0B2', 'FF9800', 'FF5722'],
  opacity: 0.3
};
Map.setCenter(151.2093, -33.8688, 10);
Map.addLayer(populationCount, populationCountVis, 'Population Count');


// For exporting
var palette = ['ffffff', 'FFE0B2', 'FF9800', 'FF5722'];
Export.map.toCloudStorage({
  image: populationCount.visualize({min: 0, max: 3000, palette: palette, opacity: 0.3}),
  description: 'pop_count',
  bucket: authFile.CloudBucketName,
  path: authFile.CloudPathName,
  fileFormat: 'auto',
  maxZoom: 14,
  minZoom: 0,
});
