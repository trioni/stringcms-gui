import React from 'react';
import Typography from '@material-ui/core/Typography';

export const ErrorToast = ({ title, body, children }) => (
  <>
    {title && <Typography variant="h5" color="inherit">{title}</Typography>}
    {body && <Typography variant="body2" color="inherit">{body}</Typography>}
    {children && <Typography variant="body2" color="inherit">{children}</Typography>}
  </>
)

export default {};