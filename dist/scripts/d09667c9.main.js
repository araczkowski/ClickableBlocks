"use strict";!function(w,$){w.ClickB=function(elementID,userOptions){function _init(){if(_mergeOptions(),(_options.max-_options.min)%_options.step!=0)throw"Blocks length should be multiple to step";_build(),_options.readonly||_multiSelect()}function _multiSelect(){parentDiv.on("mousedown",function(){holdStarter=setTimeout(function(){holdStarter=null,holdActive=!0,$("html").addClass("multiSelectMode")},holdDelay)}),$(document).on("mouseup",function(){clearTimeout(holdStarter),holdActive=!1,$("html.multiSelectMode").removeClass("multiSelectMode")})}function _mergeOptions(){if(!userOptions)return _options;if("string"==typeof userOptions&&(userOptions=JSON.parse(userOptions)),void 0!==userOptions.stepLabelDispFormat&&"string"==typeof userOptions.stepLabelDispFormat){var fn;eval("fn = "+userOptions.stepLabelDispFormat),userOptions.stepLabelDispFormat=fn}for(var optionKey in _options)if(optionKey in userOptions)switch(typeof _options[optionKey]){case"boolean":_options[optionKey]=!!userOptions[optionKey];break;case"number":_options[optionKey]=Math.abs(userOptions[optionKey]);break;case"string":_options[optionKey]=""+userOptions[optionKey];break;default:_options[optionKey]=userOptions[optionKey]}return _options}function _setWidth(){var a=1,b=0,c=0;"auto"===_options.width?(_options.toolbar&&(a=7),_options.mealbar&&(b=5),_options.basedonbar&&(c=3),$("#"+elementID+"_parent").css("width",1.1*allSteps+a+b+c+"em")):$("#"+elementID+"_parent").css("width",_options.width)}function _build(){var a="ClickableBlocksSteps";_options.readonly?a+=" ClickableBlocksReadonly":a+=" ClickableBlocksEdit",mainDiv=$("<div/>",{id:"steps_"+elementID,"data-clickB":elementID,"data-pre-id":_options.preId,"data-enf-id":_options.enfId,class:a}).appendTo(parentDiv);var b;_options.toolbar||(b="ClickableBlocksNoDisp");var c=$("<i/>",{class:"fa fa-lg fa-2x fa-plus-square "+_options.mode}),d=$("<i/>",{class:"fa fa-lg fa-2x fa-minus-square "+_options.mode});$("<div/>",{id:"selector_steps_"+elementID,class:"ClickableBlocksAllBlockSelector "+b,html:c.add(d)}).appendTo(mainDiv),c.on("click",function(){_planAll(this)}),d.on("click",function(){_unplanAll(this)});var e=(_options.max-_options.min)/_options.step;allSteps=e,_options.addEmptyColumns&&(allSteps=e+4);var f="1.1em;";"auto"!==_options.width&&(f=100/allSteps+"%");for(var g=0,h="",i="",j=0;e>j;j++){g=j*_options.step%60,0===g?(h="ClickableBlocksStepContentFullHour",i="ClickableBlocksStepFullHour"):30===g?(h="ClickableBlocksStepContentHalfHour",i="ClickableBlocksStepHalfHour"):(h="ClickableBlocksStepContentQuarter",i="ClickableBlocksStepQuarter"),0===j&&(h+=" ClickableBlocksStepContentStart",i+=" ClickableBlocksStepStart"),j===e-1&&(h+=" ClickableBlocksStepContentEnd",i+=" ClickableBlocksStepEnd");var k=_options.min+j*_options.step;$("<div/>",{id:"step_"+elementID+"_"+(Number(j)+1),class:"ClickableBlocksStep "+i,style:"width: "+f,"data-start":k,html:'<span class="ClickableBlocksTick">'+_options.stepLabelDispFormat(k)+'</span><div class="ClickableBlocksStepContent '+h+'"></div>'}).appendTo(mainDiv),!_options.addEmptyColumns||465!==k&&825!==k&&705!==k&&945!==k||$("<div/>",{class:"ClickableBlocksStep ClickableBlocksEmptyColumn",style:"width:"+f}).appendTo(mainDiv)}var l=$("<span/>",{class:"ClickableBlocksTick",html:_options.stepLabelDispFormat(_options.min+e*_options.step)});if(_options.mealbar){var m=$("<i/>",{class:"fa fa-cutlery fa-2x mealOff"});$("<div/>",{id:"mealSelectorSteps"+elementID,class:"ClickableBlocksMealSelector",html:l.add(m)}).appendTo(mainDiv),m.on("click",function(){_toggleMeal(this)}),m.on("mouseenter",function(a){1!=a.buttons&&3!=a.buttons||_toggleMeal(this)})}else $("<div/>",{class:"ClickableBlocksStep",html:l}).appendTo(mainDiv);if(_options.basedonbar){$("<div/>",{id:"basedOnBar"+elementID,class:"BasedOnBarSelector"}).appendTo(mainDiv)}_setWidth(),_options.addEmptyColumns&&$(".ClickableBlocksStep.ClickableBlocksEmptyColumn").next("div").not(".ClickableBlocksPlannedBlockStart").css("border-left","2px solid #656565")}function _addBlock(a,b){var c,d=0;a.forEach(function(e){0===d&&(e.addClass("ClickableBlocksPlannedBlockStart").attr("data-value",b.value).find("div.ClickableBlocksStepContent").html('<i class="'+_getBlockFeatures(b.planned,b.real,b.excused).item+'">').parent().addClass("ClickableBlocksStepHesBlockStart"),c=e.attr("id")),e.addClass("ClickableBlocksPlannedBlockBody").attr("data-id",b.id),e.attr("data-colplanned",b.colplanned).attr("data-colunplanned",b.colunplanned),e.attr("data-colreal",b.colreal).attr("data-coladded",b.coladded),e.attr("data-colunreal",b.colunreal).attr("data-coldeleted",b.coldeleted),e.attr("data-colexcused",b.colexcused).attr("data-planned",b.planned),e.attr("data-real",b.real).attr("data-excused",b.excused),e.attr("data-block",c).find("div.ClickableBlocksStepContent").css("background",b[_getBlockFeatures(b.planned,b.real,b.excused).color]),d===a.length-1&&e.addClass("ClickableBlocksPlannedBlockEnd").addClass("ClickableBlocksStepHesBlockEnd"),e.unbind("click").on("click",function(){_togglePlan(c)}),e.on("mouseenter",function(a){1!=a.buttons&&3!=a.buttons||gMultiSelectToogleBlockId!==c&&(gMultiSelectToogleBlockId=c,_togglePlan(c),setTimeout(function(){gMultiSelectToogleBlockId=null},1500),$("html").addClass("multiSelectMode"))}),d++}),"function"==typeof _onChange&&_onChange()}function _modeFullReal(){var a=$("div#steps_"+elementID).attr("data-basedon");return"real"===_options.mode&&"REAL"===a}function _getBlockFeatures(a,b,c){return"real"!==_options.mode?"1"===a?{color:"colplanned",item:""}:{color:"colunplanned",item:""}:"1"===b&&"1"===a?{color:"colreal",item:"fa fa-check"}:"1"===b&&"0"===a?{color:"coladded",item:"fa fa-plus"}:"0"===b&&"0"===a?{color:"colunreal",item:""}:"0"===b&&"1"===a?"Y"===c?{color:"colexcused",item:"fa-letter-E"}:{color:"coldeleted",item:"fa-letter-N"}:void 0}function _getMealFeatures(a,b,c){return"real"!==_options.mode?"1"===a?{color:"colplanned",icon:""}:{color:"colunplanned",icon:""}:"1"===b&&"1"===a?{color:"colreal",icon:""}:"1"===b&&"0"===a?{color:"coladded",icon:""}:"0"===b&&"0"===a?{color:"colunreal",icon:""}:"0"===b&&"1"===a?"1"===c?{color:"coldeleted",icon:'<i class="AddIcon" style="fill:#ff3d25; position:absolute; margin-left:5px;"><svg viewBox="0 0 133 133" width="1.5em" height="1.5em"> <path d="M101.896,109.739c-0.184,-0.737 -0.644,-1.473 -1.381,-1.934c-0.737,-0.368 -1.658,-0.461 -2.395,-0.184c-0.092,0 -6.632,2.21 -14.645,2.21c-15.658,0 -28.922,-9.026 -34.816,-23.395l35.645,0c1.381,0 2.579,-1.013 2.855,-2.395l2.211,-10.316c0.184,-0.829 0,-1.75 -0.553,-2.486c-0.553,-0.645 -1.381,-1.106 -2.303,-1.106l-42.277,0c-0.184,-3.592 -0.276,-6.724 0,-9.671l44.949,0c1.473,0 2.671,-1.013 2.947,-2.395l2.211,-10.5c0.184,-0.829 -0.093,-1.75 -0.645,-2.395c-0.553,-0.737 -1.382,-1.105 -2.303,-1.105l-43.106,0c6.171,-13.724 19.158,-22.106 34.632,-22.106c6.54,0 12.803,1.566 12.895,1.566c1.566,0.461 3.132,-0.46 3.5,-2.026l3.961,-14.645c0.184,-0.737 0.092,-1.566 -0.276,-2.211c-0.461,-0.644 -1.106,-1.197 -1.843,-1.381c-0.368,-0.092 -8.289,-2.119 -17.868,-2.119c-27.54,0 -51.12,17.132 -59.317,42.922l-9.027,0c-1.658,0 -2.947,1.29 -2.947,2.947l0,10.501c0,1.658 1.289,2.947 2.947,2.947l6.172,0c-0.185,3.224 -0.185,6.724 -0.093,9.671l-6.079,0c-1.658,0 -2.947,1.382 -2.947,2.948l0,10.408c0,1.566 1.289,2.947 2.947,2.947l8.751,0c7.737,27.08 30.855,44.396 59.593,44.396c11.053,0 19.618,-2.948 19.987,-3.04c1.381,-0.46 2.21,-1.934 1.842,-3.408l-3.224,-14.645Z"/></svg></i>'}:{color:"colexcused",icon:'<i class="AddIcon" style="fill:#ac001a; position:absolute; margin-left:5px;"><svg viewBox="0 0 133 133" width="1.5em" height="1.5em"> <path d="M131.078,117.41l-115.935,-115.946c-0.491,-0.492 -1.228,-0.819 -1.884,-0.819c-0.655,0 -1.392,0.327 -1.883,0.819l-9.336,9.336c-0.492,0.491 -0.819,1.228 -0.819,1.883c0,0.656 0.327,1.393 0.819,1.884l115.935,115.946c0.491,0.492 1.228,0.819 1.884,0.819c0.655,0 1.392,-0.327 1.883,-0.819l9.336,-9.336c0.492,-0.491 0.819,-1.228 0.819,-1.883c0,-0.656 -0.327,-1.393 -0.819,-1.884Zm-82.968,-30.974c5.895,14.369 19.158,23.395 34.816,23.395c2.317,0 4.51,-0.184 6.461,-0.447c5.049,5.014 10.11,10.017 15.185,15.005c0.366,1.472 -0.463,2.943 -1.843,3.403c-0.368,0.092 -8.934,3.04 -19.987,3.04c-28.737,0 -51.856,-17.316 -59.593,-44.396l-8.75,0c-1.659,0 -2.948,-1.382 -2.948,-2.947l0,-10.408c0,-1.566 1.289,-2.947 2.948,-2.948l6.079,0c-0.092,-2.947 -0.092,-6.447 0.092,-9.671l-6.171,0c-1.659,0 -2.948,-1.29 -2.948,-2.947l0,-10.501c0,-1.657 1.289,-2.947 2.948,-2.947l9.026,0c0.075,-0.235 0.151,-0.47 0.229,-0.703c6.626,6.677 13.248,13.359 19.873,20.038c-0.045,2.09 0.037,4.305 0.162,6.731l6.515,0c5.398,5.44 10.799,10.875 16.208,16.303l-18.302,0Zm40.527,-25.974l-7.094,0c-5.43,-5.47 -10.864,-10.936 -16.306,-16.395l25.61,0c0.921,0 1.75,0.368 2.303,1.105c0.553,0.645 0.829,1.566 0.645,2.395l-2.211,10.5c-0.276,1.382 -1.473,2.395 -2.947,2.395Zm-49.233,-42.16c11.255,-10.799 26.562,-17.157 43.338,-17.157c9.579,0 17.5,2.027 17.869,2.119c0.737,0.184 1.381,0.737 1.842,1.381c0.368,0.645 0.46,1.474 0.276,2.211l-3.96,14.645c-0.369,1.566 -1.935,2.487 -3.5,2.026c-0.093,0 -6.356,-1.566 -12.895,-1.566c-10.985,0 -20.717,4.224 -27.646,11.585c-5.098,-5.092 -10.205,-10.174 -15.324,-15.244Z"/></svg></i>'}:void 0}function _togglePlan(a){if(!_options.readonly){var b,c=$("[data-block="+a+"]"),d=Number(c.attr("data-start")),e=Number(c.attr("data-start"))+Number(c.attr("data-value"));"real"===_options.mode?"1"===c.attr("data-real")?(c.attr("data-real","0"),c.attr("data-excused","Y"),(720===d||d<720&&e>720)&&(1===_options.billexcused?_mealOff(!1,!0):_mealOff(!1,!1))):"Y"===c.attr("data-excused")&&"1"===c.attr("data-planned")?(c.attr("data-excused","N"),(720===d||d<720&&e>720)&&(1===_options.billunexcused?_mealOff(!1,!0):_mealOff(!1,!1))):(c.attr("data-real","1"),c.attr("data-excused","Y"),(720===d||d<720&&e>720)&&_mealOn()):"1"===c.attr("data-planned")?(c.attr("data-planned","0"),(720===d||d<720&&e>720)&&_mealOff()):(c.attr("data-planned","1"),(720===d||d<720&&e>720)&&_mealOn()),b=_getBlockFeatures(c.attr("data-planned"),c.attr("data-real"),c.attr("data-excused")).color,c.find("div.ClickableBlocksStepContent").css("background",c.attr("data-"+b)),c.find("div.ClickableBlocksStepContent").first().html('<i class="'+_getBlockFeatures(c.attr("data-planned"),c.attr("data-real"),c.attr("data-excused")).item+'">'),"function"==typeof _onChange&&_onChange()}}function _setBasedOn(a){if(mainDiv.attr("data-basedon",a),_options.basedonbar){var b=$("#steps_"+elementID+" div.BasedOnBarSelector");if("PLAN"===a){b.html('<span class="BasedOn" style="color:rgb(255, 124, 52);">P</span>');var c=$("<span/>",{class:"BasedOnOption",style:"color:rgb(123, 206,91)",text:"R"}).appendTo(b);c.on("click",function(){_toggleBasedOn(this)})}else if("REAL"===a){b.html('<span class="BasedOn" style="color:rgb(123, 206, 91);">R</span>');var c=$("<span/>",{class:"BasedOnOption",style:"color:rgb(255, 124, 52)",text:"P"}).appendTo(b);c.on("click",function(){_toggleBasedOn(this)})}else"USER"===a&&b.html('<span class="BasedOn" style="color:#00afe5;">M</span>');b.addClass("click"),b.one("animationend webkitAnimationEnd onAnimationEnd",function(){b.removeClass("click")})}}function _changeBasedOn(a,b){_setBasedOn(a);var c=mainDiv.find("i.fa-cutlery").addClass("click").one("animationend webkitAnimationEnd onAnimationEnd",function(){c.removeClass("click")});"PLAN"===a?c.attr("data-fmeal",c.attr("data-meal")):"REAL"===a?c.attr("data-fmeal",c.attr("data-rmeal")):"USER"===a&&c.attr("data-fmeal",b),$(c).hasClass("mealOff")?_mealOff(!0):_mealOn(!0),"function"==typeof _onChange&&_onChange()}function _toggleBasedOn(a){if(!_options.readonly){var b=($("#steps_"+elementID+" div.BasedOnBarSelector"),mainDiv.attr("data-basedon")),c=b;"USER"!==b&&(c="PLAN"===b?"REAL":"PLAN",_changeBasedOn(c))}}function _toggleMeal(a){_options.readonly||$("div#steps_"+elementID+" .ClickableBlocksPlannedBlockStart").length>0&&(_modeFullReal()?(a=$(a),a.hasClass("mealOn")?_mealOff():"real"!==_options.mode||"0"===a.attr("data-meal")?_mealOn():"1"!==a.attr("data-fmeal")?_mealOff():_mealOn()):$(a).hasClass("mealOff")?_mealOn():_mealOff())}function _addMeal(a,b,c){if(_options.mealbar){var d=$("#steps_"+elementID+" i.fa-cutlery");d.attr("data-meal",a),d.attr("data-rmeal",b),d.attr("data-fmeal",c),"real"===_options.mode?"1"===b?_mealOn(!0):_mealOff(!0):"1"===a?_mealOn(!0):_mealOff(!0)}}function _mealOn(a){var b=mainDiv.find("i.fa-cutlery");b.addClass("click").one("animationend webkitAnimationEnd onAnimationEnd",function(){b.removeClass("click")}),"real"===_options.mode?(b.attr("data-rmeal",1),!a&&_modeFullReal()&&b.attr("data-fmeal",1)):b.attr("data-meal",1);var c=_getMealFeatures(b.attr("data-meal"),b.attr("data-rmeal")),d=c.color,e=mainDiv.find("div.ClickableBlocksPlannedBlockBody:first").attr("data-"+d);b.find("i.AddIcon").remove(),b.css("color",e).removeClass("mealOff").addClass("mealOn"),"function"==typeof _onChange&&_onChange()}function _mealOff(a,b){var c=$("div#steps_"+elementID).attr("data-basedon");if("real"!==_options.mode){var d=mainDiv.find("i.fa-cutlery").addClass("click").one("animationend webkitAnimationEnd onAnimationEnd",function(){d.removeClass("click")}).attr("real"===_options.mode?"data-rmeal":"data-meal",0),e=_getBlockFeatures(d.attr("data-meal"),d.attr("data-rmeal")).color,f=mainDiv.find("div.ClickableBlocksPlannedBlockBody:first").attr("data-"+e);d.css("color",f).removeClass("mealOn").addClass("mealOff"),d.find("i.AddIcon").remove()}else{var d=mainDiv.find("i.fa-cutlery").addClass("click").one("animationend webkitAnimationEnd onAnimationEnd",function(){d.removeClass("click")}),g=d.attr("data-rmeal");if(d.attr("data-rmeal",0),!a){var h=d.attr("data-rmeal");"REAL"===c?"0"===d.attr("data-meal")?d.attr("data-fmeal",0):g===h&&"0"===d.attr("data-fmeal")?d.attr("data-fmeal",1):d.attr("data-fmeal",0):"0"===d.attr("data-meal")?d.attr("data-fmeal",0):d.attr("data-fmeal",1)}arguments.length>1&&"0"!==d.attr("data-meal")&&(b?(d.attr("data-rmeal",0),d.attr("data-fmeal",1)):(d.attr("data-rmeal",0),d.attr("data-fmeal",0)),"REAL"!==c&&d.attr("data-fmeal",d.attr("data-meal")));var i=_getMealFeatures(d.attr("data-meal"),d.attr("data-rmeal"),d.attr("data-fmeal")),j=i.color,k=i.icon,f=mainDiv.find("div.ClickableBlocksPlannedBlockBody:first").attr("data-"+j);d.css("color",f).removeClass("mealOn").addClass("mealOff"),d.find("i.AddIcon").remove(),k.length>0&&$(k).appendTo(d)}"function"==typeof _onChange&&_onChange()}function _planAll(a){if(!_options.readonly){var b=$(a);if(mainDiv.find(".ClickableBlocksPlannedBlockStart").length>0){"real"===_options.mode?(mainDiv.find("div.ClickableBlocksPlannedBlockBody").attr("data-real","1"),mainDiv.find("div.ClickableBlocksPlannedBlockBody").attr("data-excused","Y")):mainDiv.find("div.ClickableBlocksPlannedBlockBody").attr("data-planned","1"),mainDiv.find("div.ClickableBlocksPlannedBlockBody").each(function(a,b){var c=$(b),d=_getBlockFeatures(c.attr("data-planned"),c.attr("data-real"),c.attr("data-excused")),e=c.attr("data-"+d.color);c.find("div.ClickableBlocksStepContent").css("background",e),c.hasClass("ClickableBlocksPlannedBlockStart")&&c.find("div.ClickableBlocksStepContent").html('<i class="'+d.item+'">')}),b.addClass("click").one("animationend webkitAnimationEnd onAnimationEnd",function(){b.removeClass("click")});mainDiv.find("div.ClickableBlocksPlannedBlockBody").filter('[data-start="720"],[data-start="735"],[data-start="750"],[data-start="765"]').length>0&&_mealOn(),"function"==typeof _onChange&&_onChange()}}}function _unplanAll(a){if(!_options.readonly){var b=$(a),c="";if(mainDiv.find(".ClickableBlocksPlannedBlockStart").length>0){if("real"===_options.mode){var d=mainDiv.find("div.ClickableBlocksPlannedBlockBody[data-real=1]").length,e=mainDiv.find('div.ClickableBlocksPlannedBlockBody[data-excused="Y"][data-planned=1]').length;mainDiv.find("div.ClickableBlocksPlannedBlockBody").attr("data-real","0"),0===d&&(mainDiv.find("div.ClickableBlocksPlannedBlockBody[data-planned=1]").attr("data-excused","N"),c="N"),0===d&&0!==e||(mainDiv.find("div.ClickableBlocksPlannedBlockBody[data-planned=1]").attr("data-excused","Y"),c="Y")}else mainDiv.find("div.ClickableBlocksPlannedBlockBody").attr("data-planned","0");if(mainDiv.find("div.ClickableBlocksPlannedBlockBody").each(function(a,b){var c=$(b),d=_getBlockFeatures(c.attr("data-planned"),c.attr("data-real"),c.attr("data-excused")),e=c.attr("data-"+d.color);c.find("div.ClickableBlocksStepContent").css("background",e),c.hasClass("ClickableBlocksPlannedBlockStart")&&c.find("div.ClickableBlocksStepContent").html('<i class="'+d.item+'">')}),b.addClass("click").one("animationend webkitAnimationEnd onAnimationEnd",function(){b.removeClass("click")}),"real"===_options.mode){var f=!1;"Y"===c?1===_options.billexcused&&(f=!0):1===_options.billunexcused&&(f=!0),_mealOff(!1,f)}else _mealOff();"function"==typeof _onChange&&_onChange()}}}function _getStepssInRange(a,b){for(var c=[],d=Number(a/_options.step)-Number(_options.min/_options.step)+1,e=b/_options.step,f=0;f<e;f++){var g=Number(d)+f;c.push($("#step_"+elementID+"_"+g))}return c}var _stepLabelDispFormat=function(a){var b=Math.floor(Math.abs(a)/60);return Math.abs(a)%60==0?(b<10&&b>=0?"0":"")+b:""},_options={min:0,max:1440,step:30,stepLabelDispFormat:_stepLabelDispFormat,readonly:!1,toolbar:!0,mealbar:!0,basedonbar:!1,width:"auto",mode:"plan",addEmptyColumns:!1,preId:0,enfId:0,preDay:"",billexcused:0,billunexcused:0},parentDiv=$("#"+elementID+"_parent"),mainDiv,allSteps,_onChange=null,holdStarter=null,holdDelay=500,holdActive=!1;this.addBlocks=function(a){if("string"==typeof a&&(a=JSON.parse(a)),void 0!==a)return"object"==typeof a.blocks?(_setBasedOn(a.basedon),a.blocks.forEach(function(a){a.colplanned||("budg"===_options.mode?a.colplanned="#07A4EB":a.colplanned="#ff7c34"),a.colunplanned||(_options.mode,a.colunplanned="#ffd6b8"),a.colreal||(a.colreal="#7bce5b"),a.colunreal||(a.colunreal="#ffd4ba"),a.coladded||(a.coladded="#3c8a27"),a.coldeleted||(a.coldeleted="#ff3d25"),a.colexcused||(a.colexcused="#ac001a"),_addBlock(_getStepssInRange(a.start,a.value),a)}),_addMeal(a.meal,a.rmeal,a.fmeal),this):void 0},this.getBlocks=function(){var a={},b=[],c=$("div#steps_"+elementID+" .ClickableBlocksPlannedBlockStart");return c.length>0&&c.each(function(a,c){var d={};d.id=c.getAttribute("data-id"),d.start=c.getAttribute("data-start"),d.value=c.getAttribute("data-value"),d.planned=c.getAttribute("data-planned"),d.real=c.getAttribute("data-real"),d.excused=c.getAttribute("data-excused"),b.push(d)}),a.blocks=b,a.preId=_options.preId,a.enfId=_options.enfId,a.preDay=_options.preDay,a.meal=$("div#steps_"+elementID+" .ClickableBlocksMealSelector i.fa").attr("data-meal"),a.rmeal=$("div#steps_"+elementID+" .ClickableBlocksMealSelector i.fa").attr("data-rmeal"),a.fmeal=$("div#steps_"+elementID+" .ClickableBlocksMealSelector i.fa").attr("data-fmeal"),a.basedon=$("div#steps_"+elementID).attr("data-basedon"),JSON.stringify(a)},this.setChangeCallback=function(callbackFunction){if("string"==typeof callbackFunction){var fn;eval("fn = "+callbackFunction),callbackFunction=fn}return"function"==typeof callbackFunction&&(_onChange=callbackFunction),this},this.editAllOn=function(){_options.readonly=!1,_options.toolbar=!0,$("div#steps_"+elementID+" > .ClickableBlocksNoDisp").addClass("ClickableBlocksDisp").removeClass("ClickableBlocksNoDisp"),$("div#steps_"+elementID+".ClickableBlocksReadonly").addClass("ClickableBlocksEdit").removeClass("ClickableBlocksReadonly"),_setWidth()},this.editAllOff=function(){_options.readonly=!0,_options.toolbar=!1,$("div#steps_"+elementID+" > .ClickableBlocksDisp").addClass("ClickableBlocksNoDisp").removeClass("ClickableBlocksDisp"),$("div#steps_"+elementID+".ClickableBlocksEdit").addClass("ClickableBlocksReadonly").removeClass("ClickableBlocksEdit"),_setWidth()},this.setBasedOn=function(a,b){"PLAN"!==a&&"REAL"!==a&&"USER"!==a||("USER"!==a?_changeBasedOn(a):_changeBasedOn(a,b))},this.getOption=function(a){return _options[a]},_init()}}(window,jQuery),$(function(){Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){for(var c=b||0,d=this.length;c<d;c++)if(this[c]===a)return c;return-1}),"function"!=typeof Array.prototype.forEach&&(Array.prototype.forEach=function(a){for(var b=0;b<this.length;b++)a.apply(this,[this[b],b,this])})});