# ol-grid

[![Licence](https://img.shields.io/badge/Licence-MIT-blue.svg)](https://opensource.org/licenses/MIT/)
[![Release](https://img.shields.io/github/release/symbioquine/ol-grid.svg?style=flat)](https://github.com/symbioquine/ol-grid/releases)
[![Last commit](https://img.shields.io/github/last-commit/symbioquine/ol-grid.svg?style=flat)](https://github.com/symbioquine/ol-grid/commits)

Dynamic grid implementation for OpenLayers 6.

Renders a regular grid of points within the current view extents. Intended for use as part of advanced snapping controls.

![image](https://user-images.githubusercontent.com/30754460/83771632-55bbbb00-a637-11ea-8002-c04d818cc274.png)

## Getting started

### All-in-one example

```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.14.1/css/ol.css" type="text/css">
    <style>
      .map {
        height: 400px;
        width: 100%;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.14.1/build/ol.js"></script>
    <script src="https://github.com/symbioquine/ol-grid/releases/download/v1.1.7/ol-grid.umd.js"></script>
    <title>OpenLayers ol-grid example</title>
  </head>
  <body>
    <h2>My Map</h2>
    <div id="map" class="map"></div>
    <script type="text/javascript">
      var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: [0, 0],
          zoom: 20
        })
      });
      map.addInteraction(new olGrid({ originCoordinate: [5, 0], rotationAnchorCoordinate: [1, 1], xGridSize: 5, yGridSize: 10, }));
    </script>
  </body>
</html>
```

### Via NPM

```sh
npm i ol-grid
```

```Javascript
import Grid from 'ol-grid';

...

map.addInteraction(new olGrid());
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [Options](#options)
    -   [Properties](#properties)
-   [Grid](#grid)
    -   [Parameters](#parameters)
    -   [getGridFeature](#getgridfeature)
    -   [setOriginPoint](#setoriginpoint)
        -   [Parameters](#parameters-1)
    -   [setRotationControlPoint](#setrotationcontrolpoint)
        -   [Parameters](#parameters-2)
    -   [setXGridSize](#setxgridsize)
        -   [Parameters](#parameters-3)
    -   [setYGridSize](#setygridsize)
        -   [Parameters](#parameters-4)
    -   [setMaxPointsPerSide](#setmaxpointsperside)
        -   [Parameters](#parameters-5)
    -   [setStyle](#setstyle)
        -   [Parameters](#parameters-6)
    -   [setMap](#setmap)
        -   [Parameters](#parameters-7)
    -   [changed](#changed)

### Options

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

-   `originCoordinate` **ol.Coordinate?** origin coordinate for the grid
-   `rotationAnchorCoordinate` **ol.Coordinate?** coordinate describing the rotation of the grid
-   `xGridSize` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** the x grid size. If the origin point and rotation anchor point have the same latitude, then this sets the horizontal (width) of the grid cells.
-   `yGridSize` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** the y grid size. If the origin point and rotation anchor point have the same latitude, then this sets the vertical (height) of the grid cells.
-   `maxPointsPerSide` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)?** the max number of points per side. Controls the maximum number of points to be drawn on the screen at one time.
-   `style` **ol.style.StyleLike?** grid point style

### Grid

**Extends Interaction**

#### Parameters

-   `opt_options` **[Options](#options)?** Options.

#### getGridFeature

Get a feature containing the current grid points. Callers should not
modify the feature or its geometry, but may use it to modify the behavior
of the map - such as adding it to a Snap interaction. The feature geometry
is empty when the grid is not active.

Returns **Feature** grid feature with a single MultiPoint geometry.

#### setOriginPoint

Set the origin coordinate for the grid.

##### Parameters

-   `originCoordinate` **ol.Coordinate** Coordinate.

#### setRotationControlPoint

Set the rotation anchor coordinate used to control how the rid is rotated.

##### Parameters

-   `rotationAnchorCoordinate` **ol.Coordinate** Coordinate.

#### setXGridSize

Set the x grid size. If the origin point and rotation anchor point have the
same latitude, then this sets the horizontal (width) of the grid cells.

##### Parameters

-   `xGridSize` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** number in map units.

#### setYGridSize

Set the y grid size. If the origin point and rotation anchor point have the
same latitude, then this sets the vertical (height) of the grid cells.

##### Parameters

-   `yGridSize` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** number in map units.

#### setMaxPointsPerSide

Set the max number of points per side. Controls the maximum number of points
to be drawn on the screen at one time.

##### Parameters

-   `maxPointsPerSide` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of points per side.

#### setStyle

Set the style of the grid points.

##### Parameters

-   `style` **ol.style.StyleLike** of the grid points.

#### setMap

##### Parameters

-   `map` **ol.PluggableMap** Map.

#### changed

### 

Type: Interaction.InteractionOptions

## Development

`npm install` - Install JavaScript dependencies in `./node_modules` and create
`package-lock.json`.

`npm run dev` - Start a Webpack development server at <https://localhost:8080>
which will live-update as code is changed during development.

`npm run build` - Generate the final build artifacts.
