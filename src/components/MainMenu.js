import React from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

const GroupName = {
  PAGES: 'pages',
  IMAGES: 'images',
  UI_SETTINGS: 'ui-settings'
};

const LocalePageLink = ({ page, classes }) => {
  const [locale, appId, pageSlug] = page.key.replace('.json', '').split('-');
  return (
    <NavLink to={`/pages/${locale}/${appId}/${pageSlug}`} className={classes.listItem}>
      <span className={classes.localeSlug}>{locale}</span>
      <span className={classes.appSlug}>{appId}</span>
      {pageSlug && <span className={classes.pageSlug}>{pageSlug}</span>}
    </NavLink>
  )
}

const ImagePageLink = ({ page, classes }) => {
  return (
    <NavLink to={`/images/${page.key}`} className={classes.listItem}>
      {page.key}
    </NavLink>
  )
}

const UISettingsPageLink = ({page, classes }) => {
  const [folder, appId, pageSlug] = page.key.replace('.json', '').split('/');
  return (
    <NavLink to={`/${folder}/${appId}/${pageSlug}`} className={classes.listItem}>
      <span className={classes.appSlug}>{appId}</span>
      {pageSlug && <span className={classes.pageSlug}>{pageSlug}</span>}
    </NavLink>
  )
}

const DefaultPageLink = ({ page, classes }) => (
  <NavLink to={`/${page.key}`} className={classes.listItem}>
    {page.key}
  </NavLink>
)

const MainMenu = (props) => {
  const { entries = {}, classes, onAdd } = props;
  return ( 
    <div className={classes.root}>
      <div className={classes.nav}>
        <React.Fragment>
          {Object.entries(entries).map(([groupName, groupEntries]) => (
            <ul className={classes.list} key={groupName}>
              <li className={classes.listHeader}>{groupName}</li>
              {groupEntries.map((page) => {
                return (
                  <li key={page.key}>
                    {groupName === GroupName.PAGES && <LocalePageLink classes={classes} page={page} />}
                    {groupName === GroupName.IMAGES && <ImagePageLink classes={classes} page={page} />}
                    {groupName === GroupName.UI_SETTINGS && <UISettingsPageLink classes={classes} page={page} />}
                    {groupName !== GroupName.UI_SETTINGS && groupName !== GroupName.IMAGES && groupName !== GroupName.PAGES && <DefaultPageLink classes={classes} page={page} />}
                  </li>
                )
              })}
            </ul>
          ))}
        </React.Fragment> 
      </div>
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
    nav: {
      flexGrow: 1
    },
    listHeader: {
      textTransform: 'uppercase',
      padding: 8,
      fontWeight: 'bold'
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
    },
    footer: {
      padding: spacing2
    }
  };
};
 
export default withStyles(styles)(MainMenu);