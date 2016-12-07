/**
 * Created by mifsudm on 7/1/15.
 * 
 * 
 * @see 
 * 
 */


jQuery(function($) {


  /*
   * TODO generate some random date ranges for the example page.
   *  For now just change them to something useful
   */
  function generateDates() {
    var d = new Date();
    var pre = d.toISOString().substr(0, 8) ;
    return [
      [pre+'10', 'start'], [pre+'11', 'full'], [pre+'12', 'full'], [pre+'13', 'end'],
      [pre+'13', 'start'], [pre+'14', 'end'],
      [pre+'03', 'start'], [pre+'04', 'full'], [pre+'05', 'full'], [pre+'06', 'end'],
      [pre+'01', 'start'], [pre+'02', 'end'],
      [pre+'20', 'start'], [pre+'21', 'full'], [pre+'22', 'full'], [pre+'23', 'end'],
      [pre+'24', 'start'], [pre+'25', 'full'], [pre+'26', 'full'], [pre+'27', 'end']
    ]
  }




  // enable rangepicker on examples.
  $('.rangepicker-single').rangepicker({
    maxDate: "+2y",
    minDate: "0",
    dateFormat: 'mm/dd/yy',
    halfDays: false,
    unavailable: generateDates()
  });



  $.get('genDates.php', function (data) {
    //inst.options.unavailable = data;
    //inst.element.datepicker('refresh');
    $('.rangepicker-input').rangepicker({
      maxDate: "+2y",
      minDate: "0",
      dateFormat: 'mm/dd/yy',
      halfDays: true,
      unavailable: data
    });
  }, 'json');




  // enable rangepicker on examples.
  $('.rangepicker-dualInput').rangepicker({
    maxDate: "+2y",
    minDate: "0",
    dateFormat: 'mm/dd/yy',
    halfDays: true,
    unavailable: generateDates()
  });


  // enable rangepicker on examples.
  $('.rangepicker-dualInput2').rangepicker({
    maxDate: "+2y",
    minDate: "0",
    dateFormat: 'mm/dd/yy',
    halfDays: true,
    unavailable: generateDates()
  });

  $('#fid-from2, #fid-to2').datepicker({
    maxDate: "+2y",
    minDate: "0",
    dateFormat: 'mm/dd/yy',
    onSelect: function (dateText, inst) {
      //$('.rangepicker-dualInput2').rangepicker().setDates(
      //  $.datepicker.parseDate(this.options.dateFormat, $('#fid-from2').val() ),
      //  $.datepicker.parseDate(this.options.dateFormat, $('#fid-to2').val() )
      //);
    }
  });


});