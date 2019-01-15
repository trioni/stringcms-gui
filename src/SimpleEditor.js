import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import _get from 'lodash/get';
import './App.css';
import Api from './Api';
import Field from './Field';
import AddForm from './AddForm';

function sortedByKey(data) {
  // Get keys containing period . and return the first part of it
  const sorted = {};
  Object.keys(data).sort().forEach((key) => {
    sorted[key] = data[key];
  });
  return sorted;
}

function getNamespaces(data) {
  const namespaces = Object.keys(data).reduce((acc, key) => {
    const [namespace] = key.split('.');

    if (!acc[namespace]) {
      acc[namespace] = '';
    }
    return acc;
  }, {});
  return Object.keys(namespaces);
}

class SimpleEditor extends React.Component {
  state = {
    isLoading: false,
    namespaces: [],
    data: {},
    query: '',
    dialog: {
      isOpen: false
    }
  };

  componentDidMount() {
    this.fetchData(this.getPageId(this.props));
  }

  componentDidUpdate(prevProps) {
    const pageId = this.getPageId(this.props);
    const prevPageId = this.getPageId(prevProps);
    if (pageId !== prevPageId) {
      this.fetchData(pageId);
    }
  }

  getPageId = (props) => {
    return _get(props, 'match.params.id');
  }

  fetchData = async (fileId) => {
    this.setState({
      isLoading: true,
      error: null,
    });

    try {
      const { etag, data } = await Api.getFile(fileId);
      const sorted = sortedByKey(data);
      this.setState({
        data: sorted,
        namespaces: getNamespaces(sorted),
        etag,
        isLoading: false,
      }); 
    } catch (err) {
      this.setState({
        error: err
      });
    }
  }

  handleOpenDialog = (name, data) => {
    this.setState({
      dialog: {
        name,
        isOpen: true,
        data
      }
    });
  }

  handleCloseDialog = () => {
    this.setState({
      dialog: {
        name: '',
        isOpen: false,
      }
    })
  }

  handleOpenAddDialog = () => {
    this.handleOpenDialog('add');
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      data: {
        ...prevState.data,
        [name]: value
      }
    }))
  }

  handleAddFormChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      addForm: {
        ...prevState.addForm,
        [name]: value
      }
    }))
  }

  handleCancelAddForm = () => {
    this.setState({
      addForm: {},
      dialog: {
        isOpen: false,
        name: ''
      }
    })
  }

  handleSubmitKey = (e) => {
    e.preventDefault();
    const { addForm } = this.state;
    if (addForm.key === '' && addForm.value === '') return;
    this.setState((prevState) => ({
      dialog: {
        isOpen: false,
        name: ''
      },
      isDirty: true,
      data: sortedByKey({
        ...prevState.data,
        [prevState.addForm.key]: prevState.addForm.value
      }),
      addForm: {}
    }), () => {
      this.handleSubmit(e);
    });
  }

  handleDeleteKey = (e) => {
    e.preventDefault();
    const { value } = e.currentTarget;
    console.log('[Value to delete]', value);
    this.setState(({ data }) => {
      delete data[value];
      return {
        data: {
          ...data
        }
      }
    }, () => {
      this.handleSubmit(e);
    })
  }

  handleSearchSubmit = (e) => {
    e.preventDefault();
  }

  handleSearchChange = (e) => {
    const { value } = e.target;
    this.setState({
      query: value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { etag, data } = this.state;
    try {
      const pageId = this.getPageId(this.props);
      await Api.save(pageId, data, etag);
      this.fetchData(pageId);
    } catch (err) {
      this.setState({
        data: 'Error',
        etag: ''
      })
    }
  }

  render() {
    const { classes } = this.props;
    const { data, etag, addForm, isLoading, query, namespaces, dialog = {}, error } = this.state;
    if (error) {
      return <pre>{JSON.stringify(error, null, 2)}</pre>
    }
    const isJson = typeof data === 'object';
    return (
      <div>
        <div className={classes.contentWrapper}>
          <AppBar position="static">
            <header className="Header layout-topbar">
              <div className="row">
                <div className="column flex">
                  <form onSubmit={this.handleSearchSubmit}>
                    <input className="Search" autoComplete="off" name="key-search" id="key-search" value={query} onChange={this.handleSearchChange} />
                    <button type="submit" style={{ display: 'none'}}>Search</button>
                  </form>
                  <div className="row">
                    {namespaces.map((ns) => <button key={ns} value={ns} onClick={this.handleSearchChange}>{ns}</button>)}
                    <button value="" className="rowAction" onClick={this.handleSearchChange}>Clear</button>
                  </div>
                </div>
                <Button onClick={this.handleOpenAddDialog} variant="fab" color="primary"><AddIcon /></Button>
              </div>
            </header>
          </AppBar>
          <div className={classes.main}>
            <p>Current version: {etag}</p>
            <form onSubmit={this.handleSubmit} className="Form" id="master-form">
              {isJson && Object.keys(data).map((key) => {
                const value = data[key];
                if (typeof value === 'object') {
                  return (
                    <div>
                      <h2>{key}</h2>
                      <div>
                        {Object.keys(value).map((subkey) => (
                          <Field
                            fieldStyle="mui"
                            key={subkey}
                            name={subkey}
                            onChange={this.handleChange}
                            onDelete={this.handleDeleteKey}
                            value={value[subkey]}
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                    </div>
                  )
                }
                if (!key.includes(query) && !value.includes(query)) return null;
                return (
                  <Field
                    fieldStyle="mui"
                    key={key}
                    name={key}
                    value={value}
                    className={`Field--bootstrap ${classes.row}`}
                    onChange={this.handleChange}
                    onDelete={this.handleDeleteKey}
                    disabled={isLoading}
                  />
                )
              })}
            </form>
          </div>
          <footer className={classes.footer}>
            <Button type="submit" disabled={isLoading} variant="contained" color="primary" form="master-form">save</Button>
          </footer>
        </div>
        <Dialog
          open={dialog.isOpen && dialog.name === 'add'}
          onClose={this.handleCloseDialog}
          scroll="body"
          className={classes.hasDropdown}
          classes={{
            paperScrollBody: classes.hasDropdown
          }}
        >
          <DialogContent className={classes.hasDropdown}>
            <AddForm onSubmit={this.handleSubmitKey} onChange={this.handleAddFormChange} className={classes.addForm} options={Object.keys(data).map((key) => ({ value: key, label: key}))} values={addForm} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancelAddForm}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" onClick={this.handleSubmitKey}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const styles = ({ palette, spacing }) => ({
  root: {
    
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  main: {
    flexGrow: 1,
    overflowY: 'auto'
  },
  footer: {
    borderTop: `1px solid ${palette.grey[400]}`,
    padding: spacing.unit * 2,
    flex: 'none'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr minmax(200px, 400px) 50px',
  },
  hasDropdown: {
    overflowY: 'visible'
  },
  dialogBody: {
    overflowY: 'visible'
  },
  addForm: {
    minWidth: 500,
  }
});

export default withStyles(styles)(SimpleEditor);