import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const sharedTextFieldProps = {
  fullWidth: true,
  autoComplete: 'off',
  variant: 'outlined',
  InputLabelProps: {
    shrink: true,
    style: {
      zIndex: 0,
    },
  },
};
class AddForm extends React.Component {
  inputKeyRef = React.createRef()

  render() {
    const { onSubmit, onChange, className, options, values = {} } = this.props;
    return (
      <form onSubmit={onSubmit} className={className}>
        <Typography color="textSecondary" style={{ marginBottom: 16 }}>Pick an existing key to clone from or add a brand new one</Typography>
        <Select
          name="clone-key"
          id="clone-key"
          placeholder="Select key to clone from"
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
        <Grid container spacing={16} style={{ marginTop: 24 }}>
          <Grid item xs={6}>
            <TextField
              inputRef={this.inputKeyRef}
              name="key"
              label="Key"
              value={values.key || ''}
              onChange={onChange}
              autoFocus
              {...sharedTextFieldProps}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="value"
              label="Value"
              value={values.value || ''}
              onChange={onChange}
              {...sharedTextFieldProps}
            />
          </Grid>
        </Grid>
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