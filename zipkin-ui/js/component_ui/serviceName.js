import {component} from 'flightjs';
import Cookies from 'js-cookie';
import $ from 'jquery';
import chosen from 'chosen-npm/public/chosen.jquery.js'; // eslint-disable-line no-unused-vars
import queryString from 'query-string';

import { selectService } from '../actions/services'
import { fetchSpansByService } from '../actions/spans'

export default component(function serviceName() {
  this.onChange = function() {
    Cookies.set('last-serviceName', this.$node.val());
    this.triggerChange(this.$node.val());
  };

  this.triggerChange = function(name) {
    this.attr.store.dispatch(selectService(name));
    this.attr.store.dispatch(fetchSpansByService(name));
  };

  this.updateServiceNameDropdown = function(ev, data) {
    $('#serviceName').empty();
    $.each(data.names, (i, item) => {
      $('<option>').val(item).text(item).appendTo('#serviceName');
    });

    this.$node.find(`[value="${data.lastServiceName}"]`).attr('selected', 'selected');

    this.trigger('chosen:updated');
  };

  this.after('initialize', function() {
    const name = queryString.parse(window.location.search).serviceName
        || Cookies.get('last-serviceName');
    this.triggerChange(name);

    this.$node.chosen({search_contains: true});
    this.on('change', this.onChange);
    this.attr.store.subscribe(() => {
      const state = this.attr.store.getState()

      this.updateServiceNameDropdown({}, {names: state.serviceNames, lastServiceName: state.selectedService});
    })
  });
});
