import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Route } from 'react-router-dom';
import SimpleEditor from './SimpleEditor';
import MainMenu from './MainMenu';
import Api from './Api';


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
        <Route path="/pages/:locale/:appId/:pageSlug" component={SimpleEditor} />
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
