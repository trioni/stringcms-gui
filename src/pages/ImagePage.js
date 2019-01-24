import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import config from '../config';

class ImagePage extends React.Component {
  render() {
    const { match, classes } = this.props;
    if (!match.params.filename) {
      return <p>Missing filname</p>
    }
    return (
      <div className={classes.root}>
        <Card>
          <img src={`${config.storageHost}/${match.params.filename}`} alt="" style={{ maxWidth: '100%' }} />
          <CardContent>
            <Typography>Images is just for testing. Not used by any applciation at this point</Typography>
          </CardContent>
        </Card>
      </div>
    )
  }
}

const styles = ({ spacing }) => ({
  root: {
    padding: spacing.unit * 2,
  }
});

export default withStyles(styles)(ImagePage);
