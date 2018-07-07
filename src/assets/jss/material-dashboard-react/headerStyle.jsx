// ##############################
// // // Header styles
// #############################

import {
  container,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor
} from "assets/jss/material-dashboard-react.jsx";

const headerStyle = theme => ({
  appBar: {
    backgroundColor: "transparent",
    position:"absolute",
    boxShadow: "none",
    paddingBottom:"10%",
    borderBottom: "0",
    marginBottom: "0",
    width: "100%",
    zIndex: "1",
    color: "#555555",
    border: "0",
    borderRadius: "3px",
    transition: "all 150ms ease 0s",
    minHeight: "50px",
    display: "block"
  },
  container: {
    ...container,
    minHeight: "50px",
  },
  flex: {
    flex: 1
  },
  h2:{
    margin:"1% 0px 0px 0px"
  },
  title: {
    ...defaultFont,
    lineHeight: "10px",
    paddingLeft:15,
    fontSize: "25px",
    borderRadius: "3px",
    textTransform: "none",
    zIndex:100,
    color: "white",
    "&:hover,&:focus": {
      background: "transparent"
    }
  },
  appResponsive: {
    top: "8px"
  },
  primary: {
    backgroundColor: primaryColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  info: {
    backgroundColor: infoColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  success: {
    backgroundColor: successColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  warning: {
    backgroundColor: warningColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  danger: {
    backgroundColor: dangerColor,
    color: "#FFFFFF",
    ...defaultBoxShadow
  },
  background: {
    flex: 1,
    position: "absolute",
    zIndex: "1",
    height: "12vh",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    "&:after": {
      position: "absolute",
      top:0,
      zIndex: "-1",
      width: "100%",
      height: "100%",
      content: '""',
      display: "block",
      background: "#000",
      opacity: ".8"
    }
  },
  links:{
    float:"right",
    marginLeft:"auto",
    paddingTop:"1%",
  },
  link:{
    ...defaultFont,
    color:"#FFFFFF"
  }
});

export default headerStyle;
