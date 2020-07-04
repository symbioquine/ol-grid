import Interaction from 'ol/interaction/Interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { getChangeEventType } from 'ol/Object';

import { getCenter as getExtentCenter } from 'ol/extent';
import { getDistance as getSphericalDistance } from 'ol/sphere';
import {transform} from 'ol/proj';

import Feature from 'ol/Feature';
import { MultiPoint, Point } from 'ol/geom';

/**
 * @typedef {Object} Options
 * @property {ol.Coordinate} [originCoordinate=[0, 0]] origin coordinate for the grid
 * @property {ol.Coordinate} [rotationAnchorCoordinate] coordinate describing the rotation of the grid
 * @property {number} [xGridSize] the x grid size. If the origin point and rotation anchor point have the same latitude, then this sets the horizontal (width) of the grid cells.
 * @property {number} [yGridSize] the y grid size. If the origin point and rotation anchor point have the same latitude, then this sets the vertical (height) of the grid cells.
 * @property {number} [maxPointsPerSide] the max number of points per side. Controls the maximum number of points to be drawn on the screen at one time.
 * @property {ol.style.StyleLike} [style] grid point style
 */

const DEFAULT_ORIGIN_COORDINATE = [0, 0];
const DEFAULT_GRID_SIZE = 10;
const DEFAULT_MAX_POINTS_PER_SIDE = 64;

/**
 * @classdesc
 * Creates a grid of points within the current map extents based on two points
 * and x/y grid cell sizes in map units.
 *
 * @api
 */
export default class Grid extends Interaction {

  /**
   * @param {Options=} opt_options Options.
   */
  constructor(opt_options) {

    const options = opt_options ? opt_options : {};

    super(/** @type {Interaction.InteractionOptions} */ (options));

    this.originCoordinate = options.originCoordinate || DEFAULT_ORIGIN_COORDINATE;
    this.rotationAnchorCoordinate = options.rotationAnchorCoordinate || null;
    this.xGridSize = options.xGridSize || DEFAULT_GRID_SIZE;
    this.yGridSize = options.yGridSize || DEFAULT_GRID_SIZE;
    this.maxPointsPerSide = options.maxPointsPerSide || DEFAULT_MAX_POINTS_PER_SIDE;

    /**
     * Draw overlay where our grid feature is drawn.
     * @type {VectorLayer}
     * @private
     */
    this.overlay_ = new VectorLayer({
      source: createAlwaysVisibleVectorSource(),
      style: options.style,
      updateWhileInteracting: true
    });

    /**
     * Feature used to draw our grid.
     * @type {Feature}
     * @private
     */
    this.gridFeature_ = new Feature({
      geometry: new MultiPoint([])
    });

    this.updateGridDescription_();

    this.overlay_.getSource().addFeature(this.gridFeature_);

    this.overlay_.on('postrender', this.handleGridLayerPostRender_.bind(this));
    this.addEventListener(getChangeEventType('active'), this.updateState_);
  }

  /**
   * Get a feature containing the current grid points. Callers should not
   * modify the feature or its geometry, but may use it to modify the behavior
   * of the map - such as adding it to a Snap interaction. The feature geometry
   * is empty when the grid is not active.
   * @return {Feature} grid feature with a single MultiPoint geometry.
   * @api
   */
  getGridFeature() {
    return this.gridFeature_;
  }

  /**
   * Set the origin coordinate for the grid.
   * @param {ol.Coordinate} originCoordinate Coordinate.
   * @api
   */
  setOriginPoint(originCoordinate) {
    this.originCoordinate = originCoordinate;
    this.updateGridDescription_();
  }

  /**
   * Set the rotation anchor coordinate used to control how the rid is rotated.
   * @param {ol.Coordinate} rotationAnchorCoordinate Coordinate.
   * @api
   */
  setRotationControlPoint(rotationAnchorCoordinate) {
    this.rotationAnchorCoordinate = rotationAnchorCoordinate;
    this.updateGridDescription_();
  }

  /**
   * Set the x grid size. If the origin point and rotation anchor point have the
   * same latitude, then this sets the horizontal (width) of the grid cells.
   * @param {number} xGridSize number in map units.
   * @api
   */
  setXGridSize(xGridSize) {
    this.xGridSize = xGridSize;
    this.updateGridDescription_();
  }

  /**
   * Set the y grid size. If the origin point and rotation anchor point have the
   * same latitude, then this sets the vertical (height) of the grid cells.
   * @param {number} yGridSize number in map units.
   * @api
   */
  setYGridSize(yGridSize) {
    this.set(yGridSize, )
    this.yGridSize = yGridSize;
    this.updateGridDescription_();
  }

  /**
   * Set the max number of points per side. Controls the maximum number of points
   * to be drawn on the screen at one time.
   * @param {number} maxPointsPerSide number of points per side.
   * @api
   */
  setMaxPointsPerSide(maxPointsPerSide) {
    this.maxPointsPerSide = maxPointsPerSide;
    this.changed();
  }

  /**
   * Set the style of the grid points.
   * @param {ol.style.StyleLike} style of the grid points.
   * @api
   */
  setStyle(style) {
    this.overlay_.setStyle(style);
  }

