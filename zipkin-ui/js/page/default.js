import {component} from 'flightjs';
import $ from 'jquery';
import Cookies from 'js-cookie';
import timeago from 'timeago'; // eslint-disable-line no-unused-vars
import queryString from 'query-string';
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
import {getError, errToStr} from '../component_ui/error';
import {traceSummary, traceSummariesToMustache} from '../component_ui/traceSummary';

import { fetchServices, selectService } from '../actions/services'
import { fetchSpansByService } from '../actions/spans'
import { fetchTraces } from '../actions/traces'

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

  this.render = function(query) {
  }

  this.after('initialize', function() {
    window.document.title = 'Zipkin - Index';
    this.trigger(document, 'navigate', {route: 'index'});

    // Formerly convertToApiQuery
    let query = queryString.parse(window.location.search);
    if (query.startTs) {
      if (query.endTs > query.startTs) {
        query.lookback = String(query.endTs - query.startTs);
      }
      delete query.startTs;
    }

    const limit = query.limit || this.attr.config('queryLimit');
    const minDuration = query.minDuration;
    const endTs = query.endTs || new Date().getTime();
    const startTs = query.startTs || (endTs - this.attr.config('defaultLookback'));
    const serviceName = query.serviceName || Cookies.get('last-serviceName');
    const annotationQuery = query.annotationQuery || '';
    const sortOrder = query.sortOrder || 'duration-desc';
    const queryWasPerformed = serviceName && serviceName.length > 0;
    const apiURL = `/api/v1/traces?${queryString.stringify(query)}`;

    this.attr.store.subscribe(() => {
      const state = this.attr.store.getState()
      const traces = state.traces

      let modelView = {
        traces: traceSummariesToMustache(serviceName, traces.map(traceSummary)),
        apiURL,
        rawResponse: traces,
      };
      const serviceSpans = state.spansByService[state.selectedService] || []

      if (state.error.hasOwnProperty('message')) {
        modelView.queryError = errToStr(state.error)
      }

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
        apiURL: apiURL,
        ...modelView
      }));

      // teardown components which send/receive triggers to prevent
      //  duplicate triggers for each re-render loop
      ServiceNameUI.teardownAll();
      SpanNameUI.teardownAll();
      InfoPanelUI.teardownAll();
      JsonPanelUI.teardownAll();

      ServiceNameUI.attachTo('#serviceName', {
        store: this.attr.store,
        names: state.serviceNames,
        lastServiceName: state.selectedService
      });
      SpanNameUI.attachTo('#spanName', {serviceSpans});
      InfoPanelUI.attachTo('#infoPanel');
      InfoButtonUI.attachTo('button.info-request');
      JsonPanelUI.attachTo('#jsonPanel', {
        title: 'Search Results',
        obj: modelView.rawResponse,
        link: modelView.apiURL
      });

      TraceFiltersUI.attachTo('#trace-filters');
      TracesUI.attachTo('#traces');
      TimeStampUI.attachTo('#end-ts');
      TimeStampUI.attachTo('#start-ts');
      BackToTop.attachTo('#backToTop');

      $('.timeago').timeago();

      this.$node.find('#rawResultsJsonLink').click(e => {
        e.preventDefault();
        this.trigger('uiRequestJsonPanel', {});
      });
    })

    // Select current service on initial page load
    this.attr.store.dispatch(selectService(serviceName))
    this.attr.store.dispatch(fetchSpansByService(serviceName));
    this.attr.store.dispatch(fetchServices())
    if (query.serviceName) {
      this.attr.store.dispatch(fetchTraces(query))
    }
  });
});

export default function initializeDefault(store, config) {
  DefaultPageComponent.attachTo('.content', {store, config});
}
