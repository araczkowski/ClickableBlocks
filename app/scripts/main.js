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
     *      @property {Object} userOptions.toolbarId element ID when the toolbar shoud by created
     *      @property {Object} userOptions.blocksToolbar array of objects with blocks description
     *      @property {Object} userOptions.openBlocks array of array with open blocks data
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
            _openBlocks();
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


        function _addBlock(bSteps, value, color) {

            for (var i = 0; i < bSteps.length; i++) {
                bSteps[i].removeClass('empty');
                bSteps[i].addClass('planned-block-body');
                bSteps[i].addClass('planned-block-' + bSteps[0].attr('id'));
                bSteps[i].attr('data-color', color);
                bSteps[i].css('background', color);

                if (i === 0) {
                    bSteps[i].addClass('planned-block-start');
                    bSteps[i].find('div').prepend('<span class="closer" onclick="' + parentId + '.removeBlock(\'' + bSteps[0].attr('id') + '\')"><i class="fa">x</i></span>');
                    bSteps[i].attr('data-value', value);
                }

                if (i === bSteps.length - 1) {
                    bSteps[i].addClass('planned-block-end');
                }
            }

        }

        // to remove the blocks from slider
        function _removeBlock(step) {
            var selector = '.planned-block-' + step;
            $(selector).removeClass('planned-block-body').removeClass('planned-block-start').removeClass('planned-block-end').addClass('empty');
            $(selector).find($('.closer')).remove();
            $(selector).attr('data-value', '');
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

        function _openBlocks() {
            _options.openBlocks.forEach(function (block) {
                var b = (_getBlocksInRange(block[0], block[1]));
                for (var i = 0; i < b.length; i++) {

                    b[i].addClass('empty');
                    // IE8 problem
                    $(b[i].selector).addClass('empty');
                }
            });


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
                _addBlock(blocksToAdd, blocksArray[i][1], blocksArray[i][2]);
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