  /**
   * @param {ol.PluggableMap} map Map.
   */
  setMap(map) {
    super.setMap(map);
    this.updateState_();
  }

  /**
   * @private
   */
  updateState_() {
    const map = this.getMap();
    const active = this.getActive();
    this.overlay_.setMap(active ? map : null);
    this.updateGridDescription_();
  }

  /**
   * @private
   */
  updateGridDescription_() {
    const map = this.getMap();

    if (!map || !this.originCoordinate || !this.xGridSize || !this.yGridSize || !this.getActive()) {
      this.gridDescription_ = null;
      this.gridFeature_.getGeometry().setCoordinates([]);
      this.changed();
      return;
    }

    const mapViewProj = map.getView().getProjection();

    // ol.sphere.getDistance - a.k.a. 'getSphericalDistance' here - only seems to work correctly
    // in 'EPSG:4326'
    const cp1 = transform(this.originCoordinate, mapViewProj, 'EPSG:4326');

    const rotationAnchorCoordinate = this.rotationAnchorCoordinate || addVectors(this.originCoordinate, [1, 0]);

    const cp2 = transform(rotationAnchorCoordinate, mapViewProj, 'EPSG:4326');

    const cp3 = [cp1[0], cp2[1]];
    const cp4 = [cp2[0], cp1[1]];

    const len = getSphericalDistance(cp1, cp2);
    let rise = getSphericalDistance(cp1, cp3);
    let run = getSphericalDistance(cp1, cp4);

    // Potential bug: This approach to calculating the direction of the rise/run probably won't
    // work correctly when the coordinates wrap around.
    if (cp1[0] > cp2[0]) {
      run *= -1;
    }

    if (cp1[1] > cp2[1]) {
      rise *= -1;
    }

    const riseFactor = rise / len;
    const runFactor = run / len;

    this.gridDescription_ = {
      originPoint: new Point(this.originCoordinate),
      riseFactor,
      runFactor,
      xDim: this.xGridSize,
      yDim: this.yGridSize,
    };

    this.changed();
  }

  /**
   * Handle post render events for our grid layer
   * @param {ol.render.Event} event A render event.
   * @private
   */
  handleGridLayerPostRender_(event) {
    const map = this.getMap();

    const gridDescription = this.gridDescription_;

    if (!gridDescription) {
      return;
    }

    const viewExtent = map.getView().calculateExtent(map.getSize());

    const selectedOriginCoords = gridDescription.originPoint.getCoordinates();

    // Calculate orthogonal basis vectors for the grid
    let xBasisVector = [
      gridDescription.xDim * gridDescription.runFactor,
      gridDescription.xDim * gridDescription.riseFactor,
    ];
    let yBasisVector = [
      gridDescription.yDim * (-1) * gridDescription.riseFactor,
      gridDescription.yDim * gridDescription.runFactor,
    ];

    const localSphereNormalizationCoefficients = this
      .calculateLocalSphereNormalizationCoefficients(gridDescription.originPoint);

    xBasisVector = elementWiseVectorProduct(xBasisVector,
      localSphereNormalizationCoefficients);
    yBasisVector = elementWiseVectorProduct(yBasisVector,
      localSphereNormalizationCoefficients);

    const viewExtentCenter = getExtentCenter(viewExtent);

    const viewCenterCoordinateVector = getAlignedIntegerCoordinateVector(
      selectedOriginCoords,
      xBasisVector,
      yBasisVector,
      viewExtentCenter,
    );

    const vOriginCoords = addVectors(selectedOriginCoords, multiplyTwoByTwoMatrixByTwoVector(
      [xBasisVector, yBasisVector],
      viewCenterCoordinateVector,
    ));

    const vOrigin = new Point(vOriginCoords);

    const vGridExtentCoordinateVectors = getCoordinateVectorsToExtentCorners(
      vOriginCoords,
      xBasisVector,
      yBasisVector,
      viewExtent,
    );

    const gridPoints = calculateGridPoints(
      viewExtent,
      vOrigin,
      vGridExtentCoordinateVectors,
      xBasisVector,
      yBasisVector,
      this.maxPointsPerSide,
    );

    this.gridFeature_.getGeometry().setCoordinates(gridPoints);
  }

  calculateLocalSphereNormalizationCoefficients(origin) {
    const mapViewProjCode = this.getMap().getView().getProjection().getCode();

    function asEpsg4326Coords(point) {
      return point
        .transform(mapViewProjCode, 'EPSG:4326')
        .getCoordinates();
    }

    function translateCopy(point, deltaX, deltaY) {
      const p = point.clone();
      p.translate(deltaX, deltaY);
      return p;
    }

    const originCoords = asEpsg4326Coords(origin.clone());
    const testXCoords = asEpsg4326Coords(translateCopy(origin, 1, 0));
    const testYCoords = asEpsg4326Coords(translateCopy(origin, 0, 1));

    return [
      1 / getSphericalDistance(originCoords, testXCoords),
      1 / getSphericalDistance(originCoords, testYCoords),
    ];
  }

}

