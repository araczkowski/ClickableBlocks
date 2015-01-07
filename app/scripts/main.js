'use strict';

(function (w, $) {

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
    w.ClickB = function (elementID, userOptions) {
        var _stepLabelDispFormat = function (steps) {
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
            mode: 'plan'
        };

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
            if (typeof (userOptions) === 'string') {
                userOptions = JSON.parse(userOptions);
            }

            if (typeof (userOptions.stepLabelDispFormat) !== 'undefined') {
                if (typeof (userOptions.stepLabelDispFormat) === 'string') {
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

        function _build() {
            $('#steps_' + elementID).remove();
            $('#' + elementID + '_parent').append('<div id="steps_' + elementID + '" class="ClickableBlocksSteps"></div>');

            if (_options.toolbar) {
                $('#steps_' + elementID).append('<div id="selector_steps_' + elementID + '" class="ClickableBlocksAllBlockSelector"><i class="fa  fa-lg fa-2x fa-plus-square"></i><i class="fa  fa-lg fa-2x fa-minus-square"></i></div>');

                if (!_options.readonly) {
                    $('#steps_' + elementID + ' .ClickableBlocksAllBlockSelector i.fa-plus-square').on('click', function () {
                        _planAll(this);
                    });

                    $('#steps_' + elementID + ' .ClickableBlocksAllBlockSelector i.fa-minus-square').on('click', function () {
                        _unplanAll(this);
                    });
                }
            }
            var eSteps = $('#steps_' + elementID);
            var nSteps = (_options.max - _options.min) / _options.step;
            //var stepWidth = 80 / nSteps;
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
                    'style': 'width: 1.2em;',
                    'data-start': stepValue,
                    'html': '<span class="ClickableBlocksTick">' + _options.stepLabelDispFormat(stepValue) + '</span><div class="ClickableBlocksStepContent ' + contentClass + '"></div></div>'
                }).appendTo(eSteps);
            }
            $('#steps_' + elementID).append('<div id="selector_steps_' + elementID + '" class="ClickableBlocksMealSelector"><span class="ClickableBlocksTick">' + _options.stepLabelDispFormat(_options.min + (nSteps * _options.step)) + '</span><i class="fa fa-cutlery fa-2x mealOff"></i></div>');

            if (!_options.readonly) {
                $('#steps_' + elementID + ' .ClickableBlocksMealSelector i.fa-cutlery').on('click', function () {
                    _toggleMeal(this);
                });
            }

            if (_options.toolbar) {
                $('#' + elementID + '_parent').css('width', (nSteps * 1.2) + 10 + 'em');
            } else {
                $('#' + elementID + '_parent').css('width', (nSteps * 1.2) + 4 + 'em');
            }
        }


        function _addSteps(bSteps, block, meal, rmeal) {

            for (var i = 0; i < bSteps.length; i++) {
                bSteps[i].addClass('ClickableBlocksPlannedBlockBody');
                bSteps[i].attr('data-id', block.id);
                bSteps[i].attr('data-colplanned', block.colplanned);
                bSteps[i].attr('data-colunplanned', block.colunplanned);
                bSteps[i].attr('data-colreal', block.colreal);
                bSteps[i].attr('data-coladded', block.coladded);
                bSteps[i].attr('data-colunreal', block.colunreal);
                bSteps[i].attr('data-coldeleted', block.coldeleted);
                bSteps[i].attr('data-planned', block.planned);
                bSteps[i].attr('data-real', block.real);
                bSteps[i].attr('data-block', bSteps[0].attr('id'));

                bSteps[i].find('div.ClickableBlocksStepContent').css('background', block[_getBackgroundColor(block.planned, block.real)]);

                if (i === 0) {
                    bSteps[i].addClass('ClickableBlocksPlannedBlockStart');
                    bSteps[i].attr('data-value', block.value);
                }

                if (i === bSteps.length - 1) {
                    bSteps[i].addClass('ClickableBlocksPlannedBlockEnd');
                }

                if (!_options.readonly) {
                    //initEvent
                    bSteps[i].unbind('click').on('click', function () {
                        _togglePlan(this);
                    });
                }
            }
            //
            _addMeal(meal, rmeal);
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
            //TODO - should be possible in CSS
            $('.ClickableBlocksPlannedBlockStart').has('div.ClickableBlocksStepContentFullHour').css('border-left', '2px solid #656565');

            if (typeof (_onChange) === 'function') {
                _onChange();
            }


        }

        function _getBackgroundColor(plan, real) {

            if (_options.mode === 'real') {
                if (real === '1' && plan === '1') {
                    return 'colreal';
                } else if (real === '1' && plan === '0') {
                    return 'coladded';
                } else if (real === '0' && plan === '0') {
                    return 'colunreal';
                } else if (real === '0' && plan === '1') {
                    return 'coldeleted';
                }

            } else {
                if (plan === '1') {
                    return 'colplanned';
                } else {
                    return 'colunplanned';
                }
            }
        }

        function _togglePlan(e) {
            var clickedBlock = $(e);
            var blocksSelector = $('[data-block=' + clickedBlock.attr('data-block') + ']');
            var key;


            if (_options.mode === 'real') {
                if (clickedBlock.attr('data-real') === '1') {
                    blocksSelector.attr('data-real', '0');

                } else {
                    blocksSelector.attr('data-real', '1');
                }
            } else {
                if (clickedBlock.attr('data-planned') === '1') {
                    blocksSelector.attr('data-planned', '0');

                } else {
                    blocksSelector.attr('data-planned', '1');
                }
            }

            key = _getBackgroundColor(clickedBlock.attr('data-planned'), clickedBlock.attr('data-real'));
            blocksSelector.find('div.ClickableBlocksStepContent').css('background', blocksSelector.attr('data-' + key));

            if (typeof (_onChange) === 'function') {
                _onChange();
            }
        }

        function _toggleMeal(e) {
            //on click
            if ($('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart').length > 0) {
                if ($(e).hasClass('mealOff')) {
                    _mealOn();
                } else {
                    _mealOff();
                }
            }
            //$(e).toggleClass('mealOff mealOn');
        }

        function _addMeal(plan, real) {
            var e = $('#steps_' + elementID + ' i.fa-cutlery');
            e.attr('data-meal', plan);
            e.attr('data-rmeal', real);
        }

        function _mealOn() {
            var e = $('#steps_' + elementID + ' i.fa-cutlery');
            e.addClass('click');
            e.one('animationend webkitAnimationEnd onAnimationEnd', function () {
                e.removeClass('click');
            });

            if (_options.mode === 'real') {
                e.attr('data-rmeal', 1);
            } else {
                e.attr('data-meal', 1);
            }
            var key = _getBackgroundColor(e.attr('data-meal'), e.attr('data-rmeal'));
            var bcolor = $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody:first').attr('data-' + key);
            e.css('color', bcolor);
            e.removeClass('mealOff').addClass('mealOn');


            if (typeof (_onChange) === 'function') {
                _onChange();
            }
        }

        function _mealOff() {
            var e = $('#steps_' + elementID + ' i.fa-cutlery');
            e.addClass('click');
            e.one('animationend webkitAnimationEnd onAnimationEnd', function () {
                e.removeClass('click');
            });

            if (_options.mode === 'real') {
                e.attr('data-rmeal', 0);
            } else {
                e.attr('data-meal', 0);
            }
            var key = _getBackgroundColor(e.attr('data-meal'), e.attr('data-rmeal'));
            var bcolor = $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody:first').attr('data-' + key);
            e.css('color', bcolor);
            e.removeClass('mealOn').addClass('mealOff');

            if (typeof (_onChange) === 'function') {
                _onChange();
            }
        }


        function _planAll(e) {
            if ($('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart').length > 0) {

                if (_options.mode === 'real') {
                    $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody').attr('data-real', '1');
                } else {
                    $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody').attr('data-planned', '1');
                }

                $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody').each(function (i, obj) {
                    var key = _getBackgroundColor($(obj).attr('data-planned'), $(obj).attr('data-real'));
                    var bcolor = $(obj).attr('data-' + key);
                    $(obj).find('div.ClickableBlocksStepContent ').css('background', bcolor);
                });

                $(e).addClass('click');
                $(e).one('animationend webkitAnimationEnd onAnimationEnd', function () {
                    $(e).removeClass('click');
                });

                //If there is at least 1 time-slot between 12:00 and 13:00, the meal is selected as well, when clicking
                if ($('div#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody[data-start="720"]').length > 0 || $('div#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody[data-start="735"]').length > 0 || $('div#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody[data-start="750"]').length > 0 || $('div#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody[data-start="765"]').length > 0 || $('div#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody[data-start="780"]').length > 0) {
                    _mealOn();
                }

                if (typeof (_onChange) === 'function') {
                    _onChange();
                }
            }
        }

        function _unplanAll(e) {
            if ($('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart').length > 0) {

                if (_options.mode === 'real') {
                    $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody').attr('data-real', '0');
                } else {
                    $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody').attr('data-planned', '0');
                }

                $('#steps_' + elementID + ' div.ClickableBlocksPlannedBlockBody').each(function (i, obj) {
                    var key = _getBackgroundColor($(obj).attr('data-planned'), $(obj).attr('data-real'));
                    var bcolor = $(obj).attr('data-' + key);
                    $(obj).find('div.ClickableBlocksStepContent').css('background', bcolor);
                });

                $(e).addClass('click');
                $(e).one('animationend webkitAnimationEnd onAnimationEnd', function () {
                    $(e).removeClass('click');
                });


                //When clicking the 'x'-button, the meal is always deselected
                _mealOff();

                if (typeof (_onChange) === 'function') {
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
        this.addBlocks = function (ArrOfBloObj) {
            if (typeof (ArrOfBloObj) === 'string') {
                ArrOfBloObj = JSON.parse(ArrOfBloObj);
            }
            if (typeof (ArrOfBloObj) === 'undefined') {
                return;
            }
            if (typeof (ArrOfBloObj.blocks) === 'object') {

                var stepsToAdd = [];
                for (var i = 0; i < ArrOfBloObj.blocks.length; i++) {
                    stepsToAdd = _getStepssInRange(ArrOfBloObj.blocks[i].start, ArrOfBloObj.blocks[i].value);
                    _addSteps(stepsToAdd, ArrOfBloObj.blocks[i], ArrOfBloObj.meal, ArrOfBloObj.rmeal);
                }
            }
            return this;
        };


        /**
         * Gets all blocks for this ClickB instance
         * @return {ArrOfBloObj} of blocks
         */
        this.getBlocks = function () {
            var obj = {};
            var blocks = [];
            var _blocks = $('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart');
            if (_blocks.length > 0) {
                _blocks.each(function (i, e) {
                    var block = {};
                    block.id = e.getAttribute('data-id');
                    block.start = e.getAttribute('data-start');
                    block.value = e.getAttribute('data-value');
                    block.planned = e.getAttribute('data-planned');
                    block.real = e.getAttribute('data-real');
                    block.colplanned = e.getAttribute('data-colplanned');
                    block.colunplanned = e.getAttribute('data-colunplanned');
                    block.coldeleted = e.getAttribute('data-coldeleted');
                    block.colreal = e.getAttribute('data-colreal');
                    block.coladded = e.getAttribute('data-coladded');
                    block.colunreal = e.getAttribute('data-colunreal');

                    blocks.push(block);
                });
            }

            obj.blocks = blocks;
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
        this.setChangeCallback = function (callbackFunction) {
            if (typeof (callbackFunction) === 'string') {
                /* jshint ignore:start */
                var fn;
                eval('fn = ' + callbackFunction);
                callbackFunction = fn;
                /* jshint ignore:end */
            }

            if (typeof (callbackFunction) === 'function') {
                _onChange = callbackFunction;
            }


            return this;
        };

        _init();
    };

})(window, jQuery);


// special functionality for IE8
$(function () {
    // to have indexOf working on an array in IE8
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    // to have jQuery forEach in IE8
    if (typeof Array.prototype.forEach !== 'function') {
        Array.prototype.forEach = function (callback) {
            for (var i = 0; i < this.length; i++) {
                callback.apply(this, [this[i], i, this]);
            }
        };
    }
});
