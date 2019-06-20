import React from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Shared components
import Paper from '../Paper';

// Component styles
const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '6px',
    boxShadow: '1px 1px 15px 2px #9c9c9c29',
    padding: '10px 10px 15px 10px'
  }
});

const Portlet = props => {
  const { classes, className, children, ...rest } = props;

  const rootClassName = classNames(classes.root, className);

  return (
    <Paper
      {...rest}
      className={rootClassName}
      elevation={0}
      outlined
      squared={false}
    >
      {children}
    </Paper>
  );
};

Portlet.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Portlet);
