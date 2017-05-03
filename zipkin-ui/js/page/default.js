import {component} from 'flightjs';
import $ from 'jquery';
import timeago from 'timeago'; // eslint-disable-line no-unused-vars
import queryString from 'query-string';
import DefaultData from '../component_data/default';
import ServiceNameUI from '../component_ui/serviceName';
import SpanNameUI from '../component_ui/spanName';
import InfoPanelUI from '../component_ui/infoPanel';
import InfoButtonUI from '../component_ui/infoButton';
import JsonPanelUI from '../component_ui/jsonPanel';
import TraceFiltersUI from '../component_ui/traceFilters';
import TracesUI from '../component_ui/traces';
import TimeStampUI from '../component_ui/timeStamp';
import BackToTop from '../component_ui/backToTop';
import {defaultTemplate} from '../templates';
import {getError} from '../component_ui/error';

import { fetchServices, selectService } from '../actions/services'

const DefaultPageComponent = component(function DefaultPage() {
  const sortOptions = [
    {value: 'service-percentage-desc', text: 'Service Percentage: Longest First'},
    {value: 'service-percentage-asc', text: 'Service Percentage: Shortest First'},
    {value: 'duration-desc', text: 'Longest First'},
    {value: 'duration-asc', text: 'Shortest First'},
    {value: 'timestamp-desc', text: 'Newest First'},
    {value: 'timestamp-asc', text: 'Oldest First'}
  ];

  const sortSelected = function getSelector(selectedSortValue) {
    return function selected() {
      if (this.value === selectedSortValue) {
        return 'selected';
      }
      return '';
    };
  };

  this.after('initialize', function() {
    window.document.title = 'Zipkin - Index';
    this.trigger(document, 'navigate', {route: 'index'});

    // Begin Redux Bridge
    this.attr.store.subscribe(() => {
      const state = this.attr.store.getState()

      if (state.error.hasOwnProperty('message')) {
        this.trigger('uiServerError', getError(state.error.message, state.error.error));
      }
    })

    this.attr.store.dispatch(fetchServices())
    // End Redux Bridge

    const query = queryString.parse(window.location.search);

    this.on(document, 'defaultPageModelView', function(ev, modelView) {
      const limit = query.limit || this.attr.config('queryLimit');
      const minDuration = query.minDuration;
      const endTs = query.endTs || new Date().getTime();
      const startTs = query.startTs || (endTs - this.attr.config('defaultLookback'));
      const serviceName = query.serviceName || '';
      const annotationQuery = query.annotationQuery || '';
      const sortOrder = query.sortOrder || 'duration-desc';
      const queryWasPerformed = serviceName && serviceName.length > 0;
      this.$node.html(defaultTemplate({
        limit,
        minDuration,
        startTs,
        endTs,
        serviceName,
        annotationQuery,
        queryWasPerformed,
        count: modelView.traces.length,
        sortOrderOptions: sortOptions,
        sortOrderSelected: sortSelected(sortOrder),
        apiURL: modelView.apiURL,
        ...modelView
      }));

      ServiceNameUI.attachTo('#serviceName', {store: this.attr.store});
      SpanNameUI.attachTo('#spanName', {store: this.attr.store});
      InfoPanelUI.attachTo('#infoPanel');
      InfoButtonUI.attachTo('button.info-request');
      JsonPanelUI.attachTo('#jsonPanel');
      TraceFiltersUI.attachTo('#trace-filters');
      TracesUI.attachTo('#traces');
      TimeStampUI.attachTo('#end-ts');
      TimeStampUI.attachTo('#start-ts');
      BackToTop.attachTo('#backToTop');

      $('.timeago').timeago();

      this.$node.find('#rawResultsJsonLink').click(e => {
        e.preventDefault();
        this.trigger('uiRequestJsonPanel', {title: 'Search Results',
                                            obj: modelView.rawResponse,
                                            link: modelView.apiURL});
      });
    });

    DefaultData.attachTo(document);
  });
});

export default function initializeDefault(store, config) {
  DefaultPageComponent.attachTo('.content', {store, config});
}
