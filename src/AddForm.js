import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';

const AddForm = (props) => {
  const { onSubmit, onChange } = props;
  return (
    <form onSubmit={onSubmit}>
      <Field
        name="key"
        autoFocus
        autoComplete="off"
        onChange={onChange}
      />
      <Field
        name="value"
        autoComplete="off"
        onChange={onChange}
      />
      <button type="submit" style={{display: 'none'}}>submit</button>
    </form>
  );
}

AddForm.propTypes = {
  onSubmit: PropTypes.func,
}
 
export default AddForm;