import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select/lib/Creatable';
import Field from './Field';

class AddForm extends React.Component {
  inputKeyRef = React.createRef()

  render() {
    const { onSubmit, onChange, className, options, values = {} } = this.props;
    return (
      <form onSubmit={onSubmit} className={className}>
        <label htmlFor="clone-key">Clone Key</label>
        <Select
          name="clone-key"
          id="clone-key"
          onChange={(option) => {
            const value = option.value.substring(0, option.value.lastIndexOf('.') + 1);
            onChange({
              target: {
                name: 'key',
                value
              }
            });
            this.inputKeyRef.current.focus();
          }}
          simpleValue
          options={options}
          
        />
        <Field
          inputRef={this.inputKeyRef}
          fieldStyle="mui"
          name="key"
          autoComplete="off"
          value={values.key}
          onChange={onChange}
          vertical
        />
        <Field
          fieldStyle="mui"
          name="value"
          autoComplete="off"
          value={values.value}
          onChange={onChange}
          vertical
        />
        <button type="submit" style={{display: 'none'}}>submit</button>
      </form>
    );
  }
}

AddForm.propTypes = {
  onSubmit: PropTypes.func,
  className: PropTypes.string
};
 
export default AddForm;