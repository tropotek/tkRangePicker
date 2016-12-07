/**
 * Created by mifsudm on 6/30/15.
 *
 * jquery.rangepicker.js
 *
 * This script extends the jquery ui datepicker to select multiple dates
 *
 * Adapted from:
 *  @link http://bseth99.github.io/projects/jquery-ui/4-jquery-ui-datepicker-range.html
 *  @link http://www.benknowscode.com/2012/11/selecting-ranges-jquery-ui-datepicker.html
 *  @link http://wp-hostel.com/articles/jquery-datepicker-tweaks.php
 *
 * unavailable date array format: [['2015-06-30', 'start'], ['2015-07-01', 'full'], ['2015-07-02', 'end'], ['2015-07-03', 'start'], ['2015-07-04', 'end']]
 *
 *
 *
 *
 *
 */
jQuery(function ($) {

  $.widget('ui.rangepicker', {


    options: {
      minDate: '0',
      halfDays: false,            // if true then treat end and start as available unless both end and start dates are on the same day (use for accom booking checkin-checkout)
      unavailable: [],
      onGetUnavailable: null,

      onRangeSelect: function (fromText, toText, inst) {},
      onReset: function (inst) {},

      onSelectSuccess: function (d1, d2, inst) {
        if (inst.element.parent().find('input').length == 1) {
          if (d2 == '') {
            inst.element.parent().find('input').val(d1);
          } else {
            inst.element.parent().find('input').val(d1 + ' - ' + d2);
          }
        } else if (inst.element.parent().find('input').length >= 2) {
          inst.element.parent().find('input:nth-child(1)').val(d1);
          inst.element.parent().find('input:nth-child(2)').val(d2);
        }
      },

      onSelectError: function (d1, d2, inst) {
        //inst.element.parent().find('input').val('Selection Error');
        inst.element.parent().find('input').val('Unavailable')
        //alert('Selected Dates unavailable.');
      }
    },

    _init: function () {
      var self = this;
      var $el = this.element;
      self.cur = -1;
      self.prv = -1;

      // default events
      this.options.beforeShowDay = function (date) {
        var result = self.checkUnavailable(date, self.getUnavailable(self), self.options.halfDays); // here we pass the comparison to another function
        var cls = ( (date.getTime() >= Math.min(self.prv, self.cur) && date.getTime() <= Math.max(self.prv, self.cur)) ? 'date-range-selected' : '');
        result[1] = result[1] + ' ' + cls;
        return result; // don't check further the unavailable dates

      }

      this.options.onSelect = function (dateText, inst) {
        var d1, d2;
        self.prv = self.cur;
        self.cur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
        if (self.prv == self.cur) {
          self.reset();
            $el.parent().find('a.ui-state-active').removeClass('ui-state-active');
        } else if (self.prv == -1 || self.prv == self.cur) {
          self.prv = self.cur;
          if (self.options && self.options.onSelectSuccess) {
            self.options.onSelectSuccess(dateText, '', self);
            self.options.onRangeSelect(dateText, '', self);
          }
        } else {
          d1 = $.datepicker.formatDate($el.datepicker('option', 'dateFormat'), new Date(Math.min(self.prv, self.cur)), {});
          d2 = $.datepicker.formatDate($el.datepicker('option', 'dateFormat'), new Date(Math.max(self.prv, self.cur)), {});
          var available = self.checkRange(new Date(Math.min(self.prv, self.cur)), new Date(Math.max(self.prv, self.cur)), self.getUnavailable(self));
          if (available) {
            if (self.options && self.options.onSelectSuccess) {
              self.options.onSelectSuccess(d1, d2, self);
            }
          } else {
            if (self.options && self.options.onSelectError) {
              self.options.onSelectError(d1, d2, self);
            }
            inst.selectedYear, inst.selectedMonth, inst.selectedDay = 0;
            self.prv = self.cur = -1;

            $el.datepicker('refresh');
            $el.parent().find('a.ui-state-active').removeClass('ui-state-active');
          }
          self.options.onRangeSelect(d1, d2, self);
        }
        self.element.parent().find('a.ui-state-active').removeClass('ui-state-active');
      }

      $el.addClass('rangepicker');
      $el.datepicker(this.options);

      $el.on('focus', function (e) {
        var v = this.value, d;
        try {
          if (v.indexOf(' - ') > -1) {
            d = v.split(' - ');
            self.prv = $.datepicker.parseDate($el.datepicker('option', 'dateFormat'), d[0]).getTime();
            self.cur = $.datepicker.parseDate($el.datepicker('option', 'dateFormat'), d[1]).getTime();
          } else if (v.length > 0) {
            self.prv = self.cur = $.datepicker.parseDate($el.datepicker('option', 'dateFormat'), v).getTime();
          }
        } catch (e) {
          self.cur = self.prv = -1;
        }
        if (cur > -1)
          $el.datepicker('setDate', new Date(self.cur));
        $el.datepicker('refresh').show();
        $el.parent().find('a.ui-state-active').removeClass('ui-state-active');
      });

    },



    reset: function (inst) {
      var self = this;
      self.prv = -1;
      self.cur = -1;

      if (self.element.parent().find('input').length == 1) {
        self.element.parent().find('input').val('');
      } else if (inst != undefined && inst.element.parent().find('input').length >= 2) {
        self.element.parent().find('input:nth-child(1)').val('');
        self.element.parent().find('input:nth-child(2)').val('');
      }

      self.element.datepicker('refresh').show();
      self.element.parent().find('a.ui-state-active').removeClass('ui-state-active');

      if (self.options.onReset) {
        self.options.onReset(self);
      }
    },

    setDates: function (from, to) {
      this.options.prv = from.getTime();
      this.options.cur = to.getTime();
      this.prv = from.getTime();
      this.cur = to.getTime();
    },

    /**
     * @param inst
     * @returns {*|unavailable}
     */
    getUnavailable: function (inst) {
      if (inst.options.unavailable.length == 0) {
        if (inst.options && inst.options.onGetUnavailable) {
          inst.options.unavailable = inst.options.onGetUnavailable(inst);
        }
      }
      return inst.options.unavailable;
    },


    checkRange: function (dateFrom, dateTo, unavailableDates) {
      dateFrom = dateFrom.floor();
      dateTo = dateTo.floor();

      var start = false, end = false;
      for (var d = dateFrom.clone(); d <= dateTo; d.setDate(d.getDate() + 1)) {
        var chk = this.checkUnavailable(d, unavailableDates, this.options.halfDays);
        // Test for single overnighters
        if (this.options.halfDays) {
          if (chk[1] == 'start' && d.getTime() != dateTo.getTime()) start = true;
          if (chk[1] == 'end' && d.getTime() != dateFrom.getTime()) end = true;
        }
        if (!chk[0] || (start || end)) {
          return false;
        }
      }
      return true;
    },

    checkUnavailable: function (date, unavailableDates, halfDays) {

      var dteStr = this._dateToString(date);
      var found = [];

      for (var i = 0; i < unavailableDates.length; i++) {
        if (dteStr == unavailableDates[i][0]) {
          found[found.length] = unavailableDates[i];
        }
      }

      if (found.length) {
        if (!halfDays) {
          return [false, 'full', 'Unavailable']
        } else {
          if (found.length == 1) {
            if (found[0][1] == 'full') {
              return [false, found[0][1], 'Unavailable']
            } else {
              return [true, found[0][1], 'Available']
            }
          } else if (found.length > 1) {
            return [false, 'full', 'Unavailable']
          }
        }
      }

      return [true, 'available', 'Available'];
    },


    _dateToString: function (date) {
      var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();
      m = m + 1; // because months start from 0
      // add leading zeros
      m = m.toString();
      if (m.length < 2) m = '0' + m;
      d = d.toString();
      if (d.length < 2) d = '0' + d;
      return y + '-' + m + '-' + d;
    }
  });







  /**
   * Return a clone of this date
   *
   * @return Date
   */
  Date.prototype.clone = function () {
    var dt = new Date();
    dt.setTime(this.getTime());
    return dt;
  };

  /**
   * Return a clone date that has a zero value time.
   *
   * @return Date
   */
  Date.prototype.floor = function () {
    var dt = this.clone();
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    return dt;
  };

  /**
   * Return a clone date that has a time of noon
   *
   * @return Date
   */
  Date.prototype.ceil = function () {
    var dt = this.clone();
    dt.setHours(23);
    dt.setMinutes(59);
    dt.setSeconds(59);
    dt.setMilliseconds(99);
    return dt;
  };
});