import React from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const MainMenu = (props) => {
  const { entries = [], classes } = props;
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
    },
    list: {
      listStyle: 'none',
      paddingLeft: 0,
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
    }
  };
};
 
export default withStyles(styles)(MainMenu);