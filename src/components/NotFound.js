import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const NotFound = ({ children }) => {
  return (
    <Card style={{ margin: 48, alignSelf: 'center' }}>
      <CardContent>
        <Typography variant="h4">{children}</Typography>
      </CardContent>
    </Card>
  );
}

export default NotFound;
