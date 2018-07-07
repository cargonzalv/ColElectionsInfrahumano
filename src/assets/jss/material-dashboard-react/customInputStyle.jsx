// ##############################
// // // CustomInput styles
// #############################

import {
  primaryColor,
  dangerColor,
  successColor,
  defaultFont
} from "assets/jss/material-dashboard-react.jsx";

const customInputStyle = {
  disabled: {
    "&:before": {
      backgroundColor: "transparent !important"
    }
  },
  underline: {
    "&:hover:not($disabled):before,&:before": {
      backgroundColor: "#D2D2D2",
      height: "1px !important"
    },
    "&:after": {
      backgroundColor: "#0000ff"
    }
  },
  underlineError: {
    "&:after": {
      backgroundColor: dangerColor
    }
  },
  underlineSuccess: {
    "&:after": {
      backgroundColor: successColor
    }
  },
  labelRoot: {
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.42857",
    color:"#FFFFFF"
  },
  labelRootError: {
    color: dangerColor
  },
  labelRootSuccess: {
    color: successColor
  },
  feedback: {
    position: "absolute",
    top: "18px",
    right: "0",
    zIndex: "2",
    display: "block",
    width: "24px",
    height: "24px",
    textAlign: "center",
    pointerEvents: "none"
  },
  marginTop: {
    marginTop: "16px",
    color:"#FFFFFF"
  },
  formControl: {
    paddingBottom: "10px",
    margin: "27px 20px 0 0",
    position: "relative",
    color:"#FFFFFF"
  }
};

export default customInputStyle;
