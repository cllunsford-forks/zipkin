import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import chosen from 'chosen-npm/public/chosen.jquery.js'; // eslint-disable-line no-unused-vars

class ServiceNameDropdown extends React.Component {
  static propTypes = {
    names: PropTypes.array.isRequired,
    lastServiceName: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    $(this.refs.select)
      .chosen({search_contains: true})
      .change(this.handleChange);
  }

  componentDidUpdate() {
    $(this.refs.select).trigger('chosen:updated');
  }

  componentWillUnmount() {
    $(this.refs.select).off('change');
  }

  handleChange(ev, params) {
    this.props.handleChange(params.selected);
  }

  render() {
    const {names, lastServiceName, handleChange} = this.props;
    const options = names.map((name) =>
      <option value={name} key={name}>{name}</option>
    );

    return (
      <select
        id="serviceName"
        name="serviceName"
        ref="select"
        value={lastServiceName}
        onChange={handleChange}
        data-placeholder="Service Name"
        style={{width: '234px'}}
        className="form-control input-sm"
      >
        {options}
      </select>
    );
  }
}

export default ServiceNameDropdown;
