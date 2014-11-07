ClickableBlocks (ClickB)
===================

Oracle APEX plugin/widget with clickable blocks interaction.
Live example at jsFiddle http://jsfiddle.net/araczkowski/bc5jt9ch/embedded/result/


![alt tag](https://raw.githubusercontent.com/araczkowski/ClickableBlocks/master/app/images/ClickB.png)



How To Start (to develop the plugin)
===========================

**NPM**
```javascript
npm install
```

**Bower**
```javascript
bower install
```

**Grunt**
```javascript
grunt serve
```


ClickB class constructor
===========================
**ClickB**
```javascript
/**
 * @class ClickB
 *
 * @constructor
 * @param {String} elementID, this id will be used to create jQuery selector and apped a module code to this id
 * @param {Object} userOptions (optional) Custom options object that overrides default
 * {
 *      @property {Number} userOptions.min Block's scale minimum value
 *      @property {Number} userOptions.max Block's scale maximum value
 *      @property {Number} userOptions.step Block's scale step
 *      @property {Object} userOptions.stepLabelDispFormat Block's scale step Label format default hh24
 * }
 */

myCustomId.ClickB = function(elementId, userOptions) {}
```


ClickB class interface
=========================


**addBlocks**
```javascript
/**
 * Adds multiple blocks to the block's scale
 * @param {Object} ArrayOfBlocksObjects example: Array([{"start": 990, "value": 60, "planned": 0, "colorp": "#dff0d8", "coloru": "#FFFFFF"},...])
 * @return {Object} self instance of ClickB class
 */

ClickB.addBlocks = function(ArrayOfBlocksObjects) {}
```

=
**getBlocks**
```javascript
/**
 * Gets all blocks for this ClickB instance
 * @return {ArrayOfBlocksObjects} of blocks
 */

ClickB.getBlocks = function() {}

=
**getBlocks**
```javascript
/**
 * Sets callback function that can be used when item change
 *
 * @param {Function} callbackFunction
 *      stores a callback function
 *
 * @example
 *      clickb.setChangeCallback(function(callback));
 * @return {Object} self instance of ClickB class
 */

ClickB.setChangeCallback = function (callbackFunction) {}
```
=========================




