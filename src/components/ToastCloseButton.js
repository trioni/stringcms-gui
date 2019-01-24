import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const ToastCloseButton = (props) => {
  const { closeToast } = props;
  return (
    <IconButton onClick={closeToast} style={{ alignSelf: 'flex-start'}}>
      <CloseIcon style={{ color: '#fff' }} />
    </IconButton>
  );
};

ToastCloseButton.propTypes = {
  closeToast: PropTypes.func,
};

export default ToastCloseButton;
