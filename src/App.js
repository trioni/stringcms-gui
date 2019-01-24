import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Route, Switch } from 'react-router-dom';
import { toast } from 'react-toastify';
import _groupBy from 'lodash/groupBy';
import { ErrorToast } from './components/toasts';
import NotFound from './components/NotFound';
import { KeyboardUtil } from './utils'; 
import ImagePage from './pages/ImagePage';
import SimpleEditor from './SimpleEditor';
import MainMenu from './MainMenu';
import Api from './Api';

const DialogType = {
  ADD_PAGE: 'addPage'
};

/**
 * Validate that a filename follows the pattern:
 * locale-appid-pageid like en-backoffice-mypage
 * @param {string} filename
 */
function validateFilename(filename) {
  const filenameRegex = /^[a-z]{2}-[a-z]{2,}-[a-z]{2,}$/;
  return filenameRegex.test(filename);
}

function isLocalePage(key) {
  const filenameRegex = /^[a-z]{2}-[a-z]{2,}-[a-z]{2,}.json$/;
  return filenameRegex.test(key);
}

function groupByType(entries) {
  return _groupBy(entries, (entry) => {
    if (entry.type === 'application/json' && isLocalePage(entry.key)) {
      return 'pages';
    }
    if (entry.type.includes('image/')) {
      return 'images';
    }
    return 'misc';
  })
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
    pendingFilename: '',
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
    this.fetchMenu();
    this.registerKeyboardShortcuts();
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyboardShortcut);
  }

  registerKeyboardShortcuts = () => {
    window.addEventListener('keyup', this.handleKeyboardShortcut);
  }

  fetchMenu = async () => {
    this.setState({
      isLoading: true,
    });
    const groupedEntries = await Api.listKeys().then(groupByType);
    this.setState({
      groupedEntries,
      isLoading: false,
    });
  }
  
  handleKeyboardShortcut = (e) => {
    const shouldBail = KeyboardUtil.shouldBail(e.target);
    if (!shouldBail && e.key === 'p') {
      this.handleAddPageIntent();
    }
  };

  handleAddPageIntent = () => {
    this.setState({
      dialog: {
        name: DialogType.ADD_PAGE,
        isOpen: true,
      }
    })
  }

  handleCloseDialog = () => {
    this.setState({
      dialog: { isOpen: false }
    })
  }

  handleFileFormChange = ({ target }) => {
    this.setState({
      pendingFilename: target.value
    })
  }

  handleSubmitPage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const { pendingFilename } = this.state;
    const isValid = validateFilename(pendingFilename);
    if (!isValid) {
      toast.error(<ErrorToast>Incorrect filename</ErrorToast>);
      return;
    }

    try {
      await Api.createJsonFile(pendingFilename);
      toast.success(`Page "${pendingFilename}" added`);
      this.fetchMenu();
      this.setState({
        pendingFilename: '',
        dialog: { isOpen: false }
      })
    } catch (err) {
      toast.error(<ErrorToast>{err.message}</ErrorToast>, {
        autoClose: false
      });
    }
  }


  render() {
    const { classes } = this.props;
    const { isLoading, groupedEntries = {}, dialog, pendingFilename } = this.state;
    return (
      <div className={classes.app}>
        <MainMenu entries={groupedEntries} onAdd={this.handleAddPageIntent} />
        <Switch>
          <Route path="/pages/:locale/:appId/:pageSlug" component={SimpleEditor} />
          <Route path="/images/:filename" component={ImagePage} />
          <NotFound>Select a page from the menu</NotFound>
        </Switch>
        <Dialog open={dialog.isOpen && dialog.name === DialogType.ADD_PAGE} onClose={this.handleCloseDialog} classes={{ paper: classes.dialog}}>
          <DialogTitle>Add Page</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmitPage}>
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={pendingFilename}
                name="filename"
                label="Name"
                style={{ marginTop: 8 }}
                fullWidth
                autoFocus
                onChange={this.handleFileFormChange}
                helperText="Should follow the format 'language-appname-pagename': 'en-backoffice-customers'"
              />
              <button type="submit" style={{ display: 'none'}}>Submit</button>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog}>Cancel</Button>
            <Button onClick={this.handleSubmitPage} variant="contained" color="primary">Submit</Button>
          </DialogActions>
        </Dialog>
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
  },
  dialog: {
    minWidth: 500,
  }
});

export default withStyles(styles)(App);
