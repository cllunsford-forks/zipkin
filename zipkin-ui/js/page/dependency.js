import moment from 'moment';
import {component} from 'flightjs';
import $ from 'jquery';
import queryString from 'query-string';
import DependencyGraphUI from '../component_ui/dependencyGraph';
import ServiceDataModal from '../component_ui/serviceDataModal';
import TimeStampUI from '../component_ui/timeStamp';
import GoToDependencyUI from '../component_ui/goToDependency';
import {dependenciesTemplate} from '../templates';
import { fetchDependencies } from '../actions/dependencies';

const DependencyPageComponent = component(function DependencyPage() {
  this.buildServiceData = function(links) {
    let services = {};
    let dependencies = {};
    links.forEach(link => {
      const {parent, child} = link;

      dependencies[parent] = dependencies[parent] || {};
      dependencies[parent][child] = link;

      services[parent] = services[parent] || {serviceName: parent, uses: [], usedBy: []};
      services[child] = services[child] || {serviceName: child, uses: [], usedBy: []};

      services[parent].uses.push(child);
      services[child].usedBy.push(parent);
    });
    return {services, dependencies, links}
  };

  this.render = function() {
    const state = this.attr.store.getState();

    const { services, dependencies, links } = this.buildServiceData(state.dependencyLinks)

    this.$node.html(dependenciesTemplate());

    const {startTs, endTs} = queryString.parse(location.search);
    $('#endTs').val(endTs || moment().valueOf());
    // When #1185 is complete, the only visible granularity is day
    $('#startTs').val(startTs || moment().valueOf() - 86400000);

    DependencyGraphUI.teardownAll();
    ServiceDataModal.teardownAll();

    DependencyGraphUI.attachTo('#dependency-container', {links});
    ServiceDataModal.attachTo('#service-data-modal-container',{services, dependencies, links});
    TimeStampUI.attachTo('#end-ts');
    TimeStampUI.attachTo('#start-ts');
    GoToDependencyUI.attachTo('#dependency-query-form');
  }

  this.after('initialize', function() {
    window.document.title = 'Zipkin - Dependency';
    this.trigger(document, 'navigate', {route: 'dependency'});

    this.render();

    this.attr.store.subscribe(() => {
      this.render();
    });

    const endTs = document.getElementById('endTs').value || moment().valueOf();
    const startTs = document.getElementById('startTs').value;
    let lookback;
    if (startTs && endTs > startTs) {
      lookback = endTs - startTs;
    }
    this.attr.store.dispatch(fetchDependencies(endTs, lookback));
  });
});

export default function initializeDependencies(store, config) {
  DependencyPageComponent.attachTo('.content', {store, config});
}
