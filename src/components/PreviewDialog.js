import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Debug from './Debug';

function SlideUpTransition(props) {
  return <Slide direction="up" {...props} />;
}

const PreviewDialog = (props) => {
  const { data, classes, ...rest } = props;
  return (
    <Dialog
      {...rest}
      fullScreen
      TransitionComponent={SlideUpTransition}
      classes={{
        paper: classes.root,
      }}
    >
      <DialogContent>
        <Debug data={data} className={classes.debug} />
      </DialogContent>
    </Dialog>
  );
}

const styles = ({ custom, spacing }) => ({
  root: {
    backgroundColor: custom.dark.bgColor,
  },
  debug: {
    border: `1px dashed ${custom.dark.textColor}`,
    padding: spacing.unit * 2,
    color: '#fff'
  }
});
 
export default withStyles(styles)(PreviewDialog);


