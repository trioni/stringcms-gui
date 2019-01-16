import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

const styles = ({ palette }) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'stretch'
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    marginLeft: 8,
    flex: 1,
    '& *': {
      height: '100%'
    }
  },
  inputRoot: {
    width: '100%',
  },
  input: {
    padding: 0,
  },
  icon: {
    color: palette.text.hint,
    margin: '4px 8px',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
    alignSelf: 'center'
  },
  quickFilter: {
    padding: '4px 8px',
    backgroundColor: palette.grey[200],
    borderTop: `1px solid ${palette.grey[300]}`,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    display: 'flex',
    alignItems: 'center'
  }
});

function CustomizedInputBase(props) {
  const { classes, className, onSearch, onChange, onAdd, value = '', children } = props;

  return (
    <Paper className={classNames(className, classes.root2)} elevation={1}>
      <div className={classes.root}>
        <label htmlFor="search" className={classes.cell}>
          <SearchIcon className={classes.icon} />
        </label>
        <form onSubmit={onSearch} className={classes.form}>
          <InputBase id="search" classes={{ root: classes.inputRoot, input: classes.input }} placeholder="Search key or value" value={value} onChange={onChange} />
          <button type="submit" style={{ display: 'none'}}>Search</button>
        </form>
        {value.length > 0 && (
          <IconButton className={classes.iconButton} value={""} aria-label="Clear" onClick={onChange}>
            <ClearIcon />
          </IconButton>
        )}
        <Divider className={classes.divider} />
        <IconButton color="primary" className={classes.iconButton} aria-label="Add" onClick={onAdd} title="Shortcut: a">
          <AddIcon />
        </IconButton>
      </div>
      {children && (
        <div className={classes.quickFilter}>
          {children}
        </div>
      )}
    </Paper>
  );
}

CustomizedInputBase.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withStyles(styles)(CustomizedInputBase);