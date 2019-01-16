import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Route, Switch } from 'react-router-dom';
import SimpleEditor from './SimpleEditor';
import MainMenu from './MainMenu';
import Api from './Api';

const NotFound = (props) => {
  return (
    <Card style={{ margin: 48, alignSelf: 'center' }}>
      <CardContent>
        <Typography variant="h1">Select a page from the menu</Typography>
      </CardContent>
    </Card>
  );
}
 
class App extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      main: PropTypes.string
    })
  }
  state = {
    data: {},
    addForm: {},
    isLoading: false,
    query: '',
    namespaces: [],
    dialog: {
      name: '',
      isOpen: false,
      data: null
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({
      isLoading: true,
    });
    const pages = await Api.listKeys();
    this.setState({
      pages,
      isLoading: false,
    });
  }


  render() {
    const { classes } = this.props;
    const { isLoading, pages = [] } = this.state;
    return (
      <div className={classes.app}>
        <MainMenu entries={pages} />
        <Switch>
          <Route path="/pages/:locale/:appId/:pageSlug" component={SimpleEditor} />
          <NotFound />
        </Switch>
      </div>
    );
  }
}

const styles = () => ({
  app: {
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr',
    height: '100vh',
    overflow: 'hidden'
  }
});

export default withStyles(styles)(App);
