(function (w, $) {

    /**
     * @class ClickB
     *
     * @constructor
     * @param {String} parentId, this id will be used to create jQuery selector and apped a module code to this id
     * @param {Object} userOptions (optional) Custom options object that overrides default
     * {
     *      @property {Number} userOptions.min Slider minimum value
     *      @property {Number} userOptions.max Slider maximum value
     *      @property {Number} userOptions.step Slider sliding step
     *      @property {Object} userOptions.stepLabelDispFormat mrs step Label format default hh24
     * }
     */
    w.ClickB = function (parentId, userOptions) {
        var _stepLabelDispFormat = function (steps) {
            var hours = Math.floor(Math.abs(steps) / 60);
            return Math.abs(steps) % 60 === 0 ? ((hours < 10 && hours >= 0) ? '0' : '') + hours : '';
        };

        var _options = {
            min: 0,
            max: 1440,
            step: 30,
            stepLabelDispFormat: _stepLabelDispFormat,
            openBlocks: [[30, 60], [600, 90]]
        };


        function _init() {
            _mergeOptions();
            if ((_options.max - _options.min) % _options.step !== 0) {
                throw 'Blocks length should be multiple to step';
            }
            _build();
            _blocks = $('#steps_' + parentId);
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
            $('#steps_' + parentId).remove();
            $('#' + parentId).append('<div id="steps_' + parentId + '" class="steps"></div>');
            var eSteps = $('#steps_' + parentId);
            var nSteps = (_options.max - _options.min) / _options.step;
            var stepWidth = 96 / nSteps;
            for (var i = 0; nSteps > i; i++) {
                var stepValue = _options.min + (i * _options.step);
                $('<div/>', {
                    'id': 'step_' + parentId + '_' + (Number(i) + 1),
                    'class': 'step',
                    'style': 'width:' + stepWidth + '%',
                    'data-start': stepValue,
                    'html': '<span class="tick">' + _options.stepLabelDispFormat(stepValue) + '</span><div class="step_content"></div></div>'
                }).appendTo(eSteps);
            }
            //
            $('#steps_' + parentId).width(nSteps * stepWidth + '%');
        }


        function _addBlock(bSteps, value, planed, colorp, coloru) {

            for (var i = 0; i < bSteps.length; i++) {
                bSteps[i].addClass('planned-block-body');
                bSteps[i].attr('data-colorp', colorp);
                bSteps[i].attr('data-coloru', coloru);
                bSteps[i].attr('data-planned', planed);
                bSteps[i].attr('data-block', bSteps[0].attr('id'));
                if (planed == 1) {
                    bSteps[i].css('background', colorp);
                } else {
                    bSteps[i].css('background', coloru);
                }

                if (i === 0) {
                    bSteps[i].addClass('planned-block-start');
                    bSteps[i].attr('data-value', value);
                }

                if (i === bSteps.length - 1) {
                    bSteps[i].addClass('planned-block-end');
                }

                //initEvent
                bSteps[i].on("click", function () {
                    _togglePlan(this);
                });
            }


        }

        function _togglePlan(e) {
            var clicked_block = $(e);
            var blocks_selector = $('[data-block=' + clicked_block.attr('data-block') + ']');

            if (clicked_block.attr('data-planned') == 1) {
                // unplan
                blocks_selector.attr('data-planned', 0);
                blocks_selector.css('background', blocks_selector.attr('data-coloru'));

            } else {
                //plan again
                blocks_selector.attr('data-planned', 1);
                blocks_selector.css('background', blocks_selector.attr('data-colorp'));
            }
        }


        function _getBlocksInRange(start, value) {
            var blocks = [];
            var startId = Number(start / _options.step) - Number(_options.min / _options.step) + 1;
            var blocksNo = value / _options.step;

            for (var n = 0; n < blocksNo; n++) {
                var step = (Number(startId) + n);
                blocks.push($('#step_' + parentId + '_' + step));
            }
            return blocks;
        }


        /**
         * Adds multiple block to the slider scale
         * @param {Array} blocksArray example: Array([[0,20],[40,60]...])
         * @return {Object} self instance of MrDad class
         */
        this.addBlocks = function (blocksArray) {
            if (typeof (blocksArray) === 'string') {
                blocksArray = JSON.parse(blocksArray);
            }
            var blocksToAdd = [];
            for (var i = 0; i < blocksArray.length; i++) {
                blocksToAdd = _getBlocksInRange(blocksArray[i][0], blocksArray[i][1]);
                _addBlock(blocksToAdd, blocksArray[i][1], blocksArray[i][2], blocksArray[i][3], blocksArray[i][4]);
            }
            return this;
        };

        this.removeBlock = function (step) {
            _removeBlock(step);
        };


        /**
         * Gets all blocks for this ClickB instance
         * @return {Array} of blocks
         */
        this.getBlocks = function () {
            var blocks = [];
            var _blocks = $('div#' + parentId + ' .planned-block-start');
            if (_blocks.length > 0) {
                _blocks.each(function (i, e) {
                    var block = {};
                    block.id = e.getAttribute('id');
                    block.start = e.getAttribute('data-start');
                    block.value = e.getAttribute('data-value');
                    block.color = e.getAttribute('data-color');
                    blocks.push(block);
                });
            }
            return blocks;
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
