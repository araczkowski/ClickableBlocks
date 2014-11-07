ClickableBlocks (ClickB)
===================

Oracle APEX plugin/widget with clickable blocks interaction.
Live example at jsFiddle http://jsfiddle.net/araczkowski/bc5jt9ch/embedded/result/


![alt tag](https://raw.githubusercontent.com/araczkowski/ClickableBlocks/master/app/images/ClickB.png)


TODO
===========================

develop the plugin


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
* @param {String} elementId, this id will be used to create jQuery selector
* @param {Object} userOptions (optional) Custom options object that overrides default
* {
*      @property {Number} userOptions.min Slider minimum value
*      @property {Number} userOptions.max Slider maximum value
*      @property {Number} userOptions.step Slider sliding step
*      @property {Object} userOptions.stepLabelDispFormat mrs step Label format default hh24
*      @property {Object} userOptions.toolbarId element ID when the toolbar shoud by created
*      @property {Object} userOptions.blocksToolbar array of objects with blocks description
*      @property {Object} userOptions.openBlocks array of array with open blocks data
* }
*/

myCustomId.ClickB = function(elementId, userOptions) {}
```


ClickB class interface
=========================


**addBlocks**
```javascript
/**
 * Adds multiple block to the slider scale
 * @param {Array} blocksArray example: Array([[660, 30],[990, 60]...])
 * @return {Object} self instance of ClickB class
 */

ClickB.addBlocks = function(blocksArray) {}
```

=
**getBlocks**
```javascript
/**
 * Gets all blocks for this ClickB instance
 * @return {Array} of blocks
 */

ClickB.getBlocks = function() {}
```
=========================