function getGridPoint(vOrigin, xi, yi, xBasisVector, yBasisVector) {
  const xVector = scaleVector(xBasisVector, xi);
  const yVector = scaleVector(yBasisVector, yi);

  const p = vOrigin.clone();
  p.setCoordinates(addVectors(vOrigin.getCoordinates(), xVector, yVector));

  return p;
}

// Assumes M is a 2x2 matrix as an array of columns
function invertTwoByTwoMatrix(M) {
  const A = M[0][0];
  const B = M[0][1];
  const C = M[1][0];
  const D = M[1][1];

  const divisor = (A * D - B * C);

  return [
    [
      D / divisor,
      -B / divisor,
    ],
    [
      -C / divisor,
      A / divisor,
    ],
  ];
}

// Assumes M is a 2x2 matrix as an array of columns
// Assumes V is an array of size two
function multiplyTwoByTwoMatrixByTwoVector(M, V) {
  const A = M[0][0];
  const B = M[0][1];
  const C = M[1][0];
  const D = M[1][1];

  const E = V[0];
  const F = V[1];

  return [
    A * E + C * F,
    B * E + D * F,
  ];
}

function getCoordinateVector(bx, by, Z) {
  const I = invertTwoByTwoMatrix([bx, by]);

  return multiplyTwoByTwoMatrixByTwoVector(I, Z);
}

function getIntegerCoordinateVector(bx, by, Z, roundingFunction) {
  const round = roundingFunction || Math.round;

  const cv = getCoordinateVector(bx, by, Z);

  return [round(cv[0]), round(cv[1])];
}

function subtractVectors(va, vb) {
  return [va[0] - vb[0], va[1] - vb[1]];
}

function addVectors(va, vb, vc) {
  if (vc) {
    return [va[0] + vb[0] + vc[0], va[1] + vb[1] + vc[1]];
  }
  return [va[0] + vb[0], va[1] + vb[1]];
}

function scaleVector(v, c) {
  return [v[0] * c, v[1] * c];
}

function elementWiseVectorProduct(va, vb) {
  return [va[0] * vb[0], va[1] * vb[1]];
}

/*
 * Get the integer coordinate vector between a given origin and point Z in terms of the basis
 * vectors [bx, by].
 */
function getAlignedIntegerCoordinateVector(origin, bx, by, Z, roundingFunction) {
  const zOffset = subtractVectors(Z, origin);

  return getIntegerCoordinateVector(bx, by, zOffset, roundingFunction);
}

function getCoordinateVectorsToExtentCorners(origin, bx, by, extent) {
  return [
    getAlignedIntegerCoordinateVector(origin, bx, by, [extent[0], extent[1]], Math.ceil),
    getAlignedIntegerCoordinateVector(origin, bx, by, [extent[2], extent[3]], Math.ceil),
    getAlignedIntegerCoordinateVector(origin, bx, by, [extent[0], extent[3]], Math.ceil),
    getAlignedIntegerCoordinateVector(origin, bx, by, [extent[2], extent[1]], Math.ceil),
  ];
}

function calculateGridPoints(
  viewExtent,
  vOrigin,
  vGridExtentCoordinateVectors,
  xBasisVector,
  yBasisVector,
  maxPointsPerSide,
) {
  const x1 = vGridExtentCoordinateVectors[0][0];
  const y1 = vGridExtentCoordinateVectors[0][1];

  const x2 = vGridExtentCoordinateVectors[1][0];
  const y2 = vGridExtentCoordinateVectors[1][1];

  const x3 = vGridExtentCoordinateVectors[2][0];
  const y3 = vGridExtentCoordinateVectors[2][1];

  const x4 = vGridExtentCoordinateVectors[3][0];
  const y4 = vGridExtentCoordinateVectors[3][1];

  const minX = Math.min(x1, x2, x3, x4);
  const minY = Math.min(y1, y2, y3, y4);

  const maxX = Math.max(x1, x2, x3, x4);
  const maxY = Math.max(y1, y2, y3, y4);

  const deltaX = maxX - minX;
  const deltaY = maxY - minY;

  const incrementX = Math.max(1, Math.floor(deltaX / maxPointsPerSide));
  const incrementY = Math.max(1, Math.floor(deltaY / maxPointsPerSide));

  const gridPointCoords = [];

  for (let xi = minX; xi <= maxX; xi += incrementX) {
    for (let yi = minY; yi <= maxY; yi += incrementY) {

      const gridPoint = getGridPoint(vOrigin, xi, yi, xBasisVector, yBasisVector);

      if (gridPoint.intersectsExtent(viewExtent)) {
        gridPointCoords.push(gridPoint.getCoordinates());
      }

    }
  }

  return gridPointCoords;
}

/**
 * @returns a vector source which always returns all its features - ignoring extents.
 * @private
 */
function createAlwaysVisibleVectorSource() {
  const vectorSource = new VectorSource({
    useSpatialIndex: false,
    features: [],
    wrapX: false,
  });

  // Monkey-patch this function to ensure the grid is always rendered even
  // when the origin/rotation points are outside the view extents
  vectorSource.getFeaturesInExtent = vectorSource.getFeatures;

  return vectorSource;
}
