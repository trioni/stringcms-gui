import React, { Component } from 'react';
import './App.css';
import Api from './Api';
import Debug from './Debug';

function sortedByKey(data) {
  // Get keys containing period . and return the first part of it
  const sorted = {};
  Object.keys(data).sort().forEach((key) => {
    sorted[key] = data[key];
  });
  return sorted;
}

class App extends Component {
  state = {
    data: {},
    addForm: {
      add: ''
    },
    isLoading: false,
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({
      isLoading: true,
    });
    const { etag, data } = await Api.getFile();
    this.setState({
      data: sortedByKey(data),
      etag,
      isLoading: false,
    });
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

  handleSubmitKey = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      data: sortedByKey({
        ...prevState.data,
        [prevState.addForm.add]: ''
      }),
      addForm: {
        add: ''
      }
    }));
  }

  handleDeleteKey = (e) => {
    e.preventDefault();
    const { value } = e.target;
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
    const { data, etag, addForm, isLoading } = this.state;
    const isJson = typeof data === 'object';
    return (
      <div className="App">
        <div className="layout-pane">
          <header className="Header layout-topbar">
            Current version: {etag}
          </header>
          <div className="layout-main">
            <form onSubmit={this.handleSubmit} className="Form">
              {isJson && Object.keys(data).map((key) => {
                const value = data[key];
                return (
                  <div key={key} className="Field">
                    <label htmlFor={key}>{key}</label>
                    <input name={key} id={key} value={value} onChange={this.handleChange} disabled={isLoading} />
                    <button value={key} type="button" onClick={this.handleDeleteKey}>Delete</button>
                  </div>
                )
              })}
              <button type="submit" disabled={isLoading}>save</button>
            </form>
            <div>
              <form onSubmit={this.handleSubmitKey} className="Form">
                <h2>Add Key</h2>
                <div className="Field">
                  <label htmlFor={'add'}>Key</label>
                  <input name="add" id="add" value={addForm.add} onChange={this.handleAddFormChange} />
                </div>
                <button type="submit" style={{display: 'none'}}>Add Key</button>
              </form>
            </div>
          </div>
        </div>
        <div className="debug-pane">
          <Debug data={data} />
        </div>
      </div>
    );
  }
}

export default App;
