import React from "react";
import {
  withStyles,
} from "material-ui";


import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";

class HeaderLinks extends React.Component {
  state = {
    open: false
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className = {classes.searchDiv}>
        
        
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
