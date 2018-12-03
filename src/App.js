import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import './App.css';
import Api from './Api';
import Debug from './Debug';
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

class App extends Component {
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
    const { etag, data } = await Api.getFile();
    const sorted = sortedByKey(data);
    this.setState({
      data: sorted,
      namespaces: getNamespaces(sorted),
      etag,
      isLoading: false,
    });
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
      await Api.save(data, etag);
      this.fetchData();
    } catch (err) {
      this.setState({
        data: 'Error',
        etag: ''
      })
    }
  }

  render() {
    const { data, etag, addForm, isLoading, query, namespaces, dialog } = this.state;
    const isJson = typeof data === 'object';
    return (
      <div className="App">
        <div className="layout-pane">
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
              <button onClick={this.handleOpenAddDialog}>Add</button>
            </div>
          </header>
          <div className="layout-main">
            <p>Current version: {etag}</p>
            <form onSubmit={this.handleSubmit} className="Form">
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
                    className="Field--bootstrap"
                    onChange={this.handleChange}
                    onDelete={this.handleDeleteKey}
                    disabled={isLoading}
                  />
                )
              })}
              <button type="submit" disabled={isLoading}>save</button>
            </form>
          </div>
        </div>
        <div className="debug-pane">
          <Debug data={data} />
          <Debug data={addForm} />
        </div>
        <Dialog
          open={dialog.isOpen && dialog.name === 'add'}
          onClose={this.handleCloseDialog}
        >
          <DialogContent>
            <AddForm onSubmit={this.handleSubmitKey} onChange={this.handleAddFormChange} />
          </DialogContent>
          <DialogActions>
            <button onClick={this.handleCancelAddForm}>Cancel</button>
            <button onClick={this.handleSubmitKey}>Add</button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
