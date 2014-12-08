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
            stepLabelDispFormat: _stepLabelDispFormat
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

            if (typeof (userOptions.openBlocks) !== 'undefined') {
                if (typeof (userOptions.openBlocks) === 'string') {
                    userOptions.openBlocks = JSON.parse(userOptions.openBlocks);
                }
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
            var eSteps = $('#steps_' + elementID);
            var nSteps = (_options.max - _options.min) / _options.step;
            var stepWidth = 96 / nSteps;
            var clickStep = 0;
            var cClass = 'ClickableBlocksStepContent';

            for (var i = 0; nSteps > i; i++) {
                clickStep = (i * _options.step) % 60;
                if (clickStep === 0) {
                    cClass = 'ClickableBlocksStepContent ClickableBlocksStepContentFullHour';
                } else if (clickStep === 30) {
                    cClass = 'ClickableBlocksStepContent ClickableBlocksStepContentHalfHour';
                } else {
                    cClass = 'ClickableBlocksStepContent ClickableBlocksStepContentQuarter';
                }
                if (i === 0) {
                    cClass = cClass + ' ClickableBlocksStepContentStart';
                }
                if (i === nSteps - 1) {
                    cClass = cClass + ' ClickableBlocksStepContentEnd';
                }
                var stepValue = _options.min + (i * _options.step);
                $('<div/>', {
                    'id': 'step_' + elementID + '_' + (Number(i) + 1),
                    'class': 'ClickableBlocksStep',
                    'style': 'width:' + stepWidth + '%',
                    'data-start': stepValue,
                    'html': '<span class="ClickableBlocksTick">' + _options.stepLabelDispFormat(stepValue) + '</span><div class="' + cClass + '"></div></div>'
                }).appendTo(eSteps);
            }
            //
            //$('#steps_' + elementID).width(nSteps * stepWidth + '%');
        }


        function _addSteps(bSteps, value, planed, colorp, coloru) {

            for (var i = 0; i < bSteps.length; i++) {
                bSteps[i].addClass('ClickableBlocksPlannedBlockBody');
                bSteps[i].attr('data-colorp', colorp);
                bSteps[i].attr('data-coloru', coloru);
                bSteps[i].attr('data-planned', planed);
                bSteps[i].attr('data-block', bSteps[0].attr('id'));
                if (planed === '1') {
                    bSteps[i].css('background', colorp);
                } else {
                    bSteps[i].css('background', coloru);
                }

                if (i === 0) {
                    bSteps[i].addClass('ClickableBlocksPlannedBlockStart');
                    bSteps[i].attr('data-value', value);
                }

                if (i === bSteps.length - 1) {
                    bSteps[i].addClass('ClickableBlocksPlannedBlockEnd');
                }

                //initEvent
                bSteps[i].on('click', function () {
                    _togglePlan(this);
                });
            }

            if (typeof (_onChange) === 'function') {
                _onChange();
            }


        }

        function _togglePlan(e) {
            var clickedBlock = $(e);
            var blocksSelector = $('[data-block=' + clickedBlock.attr('data-block') + ']');

            if (clickedBlock.attr('data-planned') === '1') {
                // unplan
                blocksSelector.attr('data-planned', '0');
                blocksSelector.css('background', blocksSelector.attr('data-coloru'));

            } else {
                //plan again
                blocksSelector.attr('data-planned', '1');
                blocksSelector.css('background', blocksSelector.attr('data-colorp'));
            }

            if (typeof (_onChange) === 'function') {
                _onChange();
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
         * @param {Object} ArrayOfBlocksObjects example: Array([{"start": 990, "value": 60, "planned": 0, "colorp": "#dff0d8", "coloru": "#FFFFFF"},...])
         * @return {Object} self instance of ClickB class
         */
        this.addBlocks = function (ArrayOfBlocksObjects) {
            if (typeof (ArrayOfBlocksObjects) === 'string') {
                ArrayOfBlocksObjects = JSON.parse(ArrayOfBlocksObjects);
            }
            var stepsToAdd = [];
            for (var i = 0; i < ArrayOfBlocksObjects.length; i++) {
                stepsToAdd = _getStepssInRange(ArrayOfBlocksObjects[i].start, ArrayOfBlocksObjects[i].value);
                _addSteps(stepsToAdd, ArrayOfBlocksObjects[i].value, ArrayOfBlocksObjects[i].planned, ArrayOfBlocksObjects[i].colorp, ArrayOfBlocksObjects[i].coloru);
            }
            return this;
        };


        /**
         * Gets all blocks for this ClickB instance
         * @return {ArrayOfBlocksObjects} of blocks
         */
        this.getBlocks = function () {
            var blocks = [];
            var _blocks = $('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart');
            if (_blocks.length > 0) {
                _blocks.each(function (i, e) {
                    var block = {};
                    block.id = e.getAttribute('id');
                    block.start = e.getAttribute('data-start');
                    block.value = e.getAttribute('data-value');
                    block.planned = e.getAttribute('data-planned');
                    block.colorp = e.getAttribute('data-colorp');
                    block.coloru = e.getAttribute('data-coloru');
                    blocks.push(block);
                });
            }
            return blocks;
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
