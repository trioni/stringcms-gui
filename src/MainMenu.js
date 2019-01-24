import React from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

const MainMenu = (props) => {
  const { entries = [], classes, onAdd } = props;
  return ( 
    <div className={classes.root}>
      <ul className={classes.list}>
        {entries.map((page) => {
          const [locale, appId, pageSlug] = page.key.replace('.json', '').split('-');
          return (
            <li key={page.key}>
              <NavLink to={`/pages/${locale}/${appId}/${pageSlug}`} className={classes.listItem}>
                <span className={classes.localeSlug}>{locale}</span>
                <span className={classes.appSlug}>{appId}</span>
                {pageSlug && <span className={classes.pageSlug}>{pageSlug}</span>}
              </NavLink>
            </li>
          )
        })}
      </ul>
      <div className={classes.footer}>
        <Tooltip title="Shortcut: p">
          <Button fullWidth onClick={onAdd} variant="contained" color="primary">
            <AddIcon /> Add page
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

const styles = ({ spacing, custom }) => {
  const spacing2 = spacing.unit * 2;
  const spacing3 = spacing.unit * 3;

  const { bgColor, textColor, activeColor, activeBgColorRgba } = custom.dark;
  return {
    root: {
      minWidth: 250,
      backgroundColor: bgColor,
      color: textColor,
      display: 'flex',
      flexDirection: 'column'
    },
    list: {
      listStyle: 'none',
      paddingLeft: 0,
      flexGrow: 1
    },
    listItem: {
      color: textColor,
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing2}px ${spacing3}px`,
      borderLeft: '5px solid transparent',
      textDecoration: 'none',
      '&.active': {
        borderLeftColor: activeColor,
        backgroundColor: activeBgColorRgba,
      }
    },
    localeSlug: {
      backgroundColor: textColor,
      padding: 4,
      fontSize: '0.75rem',
      color: bgColor,
    },
    appSlug: {
      backgroundColor: activeColor,
      padding: 4,
      fontSize: '0.75rem',
      marginRight: spacing.unit,
    },
    pageSlug: {
      textTransform: 'uppercase'
    },
    footer: {
      padding: spacing2
    }
  };
};
 
export default withStyles(styles)(MainMenu);