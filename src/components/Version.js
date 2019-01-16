import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const Version = (props) => {
  const { version = '', className, classes } = props;
  return (
    <dl className={classNames(className, classes.root)}>
      <dt className={classes.label}>Version</dt>
      <dd className={classes.version}>
        <span>{version.replace(/"/g, '')}</span>
      </dd>
    </dl>
  );
}

const styles = ({ palette }) => ({
  root: {
    marginBottom: 0,
    marginTop: 0,
    color: palette.text.hint,
    width: 150,
    direction: 'rtl',
    '&:hover': {
      width: 'auto',
    }
  },
  label: {
    fontSize: 10,
    color: palette.text.primary,
    textTransform: 'uppercase'
  },
  version: {
    marginLeft: 0,
    marginRight: 0,
    overflow: 'hidden',
    transition: 'width 200ms ease-out',
    textOverflow: 'ellipsis',
  }
});

export default withStyles(styles)(Version);
