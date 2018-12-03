import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const Field = (props) => {
  const { name, onDelete, fieldStyle = 'bare', className, classes, ...rest } = props;
  if (fieldStyle === 'mui') {
    return (
      <FormControl className={classNames(className, classes.root)}>
        <InputLabel shrink htmlFor={name} className={classes.bootstrapFormLabel}>
          {name}
        </InputLabel>
        <InputBase
          id={name}
          name={name}
          classes={{
            root: classes.bootstrapRoot,
            input: classes.bootstrapInput,
          }}
          {...rest}
        />
        {onDelete && (
          <IconButton value={name} type="button" onClick={onDelete}><DeleteIcon /></IconButton>
        )}
    </FormControl>
    )
  }
  return (
    <div className="Field">
      <label htmlFor={name}>{name}</label>
      <input name={name} id={name} {...rest} />
      {onDelete && (
        <button value={name} type="button" onClick={onDelete}>Delete</button>
      )}
    </div>
  );
};

Field.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  disabled: PropTypes.bool,
  fieldStyle: PropTypes.oneOf(['bare', 'mui']),
  classes: PropTypes.shape({
    bootstrapRoot: PropTypes.string,
    bootstrapInput: PropTypes.string,
    bootstrapFormLabel: PropTypes.string
  })
};

const styles = ({ palette, spacing, transitions }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  bootstrapRoot: {
    flex: 1
  },
  bootstrapInput: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    transition: transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    position: 'static'
    // fontSize: 14,
  },
});

export default withStyles(styles)(Field);