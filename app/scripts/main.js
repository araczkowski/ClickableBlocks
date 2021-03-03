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
            basedonbar: false,
            width: 'auto',
            mode: 'plan',
            addEmptyColumns: false,
            preId: 0,
            enfId: 0,
            preDay: '',
            billexcused: 0,
            billunexcused: 0
        };

        //
        var parentDiv = $('#' + elementID + '_parent');
        var mainDiv;
        var allSteps;
        var _onChange = null;
        // This timeout, started on mousedown, triggers the beginning of a hold
        var holdStarter = null;
        // This is how many milliseconds to wait before recognizing a hold
        var holdDelay = 500;
        // This flag indicates the user is currently holding the mouse down
        var holdActive = false;


        function _init() {
            _mergeOptions();

            if ((_options.max - _options.min) % _options.step !== 0) {
                throw 'Blocks length should be multiple to step';
            }
            _build();

            _multiSelect();

        }

        function _multiSelect(){
            // multi select mode
            $(document).on('mousedown', function() {
                if (!_options.readonly){
                    // Do not take any immediate action - just set the holdStarter
                    //  to wait for the predetermined delay, and then begin a hold
                    holdStarter = setTimeout(function() {
                        holdStarter = null;
                        holdActive = true;
                        // begin hold-only operation here, if desired
                        $('html').addClass('multiSelectMode');
                    }, holdDelay);
                }
            });

            $(document).on('mouseup', function() {
                if (!_options.readonly){
                    // If the mouse is released immediately (i.e., a click), before the
                    //  holdStarter runs, then cancel the holdStarter and do the click
                    $('html').removeClass('multiSelectMode');
                    clearTimeout(holdStarter);
                    holdActive = false;
                }
            });
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
            var tw = 1;
            var mw = 0;
            var bw = 0
            if (_options.width === 'auto') {
                if (_options.toolbar) {
                    tw = 7;
                }
                if (_options.mealbar) {
                    mw = 5;
                }
                if (_options.basedonbar) {
                    bw = 3;
                }

                $('#' + elementID + '_parent').css('width', (allSteps * 1.1) + tw + mw + bw + 'em');

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
                'class': 'fa fa-lg fa-2x fa-plus-square ' + _options.mode
            });
            var unplanAll = $('<i/>', {
                'class': 'fa fa-lg fa-2x fa-minus-square ' + _options.mode
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


            var tick = $('<span/>', {
                class: 'ClickableBlocksTick',
                html: _options.stepLabelDispFormat(_options.min + (nSteps * _options.step))
            });

            // 3. mealbar
            if (_options.mealbar) {

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

                // multiselect
                cutlery.on('mouseenter', function(e){
                    if(e.buttons == 1 || e.buttons == 3){
                        _toggleMeal(this);
                    }
                })

            } else {
                $('<div/>', {
                    class: 'ClickableBlocksStep',
                    html: tick
                }).appendTo(mainDiv);
            }


            // 4. based_on
            if (_options.basedonbar) {
                var basedonbar = $('<div/>', {
                    id: 'basedOnBar' + elementID,
                    class: 'BasedOnBarSelector',
                }).appendTo(mainDiv);

                // basedonbar.on('click', function() {
                //   _toggleBasedOn(this);
                // });
            }

            // widget width
            _setWidth();

            // additional, empty columns
            if (_options.addEmptyColumns) {
                //TODO should be possible in CSS
                $('.ClickableBlocksStep.ClickableBlocksEmptyColumn').next('div').not('.ClickableBlocksPlannedBlockStart').css('border-left', '2px solid #656565');
            }

            //
            parentDiv.on('mouseleave', function(e){
                if (!_options.readonly){
                    if(e.buttons == 1 || e.buttons == 3){
                       gMultiSelectToogleBlockId = null;
                    }
                }
            })

            $('div.ClickableBlocksStep').on('mouseenter', function(e){
                if (!_options.readonly){
                    if(e.buttons == 1 || e.buttons == 3){
                      var blockSelector = $(this).attr('data-block');
                      if (!blockSelector){
                        // clear selected block when entering empty block
                        gMultiSelectToogleBlockId = null;
                      }
                    }
                }
            })
        }


        function _addBlock(bSteps, block) {
            var i = 0;
            var blockSelector;

            bSteps.forEach(function addBlockOnStep(step) {

                if (i === 0) {
                    step.addClass('ClickableBlocksPlannedBlockStart').attr('data-value', block.value).find('div.ClickableBlocksStepContent').html('<i class="' + _getBlockFeatures(block.planned, block.real, block.excused).item + '">').parent().addClass('ClickableBlocksStepHesBlockStart');
                    blockSelector = step.attr('id');
                }

                step.addClass('ClickableBlocksPlannedBlockBody').attr('data-id', block.id);
                step.attr('data-colplanned', block.colplanned).attr('data-colunplanned', block.colunplanned);
                step.attr('data-colreal', block.colreal).attr('data-coladded', block.coladded);
                step.attr('data-colunreal', block.colunreal).attr('data-coldeleted', block.coldeleted);
                step.attr('data-colexcused', block.colexcused).attr('data-planned', block.planned);
                step.attr('data-real', block.real).attr('data-excused', block.excused);
                step.attr('data-block', blockSelector).find('div.ClickableBlocksStepContent').css('background', block[_getBlockFeatures(block.planned, block.real, block.excused).color]);



                if (i === bSteps.length - 1) {
                    step.addClass('ClickableBlocksPlannedBlockEnd').addClass('ClickableBlocksStepHesBlockEnd');

                }

                //initEvent
                step.unbind('click').on('click', function() {
                    _togglePlan(blockSelector);
                });

                // multiselect
                step.on('mouseenter', function(e){
                    if (!_options.readonly){
                        if(e.buttons == 1 || e.buttons == 3){
                            if (gMultiSelectToogleBlockId !== blockSelector){
                                gMultiSelectToogleBlockId = blockSelector;
                                _togglePlan(blockSelector);
                                $('html').addClass('multiSelectMode');
                            }
                        }
                    }
                })
                i++;
            });



            if (typeof(_onChange) === 'function') {
                _onChange();
            }


        }

        function _modeFullReal() {
            var basedon = $('div#steps_' + elementID).attr('data-basedon');
            if (_options.mode === 'real' && basedon === 'REAL') {
                return true;
            }
            return false;
        }

        function _getBlockFeatures(plan, real, excused) {

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
                    if (excused === 'Y') {
                        return {
                            'color': 'colexcused',
                            'item': 'fa-letter-E'
                        };
                    } else {
                        return {
                            'color': 'coldeleted',
                            'item': 'fa-letter-N'
                        };
                    }
                }

            }
            // plan or budg
            else {
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

        function _getMealFeatures(plan, real, fact) {

            if (_options.mode === 'real') {
                if (real === '1' && plan === '1') {
                    return {
                        'color': 'colreal',
                        'icon': ''
                    };
                } else if (real === '1' && plan === '0') {
                    return {
                        'color': 'coladded',
                        'icon': ''
                    };
                } else if (real === '0' && plan === '0') {
                    return {
                        'color': 'colunreal',
                        'icon': ''
                    };
                } else if (real === '0' && plan === '1') {
                    if (fact === '1') {
                        return {
                            'color': 'coldeleted',
                            'icon': '<i class="AddIcon" style="fill:#ff3d25; position:absolute; margin-right:5px;"><svg viewBox="0 0 133 133" width="1.5em" height="1.5em"> <path d="M101.896,109.739c-0.184,-0.737 -0.644,-1.473 -1.381,-1.934c-0.737,-0.368 -1.658,-0.461 -2.395,-0.184c-0.092,0 -6.632,2.21 -14.645,2.21c-15.658,0 -28.922,-9.026 -34.816,-23.395l35.645,0c1.381,0 2.579,-1.013 2.855,-2.395l2.211,-10.316c0.184,-0.829 0,-1.75 -0.553,-2.486c-0.553,-0.645 -1.381,-1.106 -2.303,-1.106l-42.277,0c-0.184,-3.592 -0.276,-6.724 0,-9.671l44.949,0c1.473,0 2.671,-1.013 2.947,-2.395l2.211,-10.5c0.184,-0.829 -0.093,-1.75 -0.645,-2.395c-0.553,-0.737 -1.382,-1.105 -2.303,-1.105l-43.106,0c6.171,-13.724 19.158,-22.106 34.632,-22.106c6.54,0 12.803,1.566 12.895,1.566c1.566,0.461 3.132,-0.46 3.5,-2.026l3.961,-14.645c0.184,-0.737 0.092,-1.566 -0.276,-2.211c-0.461,-0.644 -1.106,-1.197 -1.843,-1.381c-0.368,-0.092 -8.289,-2.119 -17.868,-2.119c-27.54,0 -51.12,17.132 -59.317,42.922l-9.027,0c-1.658,0 -2.947,1.29 -2.947,2.947l0,10.501c0,1.658 1.289,2.947 2.947,2.947l6.172,0c-0.185,3.224 -0.185,6.724 -0.093,9.671l-6.079,0c-1.658,0 -2.947,1.382 -2.947,2.948l0,10.408c0,1.566 1.289,2.947 2.947,2.947l8.751,0c7.737,27.08 30.855,44.396 59.593,44.396c11.053,0 19.618,-2.948 19.987,-3.04c1.381,-0.46 2.21,-1.934 1.842,-3.408l-3.224,-14.645Z"/></svg></i>'
                        };
                    } else {
                        return {
                            'color': 'colexcused',
                            'icon': '<i class="AddIcon" style="fill:#ac001a; position:absolute; margin-right:5px;"><svg viewBox="0 0 133 133" width="1.5em" height="1.5em"> <path d="M131.078,117.41l-115.935,-115.946c-0.491,-0.492 -1.228,-0.819 -1.884,-0.819c-0.655,0 -1.392,0.327 -1.883,0.819l-9.336,9.336c-0.492,0.491 -0.819,1.228 -0.819,1.883c0,0.656 0.327,1.393 0.819,1.884l115.935,115.946c0.491,0.492 1.228,0.819 1.884,0.819c0.655,0 1.392,-0.327 1.883,-0.819l9.336,-9.336c0.492,-0.491 0.819,-1.228 0.819,-1.883c0,-0.656 -0.327,-1.393 -0.819,-1.884Zm-82.968,-30.974c5.895,14.369 19.158,23.395 34.816,23.395c2.317,0 4.51,-0.184 6.461,-0.447c5.049,5.014 10.11,10.017 15.185,15.005c0.366,1.472 -0.463,2.943 -1.843,3.403c-0.368,0.092 -8.934,3.04 -19.987,3.04c-28.737,0 -51.856,-17.316 -59.593,-44.396l-8.75,0c-1.659,0 -2.948,-1.382 -2.948,-2.947l0,-10.408c0,-1.566 1.289,-2.947 2.948,-2.948l6.079,0c-0.092,-2.947 -0.092,-6.447 0.092,-9.671l-6.171,0c-1.659,0 -2.948,-1.29 -2.948,-2.947l0,-10.501c0,-1.657 1.289,-2.947 2.948,-2.947l9.026,0c0.075,-0.235 0.151,-0.47 0.229,-0.703c6.626,6.677 13.248,13.359 19.873,20.038c-0.045,2.09 0.037,4.305 0.162,6.731l6.515,0c5.398,5.44 10.799,10.875 16.208,16.303l-18.302,0Zm40.527,-25.974l-7.094,0c-5.43,-5.47 -10.864,-10.936 -16.306,-16.395l25.61,0c0.921,0 1.75,0.368 2.303,1.105c0.553,0.645 0.829,1.566 0.645,2.395l-2.211,10.5c-0.276,1.382 -1.473,2.395 -2.947,2.395Zm-49.233,-42.16c11.255,-10.799 26.562,-17.157 43.338,-17.157c9.579,0 17.5,2.027 17.869,2.119c0.737,0.184 1.381,0.737 1.842,1.381c0.368,0.645 0.46,1.474 0.276,2.211l-3.96,14.645c-0.369,1.566 -1.935,2.487 -3.5,2.026c-0.093,0 -6.356,-1.566 -12.895,-1.566c-10.985,0 -20.717,4.224 -27.646,11.585c-5.098,-5.092 -10.205,-10.174 -15.324,-15.244Z"/></svg></i>'
                        };
                    }

                }

            }
            // plan or budg
            else {
                if (plan === '1') {
                    return {
                        'color': 'colplanned',
                        'icon': ''
                    };
                } else {
                    return {
                        'color': 'colunplanned',
                        'icon': ''
                    };
                }
            }
        }

        function _togglePlan(blockSelector) {
            if (_options.readonly) {
                return;
            }

            var blocks = $('[data-block=' + blockSelector + ']');
            var key;
            var bStart = Number(blocks.attr('data-start'));
            var bEnd = Number(blocks.attr('data-start')) + Number(blocks.attr('data-value'));

            if (_options.mode === 'real') {
                if (blocks.attr('data-real') === '1') {
                    blocks.attr('data-real', '0');
                    blocks.attr('data-excused', 'Y');
                    // When a time-slot, starting at 12:00 or containing 12:00 (starting before and ending after),
                    // is checked, the meal must be checked as well.
                    if (bStart === 720 || (bStart < 720 && bEnd > 720)) {
                        if (_options.billexcused === 1) {
                            _mealOff(false, true);
                        } else {
                            _mealOff(false, false);
                        }
                    }
                } else {
                    //
                    if (blocks.attr('data-excused') === 'Y' && blocks.attr('data-planned') === '1') {
                        blocks.attr('data-excused', 'N');
                        if (bStart === 720 || (bStart < 720 && bEnd > 720)) {
                            if (_options.billunexcused === 1) {
                                _mealOff(false, true);
                            } else {
                                _mealOff(false, false);
                            }
                        }
                    } else {
                        blocks.attr('data-real', '1');
                        blocks.attr('data-excused', 'Y');
                        // When a time-slot, starting at 12:00 or containing 12:00 (starting before and ending after),
                        // is unchecked, the meal must be unchecked as well
                        if (bStart === 720 || (bStart < 720 && bEnd > 720)) {
                            _mealOn();
                        }
                    }
                }
            } else {
                if (blocks.attr('data-planned') === '1') {
                    blocks.attr('data-planned', '0');
                    // When a time-slot, starting at 12:00 or containing 12:00 (starting before and ending after),
                    // is checked, the meal must be checked as well.
                    if (bStart === 720 || (bStart < 720 && bEnd > 720)) {
                        _mealOff();
                    }
                } else {
                    blocks.attr('data-planned', '1');
                    // When a time-slot, starting at 12:00 or containing 12:00 (starting before and ending after),
                    // is unchecked, the meal must be unchecked as well
                    if (bStart === 720 || (bStart < 720 && bEnd > 720)) {
                        _mealOn();
                    }
                }
            }
            key = _getBlockFeatures(blocks.attr('data-planned'), blocks.attr('data-real'), blocks.attr('data-excused')).color;
            blocks.find('div.ClickableBlocksStepContent').css('background', blocks.attr('data-' + key));
            blocks.find('div.ClickableBlocksStepContent').first().html('<i class="' + _getBlockFeatures(blocks.attr('data-planned'), blocks.attr('data-real'), blocks.attr('data-excused')).item + '">');

            if (typeof(_onChange) === 'function') {
                _onChange();
            }
        }

        function _setBasedOn(basedon) {
            mainDiv.attr('data-basedon', basedon);
            //
            if (_options.basedonbar) {
                var e = $('#steps_' + elementID + ' div.BasedOnBarSelector');
                if (basedon === 'PLAN') {
                    e.html('<span class="BasedOn" style="color:rgb(255, 124, 52);">P</span>');
                    var boption = $('<span/>', {
                        class: 'BasedOnOption',
                        style: 'color:rgb(123, 206,91)',
                        text: 'R'
                    }).appendTo(e);
                    boption.on('click', function() {
                        _toggleBasedOn(this);
                    });
                    // multi select
                    // boption.on('mouseenter', function(e){
                    //     if(e.buttons == 1 || e.buttons == 3){
                    //         _toggleBasedOn(this);
                    //     }
                    // })
                } else if (basedon === 'REAL') {
                    e.html('<span class="BasedOn" style="color:rgb(123, 206, 91);">R</span>');
                    var boption = $('<span/>', {
                        class: 'BasedOnOption',
                        style: 'color:rgb(255, 124, 52)',
                        text: 'P'
                    }).appendTo(e);
                    boption.on('click', function() {
                        _toggleBasedOn(this);
                    });
                    // multi select
                    // boption.on('mouseenter', function(e){
                    //     if(e.buttons == 1 || e.buttons == 3){
                    //         _toggleBasedOn(this);
                    //     }
                    // })
                } else if (basedon === 'USER') {
                    e.html('<span class="BasedOn" style="color:#00afe5;">M</span>');
                }
                e.addClass('click');
                e.one('animationend webkitAnimationEnd onAnimationEnd', function() {
                    e.removeClass('click');
                });
            }

        }

        function _changeBasedOn(basedon, dbfmeal) {
            //
            _setBasedOn(basedon);
            // set meal
            var m = mainDiv.find('i.fa-cutlery').addClass('click').one('animationend webkitAnimationEnd onAnimationEnd', function() {
                m.removeClass('click');
            })
            if (basedon === 'PLAN') {
                m.attr('data-fmeal', m.attr('data-meal'));
            } else if (basedon === 'REAL') {
                m.attr('data-fmeal', m.attr('data-rmeal'));
            } else if (basedon === 'USER') {
                m.attr('data-fmeal', dbfmeal);
            }
            if ($(m).hasClass('mealOff')) {
                _mealOff(true);
            } else {
                _mealOn(true);
            }

            if (typeof(_onChange) === 'function') {
                _onChange();
            }
        }

        function _toggleBasedOn(e) {
            //on click
            if (_options.readonly) {
                return;
            }
            var e = $('#steps_' + elementID + ' div.BasedOnBarSelector');
            var basedon = mainDiv.attr('data-basedon');
            var newbasedon = basedon;
            if (basedon === 'USER') {
                return;
            }
            if (basedon === 'PLAN') {
                newbasedon = 'REAL'
            } else {
                newbasedon = 'PLAN'
            }
            _changeBasedOn(newbasedon)
        }

        function _toggleMeal(e) {
            //on click
            if (_options.readonly) {
                return;
            }
            if ($('div#steps_' + elementID + ' .ClickableBlocksPlannedBlockStart').length > 0) {
                if (!_modeFullReal()) {
                    if ($(e).hasClass('mealOff')) {
                        _mealOn();
                    } else {
                        _mealOff();
                    }
                } else {
                    e = $(e)
                    if (e.hasClass('mealOn')) {
                        _mealOff();
                    } else {
                        if (_options.mode !== 'real' || e.attr('data-meal') === "0") {
                            _mealOn();
                        } else {
                            if (e.attr('data-fmeal') !== "1") {
                                _mealOff();
                            } else {
                                _mealOn();
                            }
                        }
                    }
                }
            }
        }

        function _addMeal(meal, rmeal, fmeal) {
            if (_options.mealbar) {
                var e = $('#steps_' + elementID + ' i.fa-cutlery');
                e.attr('data-meal', meal);
                e.attr('data-rmeal', rmeal);
                e.attr('data-fmeal', fmeal);
                if (_options.mode === 'real') {
                    if (rmeal === '1') {
                        _mealOn(true);
                    } else {
                        _mealOff(true);
                    }
                } else {
                    if (meal === '1') {
                        _mealOn(true);
                    } else {
                        _mealOff(true);
                    }
                }
            }
        }

        function _mealOn(init) {
            var e = mainDiv.find('i.fa-cutlery');
            e.addClass('click').one('animationend webkitAnimationEnd onAnimationEnd', function() {
                e.removeClass('click');
            });

            if (_options.mode === 'real') {
                e.attr('data-rmeal', 1);
                if (!init && _modeFullReal()) {
                    e.attr('data-fmeal', 1);
                }
            } else {
                e.attr('data-meal', 1);
            }

            var MeelFeatures = _getMealFeatures(e.attr('data-meal'), e.attr('data-rmeal'));
            var color_key = MeelFeatures.color;
            var bcolor = mainDiv.find('div.ClickableBlocksPlannedBlockBody:first').attr('data-' + color_key);
            e.parent().find("i.AddIcon").remove()
            e.css('color', bcolor).removeClass('mealOff').addClass('mealOn');

            if (typeof(_onChange) === 'function') {
                _onChange();
            }
        }

        function _mealOff(init, billBlock12) {
            var basedon = $('div#steps_' + elementID).attr('data-basedon');
            if (_options.mode !== 'real') {
                var e = mainDiv.find('i.fa-cutlery').addClass('click').one('animationend webkitAnimationEnd onAnimationEnd', function() {
                    e.removeClass('click');
                }).attr((_options.mode === 'real') ? 'data-rmeal' : 'data-meal', 0);


                var key = _getBlockFeatures(e.attr('data-meal'), e.attr('data-rmeal')).color;
                var bcolor = mainDiv.find('div.ClickableBlocksPlannedBlockBody:first').attr('data-' + key);
                e.css('color', bcolor).removeClass('mealOn').addClass('mealOff');
                e.parent().find("i.AddIcon").remove()

            } else {
                var e = mainDiv.find('i.fa-cutlery').addClass('click').one('animationend webkitAnimationEnd onAnimationEnd', function() {
                    e.removeClass('click');
                })

                var old_rmeal = e.attr('data-rmeal')
                e.attr('data-rmeal', 0);
                if (!init) {
                    var new_rmeal = e.attr('data-rmeal')
                    if (basedon === 'REAL') {
                        if (e.attr('data-meal') === "0") {
                            e.attr('data-fmeal', 0);
                        } else {
                            if (old_rmeal === new_rmeal) {
                                if (e.attr('data-fmeal') === "0") {
                                    e.attr('data-fmeal', 1);
                                } else {
                                    e.attr('data-fmeal', 0);
                                }
                            } else {
                                e.attr('data-fmeal', 0);
                            }
                        }
                    } else {
                        if (e.attr('data-meal') === "0") {
                            e.attr('data-fmeal', 0);
                        } else {
                            e.attr('data-fmeal', 1);
                        }
                    }
                }
                // case when the meal should be changed after the click on 12 o'clock block
                if (arguments.length > 1 && e.attr('data-meal') !== "0") {
                    if (billBlock12) {
                        e.attr('data-rmeal', 0);
                        e.attr('data-fmeal', 1);
                    } else {
                        e.attr('data-rmeal', 0);
                        e.attr('data-fmeal', 0);
                    }
                    if (basedon !== 'REAL') {
                        e.attr('data-fmeal', e.attr('data-meal'));
                    }

                }


                var MeelFeatures = _getMealFeatures(e.attr('data-meal'), e.attr('data-rmeal'), e.attr('data-fmeal'))
                var color_key = MeelFeatures.color;
                var additional_icon = MeelFeatures.icon;
                var bcolor = mainDiv.find('div.ClickableBlocksPlannedBlockBody:first').attr('data-' + color_key);
                e.css('color', bcolor).removeClass('mealOn').addClass('mealOff');
                e.parent().find("i.AddIcon").remove()
                if (additional_icon.length > 0) {
                    $(additional_icon).appendTo(e.parent());
                }
            }
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
                    mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-excused', 'Y');
                } else {
                    mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-planned', '1');
                }

                // color and item
                mainDiv.find('div.ClickableBlocksPlannedBlockBody').each(function(i, obj) {
                    var o = $(obj);
                    var bFeatures = _getBlockFeatures(o.attr('data-planned'), o.attr('data-real'), o.attr('data-excused'));
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
                var sunSetBlock = mainDiv.find('div.ClickableBlocksPlannedBlockBody').filter('[data-start="720"],[data-start="735"],[data-start="750"],[data-start="765"]');
                if (sunSetBlock.length > 0) {
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
            var dExcused = '';
            if (mainDiv.find('.ClickableBlocksPlannedBlockStart').length > 0) {
                if (_options.mode === 'real') {
                    var l_real = mainDiv.find('div.ClickableBlocksPlannedBlockBody[data-real=1]').length
                    var l_excused = mainDiv.find('div.ClickableBlocksPlannedBlockBody[data-excused="Y"][data-planned=1]').length
                    mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-real', '0');
                    if (l_real === 0) {
                        mainDiv.find('div.ClickableBlocksPlannedBlockBody[data-planned=1]').attr('data-excused', 'N');
                        // mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-excused', 'N');
                        dExcused = 'N';
                    }
                    if (l_real !== 0 || l_excused === 0) {
                        mainDiv.find('div.ClickableBlocksPlannedBlockBody[data-planned=1]').attr('data-excused', 'Y');
                        // mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-excused', 'Y');
                        dExcused = 'Y';
                    }
                } else {
                    mainDiv.find('div.ClickableBlocksPlannedBlockBody').attr('data-planned', '0');
                }

                // color
                mainDiv.find('div.ClickableBlocksPlannedBlockBody').each(function(i, obj) {
                    var o = $(obj);
                    var bFeatures = _getBlockFeatures(o.attr('data-planned'), o.attr('data-real'), o.attr('data-excused'));
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
                if (_options.mode === 'real') {
                    var blockWillBeBilled = false;
                    if (dExcused === 'Y') {
                        if (_options.billexcused === 1) {
                            blockWillBeBilled = true;
                        }
                    } else {
                        if (_options.billunexcused === 1) {
                            blockWillBeBilled = true;
                        }
                    }
                    _mealOff(false, blockWillBeBilled);
                } else {
                    _mealOff();
                }


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

                _setBasedOn(ArrOfBloObj.basedon)

                ArrOfBloObj.blocks.forEach(function addBlock(block) {
                    if (!block.colplanned) {
                        if (_options.mode === 'budg') {
                            block.colplanned = '#07A4EB';
                        } else {
                            block.colplanned = '#ff7c34';
                        }
                    }
                    if (!block.colunplanned) {
                        if (_options.mode === 'budg') {
                            block.colunplanned = '#ffd6b8';
                        } else {
                            block.colunplanned = '#ffd6b8';
                        }
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
                    if (!block.colexcused) {
                        block.colexcused = '#ac001a';
                    }
                    _addBlock(_getStepssInRange(block.start, block.value), block);

                });

                _addMeal(ArrOfBloObj.meal, ArrOfBloObj.rmeal, ArrOfBloObj.fmeal);

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
                    block.excused = e.getAttribute('data-excused');
                    blocks.push(block);
                });
            }

            obj.blocks = blocks;
            obj.preId = _options.preId;
            obj.enfId = _options.enfId;
            obj.preDay = _options.preDay;
            obj.meal = $('div#steps_' + elementID + ' .ClickableBlocksMealSelector i.fa').attr('data-meal');
            obj.rmeal = $('div#steps_' + elementID + ' .ClickableBlocksMealSelector i.fa').attr('data-rmeal');
            obj.fmeal = $('div#steps_' + elementID + ' .ClickableBlocksMealSelector i.fa').attr('data-fmeal');
            obj.basedon = $('div#steps_' + elementID).attr('data-basedon');
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

        this.setBasedOn = function(newbasedon, dbfmeal) {
            if (newbasedon !== 'PLAN' && newbasedon !== 'REAL' && newbasedon !== 'USER') {
                return;
            }
            if (newbasedon !== 'USER') {
                _changeBasedOn(newbasedon);
            } else {
                // the dbfmeal is set only in case of USER mode
                _changeBasedOn(newbasedon, dbfmeal);
            }
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
