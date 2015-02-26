var inside = require('turf-inside');

/**
 * Takes a set of points and a set of polygons and performs a spatial join.
 *
 * @module turf/tag
 * @category joins
 * @param {FeatureCollection<Point>} points input points
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {String} polyId property in `polygons` to add to joined Point features
 * @param {String} containingPolyId property in `points` in which to store joined property from `polygons
 * @return {FeatureCollection<Point>} points with `containingPolyId` property containing values from `polyId`
 * @example
 * var bbox = [0, 0, 50, 50];
 * // create a triangular grid of polygons
 * var triangleGrid = turf.tin(turf.grid(bbox, 10));
 * triangleGrid.features.forEach(function(f) {
 *   f.properties.fill = '#' +
 *     (~~(Math.random() * 16)).toString(16) +
 *     (~~(Math.random() * 16)).toString(16) +
 *     (~~(Math.random() * 16)).toString(16);
 *   f.properties.stroke = 0;
 *   f.properties['fill-opacity'] = 1;
 * });
 * var randomPoints = turf.random('point', 30, {
 *   bbox: bbox
 * });
 * var both = turf.featurecollection(
 *   triangleGrid.features.concat(randomPoints.features));
 *
 * //=both
 *
 * var tagged = turf.tag(randomPoints, triangleGrid,
 *                       'fill', 'marker-color');
 *
 * //=tagged
 */
module.exports = function(points, polygons, field, outField){
  // prevent mutations
  points = JSON.parse(JSON.stringify(points));
  polygons = JSON.parse(JSON.stringify(polygons));
  points.features.forEach(function(pt) {
    if (!pt.properties) {
      pt.properties = {};
    }
    polygons.features.forEach(function(poly) {
      if (pt.properties[outField] === undefined) {
        var isInside = inside(pt, poly);
        if (isInside) {
          pt.properties[outField] = poly.properties[field];
        }
      }
    });
  });
  return points;
};
