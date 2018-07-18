  import React from "react";
import PropTypes from "prop-types";
import { Menu } from "@material-ui/icons";
import {
  withStyles,
  AppBar,
  Toolbar,
  IconButton,
  Hidden
} from "material-ui";
import { NavLink } from "react-router-dom";

import cx from "classnames";
import HeaderLinks from "./HeaderLinks";

import headerStyle from "assets/jss/material-dashboard-react/headerStyle.jsx";


function Header({ ...props }) {
  
  const { classes, color, image } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color
  });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div style={{ backgroundImage: "url(" + image + ")" }} className={classes.background}>
          {/* Here we create navbar brand, based on route name */}
          <div className={classes.row}>
            <h2 className={classes.h2}>
            <NavLink className={classes.title}
                to="/dashboard"
            >
              &nbsp; ColElections 
            </NavLink>
            </h2>
        </div>
      </div>
        <div className={classes.links} implementation="css">
          <HeaderLinks />
        </div>
      </Toolbar>
          
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(headerStyle)(Header);
