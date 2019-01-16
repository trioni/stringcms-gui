import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const TextLabel = (props) => {
  const { classes, className, tagName = 'div', children } = props;
  const TagName = tagName;
  return (
    <TagName className={classNames(className, classes.root)}>{children}</TagName>
  );
}

const styles = ({ palette }) => ({
  root: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: palette.text.hint,
  }
});
 
export default withStyles(styles)(TextLabel);