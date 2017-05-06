import {component} from 'flightjs';
import Cookies from 'js-cookie';
import $ from 'jquery';
import chosen from 'chosen-npm/public/chosen.jquery.js'; // eslint-disable-line no-unused-vars

import {selectService} from '../actions/services';
import {fetchSpansIfNeeded} from '../actions/spans';

export default component(function serviceName() {
  this.onChange = function() {
    const name = this.$node.val();
    Cookies.set('last-serviceName', name);
    this.attr.store.dispatch(selectService(name));
    this.attr.store.dispatch(fetchSpansIfNeeded(name));
  };

  this.updateServiceNameDropdown = function(ev, data) {
    this.render(data.names, data.lastServiceName);

    this.trigger('chosen:updated');
  };

  this.render = function(names, lastServiceName) {
    $('#serviceName').empty();
    $.each(names, (i, item) => {
      $('<option>').val(item).text(item).appendTo('#serviceName');
    });

    this.$node.find(`[value="${lastServiceName}"]`).attr('selected', 'selected');
  };

  this.after('initialize', function() {
    this.render(this.attr.names, this.attr.lastServiceName);

    this.$node.chosen({search_contains: true});
    this.on('change', this.onChange);
  });
});
