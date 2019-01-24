import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import PreviewIcon from '@material-ui/icons/RemoveRedEye';
import { toast } from 'react-toastify';
import Version from './components/Version';
import PreviewDialog from './components/PreviewDialog';
import FloatingTopbar from './components/FloatingTopbar';
import TextLabel from './components/TextLabel';
import NotFound from './components/NotFound';
import Api from './Api';
import AddForm from './AddForm';
import { KeyboardUtil } from './utils'; 

const DialogType = {
  ADD: 'add',
  PREVIEW: 'preview'
};

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
    this.fetchData(this.getFileName(this.props));
    window.addEventListener('keyup', this.handleKeyEvent);
  }

  componentDidUpdate(prevProps) {
    const pageId = this.getFileName(this.props);
    const prevPageId = this.getFileName(prevProps);
    if (pageId !== prevPageId) {
      this.fetchData(pageId);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyEvent);
  }

  getFileName = (props) => {
    const { locale, appId, pageSlug } = props.match.params;
    return `${locale}-${appId}-${pageSlug}.json`;
  }

  fetchData = async (fileId) => {
    this.setState({
      isLoading: true,
      error: null,
      addForm: {}
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

  handleKeyEvent = (e) => {
    const shouldBail = KeyboardUtil.shouldBail(e.target);
    if (!shouldBail && e.key === 'a') {
      this.handleOpenAddDialog();
    }
  };

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
    this.handleOpenDialog(DialogType.ADD);
  }

  handleOpenPreviewDialog = () => {
    this.handleOpenDialog(DialogType.PREVIEW);
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
    const { value = '' } = e.target;
    this.setState({
      query: value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { etag, data } = this.state;
    try {
      const pageId = this.getFileName(this.props);
      await Api.save(pageId, data, etag);
      toast.success('Saved', {
        autoClose: 1000
      });
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
    const { data, etag, addForm, isLoading, query, namespaces = [], dialog = {}, error } = this.state;
    if (error) {
      if (error.code === 404) {
        return <NotFound>404</NotFound>
      }
      return <pre>{JSON.stringify(error, null, 2)}</pre>
    }
    const isJson = typeof data === 'object';
    const filtered = Object.entries(data).filter(([key = '', value = '']) =>
      key.includes(query) || value.toLowerCase().includes(query)
    );
    const numKeys = filtered.length;
    return (
      <div>
        <div className={classes.contentWrapper}>
          <FloatingTopbar className={classes.topbar} onSearch={this.handleSearchSubmit} onChange={this.handleSearchChange} value={query} onAdd={this.handleOpenAddDialog}>
            {namespaces.length > 0 && (
              <React.Fragment>
                <TextLabel className={classes.label}>Quick filter:</TextLabel>
                {namespaces.map((ns) => <button key={ns} value={ns} onClick={this.handleSearchChange}>{ns}</button>)}
                <div className={classes.numKeys}>{numKeys} <TextLabel tagName="span">keys</TextLabel></div>
              </React.Fragment>
            )}
          </FloatingTopbar>
          <div className={classes.main}>
            <form onSubmit={this.handleSubmit} className={classes.form} id="master-form">
              {isJson && filtered.map(([key, value]) => {
                return (
                  <div className={classes.entry} key={key}>
                    <TextField
                      variant="filled"
                      label={key}
                      key={key}
                      name={key}
                      value={value}
                      className={classes.entryInput}
                      onChange={this.handleChange}
                      disabled={isLoading}
                    />
                    <IconButton value={key} type="button" onClick={this.handleDeleteKey}><DeleteIcon /></IconButton>
                  </div>
                )
              })}
            </form>
          </div>
          <footer className={classes.footer}>
            <div>
              <Tooltip title="Preview">
                <IconButton onClick={this.handleOpenPreviewDialog}><PreviewIcon /></IconButton>
              </Tooltip>
            </div>
            <Version version={etag} className={classes.version} />
            <Button type="submit" disabled={isLoading} variant="contained" color="primary" form="master-form">save</Button>
          </footer>
        </div>
        <PreviewDialog
          open={dialog.isOpen && dialog.name === DialogType.PREVIEW}
          onClose={this.handleCloseDialog}
          data={data}
        />
        <Dialog
          open={dialog.isOpen && dialog.name === DialogType.ADD}
          onClose={this.handleCloseDialog}
          scroll="body"
          className={classes.hasDropdown}
          classes={{
            paperScrollBody: classes.hasDropdown
          }}
        >
          <DialogTitle>Add Text</DialogTitle>
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
  header: {
    flex: 'none',
    padding: spacing.unit * 2,
    backgroundColor: palette.grey[100],
    borderBottom: `1px solid ${palette.grey[300]}`,
  },
  topbar: {
    flex: 'none',
    margin: spacing.unit * 2,
    marginBottom: 0,
    zIndex: 1,
  },
  numKeys: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginLeft: 4,
    }
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  label: {
    marginRight: 4,
    display: 'inline-flex'
  },
  main: {
    flexGrow: 1,
    overflowY: 'auto'
  },
  form: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: spacing.unit * 2,
    paddingRight: spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 650
  },
  footer: {
    backgroundColor: '#fff',
    borderTop: `1px solid ${palette.grey[300]}`,
    padding: spacing.unit * 2,
    flex: 'none',
    display: 'grid',
    gridTemplateColumns: '1fr repeat(2, min-content)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gridGap: `${spacing.unit * 2}px`,
  },
  version: {
    gridColumn: '2/3',
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing.unit * 2
  },
  entryInput: {
    display: 'flex',
    flex: 1
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