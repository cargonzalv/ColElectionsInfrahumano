import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui";

import { Header} from "components";

import dashboardRoutes from "routes/dashboard.jsx";

import appStyle from "assets/jss/material-dashboard-react/appStyle.jsx";
import DashboardPage from "views/Dashboard/Dashboard.jsx";

import image from "assets/img/sidebar-2.jpg";



class App extends React.Component {
  state = {
    mobileOpen: false,
    mainPanel:null
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  componentDidMount() {

  }
  componentDidUpdate() {
    this.refs.mainPanel.scrollTop = 0;
    this.state.ps.update()
  }
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>

        <div className={classes.mainPanel} ref="mainPanel">
          <Header
            image={image}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
            <div className={classes.content}>
              <div className={classes.container}><DashboardPage/></div>
            </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(App);
