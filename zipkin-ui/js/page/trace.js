import {component} from 'flightjs';
import $ from 'jquery';
import FilterAllServicesUI from '../component_ui/filterAllServices';
import FullPageSpinnerUI from '../component_ui/fullPageSpinner';
import JsonPanelUI from '../component_ui/jsonPanel';
import ServiceFilterSearchUI from '../component_ui/serviceFilterSearch';
import SpanPanelUI from '../component_ui/spanPanel';
import TraceUI from '../component_ui/trace';
import FilterLabelUI from '../component_ui/filterLabel';
import ZoomOut from '../component_ui/zoomOutSpans';
import {traceTemplate} from '../templates';
import traceToMustache from '../../js/component_ui/traceToMustache';
import { fetchTrace } from '../actions/traces'

const TracePageComponent = component(function TracePage() {
  this.after('initialize', function() {
    window.document.title = 'Zipkin - Traces';

    let logsUrl = this.attr.config('logsUrl')
    if (logsUrl) {
      logsUrl = logsUrl.replace('{traceId}', this.attr.traceId);
    }

    this.attr.store.subscribe(() => {
      const state = this.attr.store.getState()
      const trace = state.trace
      if (!trace.hasOwnProperty('traceId')) {
        return
      }
      // traceToMustache expects []trace with one element
      const modelview = traceToMustache([trace], logsUrl);

      this.$node.html(traceTemplate(modelview));

      FilterAllServicesUI.attachTo('#filterAllServices', {
        totalServices: $('.trace-details.services span').length
      });
      FullPageSpinnerUI.attachTo('#fullPageSpinner');
      JsonPanelUI.attachTo('#jsonPanel');
      ServiceFilterSearchUI.attachTo('#serviceFilterSearch');
      SpanPanelUI.attachTo('#spanPanel');
      TraceUI.attachTo('#trace-container');
      FilterLabelUI.attachTo('.service-filter-label');
      ZoomOut.attachTo('#zoomOutSpans');

      this.$node.find('#traceJsonLink').click(e => {
        e.preventDefault();
        this.trigger('uiRequestJsonPanel', {title: `Trace ${this.attr.traceId}`,
                                            obj: [trace],
                                            link: `/api/v1/trace/${this.attr.traceId}`});
      });

      $('.annotation:not(.core)').tooltip({placement: 'left'});
    });

    this.attr.store.dispatch(fetchTrace(this.attr.traceId))
  });
});

export default function initializeTrace(store, traceId, config) {
  TracePageComponent.attachTo('.content', {
    store,
    traceId,
    config
  });
}
