'use strict';
(function(w, $) {

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
  w.ClickB = function(elementID, userOptions) {
    var _stepLabelDispFormat = function(steps) {
      var hours = Math.floor(Math.abs(steps) / 60);
      return Math.abs(steps) % 60 === 0 ? ((hours < 10 && hours >= 0) ? '0' : '') + hours : '';
    };

    var _options = {
      min: 0,
      max: 1440,
      step: 30,
      stepLabelDispFormat: _stepLabelDispFormat,
      readonly: false,
      toolbar: true,
      mealbar: true,
      width: 'auto',
      mode: 'plan',
      addEmptyColumns: false,
      preId: 0,
      enfId: 0,
      preDay: ''
    };

    //
    var parentDiv = $('#' + elementID + '_parent');
    var mainDiv;
    var allSteps;
    var _onChange = null;


    function _init() {
      _mergeOptions();

      if ((_options.max - _options.min) % _options.step !== 0) {
        throw 'Blocks length should be multiple to step';
      }
      _build();
    }


    function _mergeOptions() {
      if (!userOptions) {
        return _options;
      }
      if (typeof(userOptions) === 'string') {
        userOptions = JSON.parse(userOptions);
      }

      if (typeof(userOptions.stepLabelDispFormat) !== 'undefined') {
        if (typeof(userOptions.stepLabelDispFormat) === 'string') {
          /* jshint ignore:start */
          var fn;
          eval('fn = ' + userOptions.stepLabelDispFormat);
          userOptions.stepLabelDispFormat = fn;
          /* jshint ignore:end */
        }
      }
      for (var optionKey in _options) {
        if (optionKey in userOptions) {
          switch (typeof _options[optionKey]) {
            case 'boolean':
              _options[optionKey] = !!userOptions[optionKey];
              break;
            case 'number':
              _options[optionKey] = Math.abs(userOptions[optionKey]);
              break;
            case 'string':
              _options[optionKey] = '' + userOptions[optionKey];
              break;
            default:
              _options[optionKey] = userOptions[optionKey];
          }
        }
      }
      return _options;
    }

    function _setWidth() {
      if (_options.width === 'auto') {

        if (_options.toolbar) {
          $('#' + elementID + '_parent').css('width', (allSteps * 1.1) + 10 + 'em');
        } else {
          $('#' + elementID + '_parent').css('width', (allSteps * 1.1) + 4 + 'em');
        }
      } else {
        $('#' + elementID + '_parent').css('width', _options.width);
      }
    }

    function _build() {
      // 0. main div
      var mainDivClass = 'ClickableBlocksSteps';
      if (_options.readonly) {
        mainDivClass = mainDivClass + ' ClickableBlocksReadonly';
      } else {
        mainDivClass = mainDivClass + ' ClickableBlocksEdit';
      }

      mainDiv = $('<div/>', {
        'id': 'steps_' + elementID,
        'data-clickB': elementID,
        'data-pre-id': _options.preId,
        'data-enf-id': _options.enfId,
        'class': mainDivClass
      }).appendTo(parentDiv);

      // 1. toolbar
      var classNoDisp;
      if (!_options.toolbar) {
        classNoDisp = 'ClickableBlocksNoDisp';
      }

      var planAll = $('<i/>', {
        'class': 'fa fa-lg fa-2x fa-plus-square'
      });
      var unplanAll = $('<i/>', {
        'class': 'fa fa-lg fa-2x fa-minus-square'
      });


      $('<div/>', {
        'id': 'selector_steps_' + elementID,
        'class': 'ClickableBlocksAllBlockSelector ' + classNoDisp,
        'html': planAll.add(unplanAll)
      }).appendTo(mainDiv);



      planAll.on('click', function() {
        _planAll(this);
      });
      unplanAll.on('click', function() {
        _unplanAll(this);
      });



      // 2. blocks
      var nSteps = (_options.max - _options.min) / _options.step;
      allSteps = nSteps;
      if (_options.addEmptyColumns) {
        allSteps = nSteps + 4;
      }

      var stepWidth = '1.1em;';
      if (_options.width !== 'auto') {
        stepWidth = (100 / allSteps) + '%';
      }
      var clickStep = 0;
      var contentClass = '';
      var stepClass = '';

      for (var i = 0; nSteps > i; i++) {

        clickStep = (i * _options.step) % 60;
        if (clickStep === 0) {
          contentClass = 'ClickableBlocksStepContentFullHour';
          stepClass = 'ClickableBlocksStepFullHour';
        } else if (clickStep === 30) {
          contentClass = 'ClickableBlocksStepContentHalfHour';
          stepClass = 'ClickableBlocksStepHalfHour';
        } else {
          contentClass = 'ClickableBlocksStepContentQuarter';
          stepClass = 'ClickableBlocksStepQuarter';
        }
        if (i === 0) {
          contentClass = contentClass + ' ClickableBlocksStepContentStart';
          stepClass = stepClass + ' ClickableBlocksStepStart';
        }
        if (i === nSteps - 1) {
          contentClass = contentClass + ' ClickableBlocksStepContentEnd';
          stepClass = stepClass + ' ClickableBlocksStepEnd';
        }
        var stepValue = _options.min + (i * _options.step);

        $('<div/>', {
          'id': 'step_' + elementID + '_' + (Number(i) + 1),
          'class': 'ClickableBlocksStep ' + stepClass,
          'style': 'width: ' + stepWidth,
          'data-start': stepValue,
          'html': '<span class="ClickableBlocksTick">' + _options.stepLabelDispFormat(stepValue) + '</span><div class="ClickableBlocksStepContent ' + contentClass + '"></div>'
        }).appendTo(mainDiv);

        // additional, empty columns
        if (_options.addEmptyColumns && (stepValue === 465 || stepValue === 825 || stepValue === 705 || stepValue === 945)) {
          $('<div/>', {
            'class': 'ClickableBlocksStep ClickableBlocksEmptyColumn',
            'style': 'width:' + stepWidth
          }).appendTo(mainDiv);
        }
      }

      // 3. mealbar
      if (_options.mealbar) {

        var tick = $('<span/>', {
          class: 'ClickableBlocksTick',
          html: _options.stepLabelDispFormat(_options.min + (nSteps * _options.step))
        });

        var cutlery = $('<i/>', {
          class: 'fa fa-cutlery fa-2x mealOff'
        });

        $('<div/>', {
          id: 'mealSelectorSteps' + elementID,
          class: 'ClickableBlocksMealSelector',
          html: tick.add(cutlery)
        }).appendTo(mainDiv);



        cutlery.on('click', function() {
          _toggleMeal(this);
        });

      }

      // widget width
      _setWidth();

      // additional, empty columns
      if (_options.addEmptyColumns) {
        //TODO should be possible in CSS
        $('.ClickableBlocksStep.ClickableBlocksEmptyColumn').next('div').not('.ClickableBlocksPlannedBlockStart').css('border-left', '2px solid #656565');
      }
    }


    function _addBlock(bSteps, block) {
      var i = 0;
      var blockSelector;

      bSteps.forEach(function addBlockOnStep(step) {

        if (i === 0) {
          step.addClass('ClickableBlocksPlannedBlockStart').attr('data-value', block.value).find('div.ClickableBlocksStepContent').html('<i class="' + _getBlockFeatures(block.planned, block.real).item + '">').parent().addClass('ClickableBlocksStepHesBlockStart');
          blockSelector = step.attr('id');
        }

        step.addClass('ClickableBlocksPlannedBlockBody').attr('data-id', block.id).attr('data-colplanned', block.colplanned).attr('data-colunplanned', block.colunplanned).attr('data-colreal', block.colreal).attr('data-coladded', block.coladded).attr('data-colunreal', block.colunreal).attr('data-coldeleted', block.coldeleted).attr('data-planned', block.planned).attr('data-real', block.real).attr('data-block', blockSelector).find('div.ClickableBlocksStepContent').css('background', block[_getBlockFeatures(block.planned, block.real).color]);



        if (i === bSteps.length - 1) {
          step.addClass('ClickableBlocksPlannedBlockEnd').addClass('ClickableBlocksStepHesBlockEnd');

        }

        //initEvent
        step.unbind('click').on('click', function() {
          _togglePlan(blockSelector);
        });


        i++;
      });



      if (typeof(_onChange) === 'function') {
        _onChange();
      }


    }

    function _getBlockFeatures(plan, real) {

      if (_options.mode === 'real') {
        if (real === '1' && plan === '1') {
          return {
            'color': 'colreal',
            'item': 'fa fa-check'
          };
        } else if (real === '1' && plan === '0') {
          return {
            'color': 'coladded',
            'item': 'fa fa-plus'
          };
        } else if (real === '0' && plan === '0') {
          return {
            'color': 'colunreal',
            'item': ''
          };
        } else if (real === '0' && plan === '1') {
          return {
            'color': 'coldeleted',
            'item': 'fa fa-minus'
          };
        }

      } else {
        if (plan === '1') {
          return {
            'color': 'colplanned',
            'item': ''
          };
        } else {
          return {
            'color': 'colunplanned',
            'item': ''
          };
        }
      }
    }

    function _togglePlan(blockSelector) {
      var bStart;
      var bEnd;

      if (_options.readonly) {
        return;
      }

      var blocks = $('[data-block=' + blockSelector + ']');
      var key;


      if (_options.mode === 'real') {
        if (blocks.attr('data-real') === '1') {
          blocks.attr('data-real', '0');

        } else {
          blocks.attr('data-real', '1');
        }
      } else {
        bStart = Number(blocks.attr('data-start'));
        bEnd = Number(blocks.attr('data-start')) + Number(blocks.attr('data-value'));
        if (blocks.attr('data-planned') === '1') {
          blocks.attr('data-planned', '0');

          // When a time-slot, starting at 12:00 or containing 12:00 (starting before and ending after),
          // is checked, the meal must be checked as well.
          // When such a time-slot is unchecked, the meal must be unchecked as well
          if (bStart === 720 || (bStart < 720 && bEnd > 720)){
            _mealOff();
          }
        } else {
          blocks.attr('data-planned', '1');
          if (bStart === 720 || (bStart < 720 && bEnd > 720)){
            _mealOn();
          }
        }
      }

      key = _getBlockFeatures(blocks.attr('data-planned'), blocks.attr('data-real')).color;
      blocks.find('div.ClickableBlocksStepContent').css('background', blocks.attr('data-' + key));
      blocks.find('div.ClickableBlocksStepContent').first().html('<i class="' + _getBlockFeatures(blocks.attr('data-planned'), blocks.attr('data-real')).item + '">');


      if (typeof(_onChange) === 'function') {
        _onChange();
      }
    }

    function _toggleMeal(e) {
      //on click
      if (_options.readonly) {
        return;
      }

      if ($('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart').length > 0) {
        if ($(e).hasClass('mealOff')) {
          _mealOn();
        } else {
          _mealOff();
        }
      }
      //$(e).toggleClass('mealOff mealOn');
    }

    function _addMeal(meal, rmeal) {
      if (_options.mealbar) {
        var e = $('#steps_' + elementID + ' i.fa-cutlery');
        e.attr('data-meal', meal);
        e.attr('data-rmeal', rmeal);
        if (_options.mode === 'real') {
          if (rmeal === '1') {
            _mealOn();
          } else {
            _mealOff();
          }
        } else {
          if (meal === '1') {
            _mealOn();
          } else {
            _mealOff();
          }
        }
      }

    }

    function _mealOn() {
      var e = mainDiv.find('i.fa-cutlery');
      e.addClass('click').attr((_options.mode === 'real') ? 'data-rmeal' : 'data-meal', 1).one('animationend webkitAnimationEnd onAnimationEnd', function() {
        e.removeClass('click');
      });


      var key = _getBlockFeatures(e.attr('data-meal'), e.attr('data-rmeal')).color;
      var bcolor = mainDiv.find('div.ClickableBlocksPlannedBlockBody:first').attr('data-' + key);
      e.css('color', bcolor).removeClass('mealOff').addClass('mealOn');


      if (typeof(_onChange) === 'function') {
        _onChange();
      }
    }

    function _mealOff() {
      var e = mainDiv.find('i.fa-cutlery').addClass('click').one('animationend webkitAnimationEnd onAnimationEnd', function() {
        e.removeClass('click');
      }).attr((_options.mode === 'real') ? 'data-rmeal' : 'data-meal', 0);


      var key = _getBlockFeatures(e.attr('data-meal'), e.attr('data-rmeal')).color;
      var bcolor = mainDiv.find('div.ClickableBlocksPlannedBlockBody:first').attr('data-' + key);
      e.css('color', bcolor).removeClass('mealOn').addClass('mealOff');

      if (typeof(_onChange) === 'function') {
        _onChange();
      }
    }


    function _planAll(e) {
      if (_options.readonly) {
        return;
      }

      var clickedElement = $(e);
      if (mainDiv.find('.ClickableBlocksPlannedBlockStart').length > 0) {

        if (_options.mode === 'real') {
          mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-real', '1');
        } else {
          mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-planned', '1');
        }

        // color and item
        mainDiv.find('div.ClickableBlocksPlannedBlockBody').each(function(i, obj) {
          var o = $(obj);
          var bFeatures = _getBlockFeatures(o.attr('data-planned'), o.attr('data-real'));
          var bcolor = o.attr('data-' + bFeatures.color);
          o.find('div.ClickableBlocksStepContent').css('background', bcolor);

          // item
          if (o.hasClass('ClickableBlocksPlannedBlockStart')) {
            o.find('div.ClickableBlocksStepContent').html('<i class="' + bFeatures.item + '">');
          }

        });

        clickedElement.addClass('click').one('animationend webkitAnimationEnd onAnimationEnd', function() {
          clickedElement.removeClass('click');
        });

        //If there is at least 1 time-slot between 12:00 and 13:00, the meal is selected as well, when clicking
        if (mainDiv.find('div.ClickableBlocksPlannedBlockBody').filter('[data-start="720"],[data-start="735"],[data-start="750"],[data-start="765"]').length > 0) {
          _mealOn();
        }

        if (typeof(_onChange) === 'function') {
          _onChange();
        }
      }
    }

    function _unplanAll(e) {
      if (_options.readonly) {
        return;
      }

      var clickedElement = $(e);
      if (mainDiv.find('.ClickableBlocksPlannedBlockStart').length > 0) {

        if (_options.mode === 'real') {
          mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-real', '0');
        } else {
          mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-planned', '0');
        }

        // color
        mainDiv.find('div.ClickableBlocksPlannedBlockBody').each(function(i, obj) {
          var o = $(obj);
          var bFeatures = _getBlockFeatures(o.attr('data-planned'), o.attr('data-real'));
          var bcolor = o.attr('data-' + bFeatures.color);
          o.find('div.ClickableBlocksStepContent').css('background', bcolor);
          // item
          if (o.hasClass('ClickableBlocksPlannedBlockStart')) {
            o.find('div.ClickableBlocksStepContent').html('<i class="' + bFeatures.item + '">');
          }

        });

        clickedElement.addClass('click').one('animationend webkitAnimationEnd onAnimationEnd', function() {
          clickedElement.removeClass('click');
        });


        //When clicking the 'x'-button, the meal is always deselected
        _mealOff();

        if (typeof(_onChange) === 'function') {
          _onChange();
        }
      }
    }



    function _getStepssInRange(start, value) {
      var steps = [];
      var startId = Number(start / _options.step) - Number(_options.min / _options.step) + 1;
      var stepsNo = value / _options.step;

      for (var n = 0; n < stepsNo; n++) {
        var step = (Number(startId) + n);
        steps.push($('#step_' + elementID + '_' + step));
      }
      return steps;
    }


    /**
     * Adds multiple blocks to the block's scale
     * @param {Object} ArrOfBloObj example: Array([{"start": 990, "value": 60, "planned": 0, "colplanned": "#dff0d8", "colunplanned": "#FFFFFF"},...])
     * @return {Object} self instance of ClickB class
     */
    this.addBlocks = function(ArrOfBloObj) {
      if (typeof(ArrOfBloObj) === 'string') {
        ArrOfBloObj = JSON.parse(ArrOfBloObj);
      }
      if (typeof(ArrOfBloObj) === 'undefined') {
        return;
      }
      if (typeof(ArrOfBloObj.blocks) === 'object') {

        ArrOfBloObj.blocks.forEach(function addBlock(block) {
          if (!block.colplanned) {
            block.colplanned = '#ff7c34';
          }
          if (!block.colunplanned) {
            block.colunplanned = '#ffd6b8';
          }
          if (!block.colreal) {
            block.colreal = '#7bce5b';
          }
          if (!block.colunreal) {
            block.colunreal = '#ffd4ba';
          }
          if (!block.coladded) {
            block.coladded = '#3c8a27';
          }
          if (!block.coldeleted) {
            block.coldeleted = '#ff3d25';
          }
          _addBlock(_getStepssInRange(block.start, block.value), block);

        });

        _addMeal(ArrOfBloObj.meal, ArrOfBloObj.rmeal);

        return this;
      }
    };


    /**
     * Gets all blocks for this ClickB instance
     * @return {ArrOfBloObj} of blocks
     */
    this.getBlocks = function() {

      var obj = {};
      var blocks = [];
      var _blocks = $('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart');
      if (_blocks.length > 0) {
        _blocks.each(function(i, e) {
          var block = {};
          block.id = e.getAttribute('data-id');
          block.start = e.getAttribute('data-start');
          block.value = e.getAttribute('data-value');
          block.planned = e.getAttribute('data-planned');
          block.real = e.getAttribute('data-real');
          blocks.push(block);
        });
      }

      obj.blocks = blocks;
      obj.preId = _options.preId;
      obj.enfId = _options.enfId;
      obj.preDay = _options.preDay;
      obj.meal = $('div#steps_' + elementID + ' .ClickableBlocksMealSelector i.fa').attr('data-meal');
      obj.rmeal = $('div#steps_' + elementID + ' .ClickableBlocksMealSelector i.fa').attr('data-rmeal');
      return JSON.stringify(obj);
    };

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
    this.setChangeCallback = function(callbackFunction) {
      if (typeof(callbackFunction) === 'string') {
        /* jshint ignore:start */
        var fn;
        eval('fn = ' + callbackFunction);
        callbackFunction = fn;
        /* jshint ignore:end */
      }

      if (typeof(callbackFunction) === 'function') {
        _onChange = callbackFunction;
      }


      return this;
    };

    this.editAllOn = function() {
      _options.readonly = false;
      _options.toolbar = true;
      $('div#steps_' + elementID + ' > .ClickableBlocksNoDisp').addClass('ClickableBlocksDisp').removeClass('ClickableBlocksNoDisp');
      $('div#steps_' + elementID + '.ClickableBlocksReadonly').addClass('ClickableBlocksEdit').removeClass('ClickableBlocksReadonly');
      _setWidth();

    };


    this.editAllOff = function() {
      _options.readonly = true;
      _options.toolbar = false;
      $('div#steps_' + elementID + ' > .ClickableBlocksDisp').addClass('ClickableBlocksNoDisp').removeClass('ClickableBlocksDisp');
      $('div#steps_' + elementID + '.ClickableBlocksEdit').addClass('ClickableBlocksReadonly').removeClass('ClickableBlocksEdit');
      _setWidth();
    };

    this.getOption = function(option) {
      return _options[option];
    };

    _init();
  };

})(window, jQuery);


// special functionality for IE8
$(function() {
  // to have indexOf working on an array in IE8
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
      for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }

  // to have forEach in IE8
  if (typeof Array.prototype.forEach !== 'function') {
    Array.prototype.forEach = function(callback) {
      for (var i = 0; i < this.length; i++) {
        callback.apply(this, [this[i], i, this]);
      }
    };
  }
});
