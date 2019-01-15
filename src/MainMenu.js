import React from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const MainMenu = (props) => {
  const { entries = [], classes } = props;
  return ( 
    <div className={classes.root}>
      <ul className={classes.list}>
        {entries.map((page) => {
          const keyParts = page.key.replace('.json', '').split('-');
          return (
            <li key={page.key}>
              <NavLink to={`/pages/${page.key}`} className={classes.listItem}>
                <span className={classes.localeSlug}>{keyParts[0]}</span>
                <span className={classes.appSlug}>{keyParts[1]}</span>
                {keyParts[2] && <span className={classes.pageSlug}>{keyParts[2]}</span>}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

const styles = ({ spacing }) => {
  const spacing2 = spacing.unit * 2;
  const spacing3 = spacing.unit * 3;
  const bgColor = '#436D9B';
  const textColor = '#B6DEFA';
  const activeColor = '#15A5FA';
  const activeBgColor = '#2B4059';
  return {
    root: {
      backgroundColor: bgColor,
      color: textColor,
    },
    list: {
      listStyle: 'none',
      paddingLeft: 0,
    },
    listItem: {
      color: textColor,
      display: 'block',
      padding: `${spacing2}px ${spacing3}px`,
      borderLeft: '5px solid transparent',
      textDecoration: 'none',
      '&.active': {
        borderLeftColor: activeColor,
        backgroundColor: activeBgColor,
      }
    },
    localeSlug: {
      backgroundColor: textColor,
      padding: 4,
      // borderRadius: 4,
      fontSize: '0.75rem',
      color: bgColor,
    },
    appSlug: {
      backgroundColor: activeColor,
      padding: 4,
      // borderRadius: 4,
      fontSize: '0.75rem',
      marginRight: spacing.unit,
    },
    pageSlug: {
      textTransform: 'uppercase'
    }
  };
};
 
export default withStyles(styles)(MainMenu);