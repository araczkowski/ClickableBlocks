function setApexCollectionClob(pBigValue) {
  var apexAjaxObj = new apex.ajax.clob(
    function() {
      var rs = p.readyState;
      if (rs == 4) {
        // ok we have data in clob and we can save it in DB
        apex.event.trigger(document, 'doSaveAllInDB')
      } else {
        //nok somthing went wrong
        apex.event.trigger(document, 'displayNotification', 'Error during the save into collection!');
      };
    }
  );

  apexAjaxObj._set(pBigValue);
}

function doEditAll() {
  var intro = introJs();
  intro.setOptions({
    steps: [{
      element: document.querySelector('.editScheduleRegion'),
      intro: 'Cliquez “Esc” pour annuler vous changements.',
      position: 'left'
    }],
    showBullets: false,
    showStepNumbers: false,
    exitOnOverlayClick: false
  });
  intro.start();
  
  $('div.popUpEdit').hide();
  $('div.customPagination').hide();
  $('a.introjs-skipbutton').text("Sauvegarder");
  $('div.introjs-tooltipbuttons').detach().insertBefore($('div.introjs-tooltiptext'));

  var id;
  $('div.ClickableBlocksSteps').each(function(index) {
    id = $(this).attr("data-clickB");
    eval(id + '.editAllOn();');
  });

  intro.onexit(function() {
    location.reload();
  });

  intro.oncomplete(function() {
    var id;
    var all_data = [];
    var b_data = {};
    $('div.ClickableBlocksSteps').each(function(index) {
      id = $(this).attr("data-clickB");
      eval(id + '.editAllOff();');
      b_data = new Function('return ' + id + '.getBlocks();')();
      all_data.push(b_data);
    });

    setApexCollectionClob(JSON.stringify(all_data));

    $('div.popUpEdit').show();
    $('div.customPagination').show();
    apex.widget.waitPopup();



  });
}


 
