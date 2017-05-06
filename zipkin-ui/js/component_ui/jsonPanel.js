import {component} from 'flightjs';

export default component(function jsonPanel() {
  this.show = function() {
    const props = this.attr;
    this.$node.find('.modal-title').text(props.title);

    this.$node.find('.save').attr('href', props.link);
    this.$node.find('.modal-body pre').text(JSON.stringify(props.obj, null, 2));
    this.$node.modal('show');
  };

  this.after('initialize', function() {
    this.$node.modal('hide');
    this.on(document, 'uiRequestJsonPanel', this.show);
  });
});
