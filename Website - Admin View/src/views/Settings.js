import React from "react";
import classNames from "classnames";
import { useState, useEffect } from "react";
// @material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import SaveIcon from "@material-ui/icons/Save";
import EmailIcon from "@material-ui/icons/FileCopyOutlined";
// Header
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// Others
import styles from "assets/jss/material-kit-react/views/components.js";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
// Own components
import { CallTypes, api } from "../utils/api.js";

/*
  Settings

  This component provides a form to change email and password
  and show all emails which can be added to the newsletter.
*/

const useStyles = makeStyles(styles);

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export default function BikesAndPrices(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [initialCall, setInitialCall] = React.useState(true);
  const [emails, setEmails] = React.useState("");
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [oldEmail, setOldEmail] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const { height, width } = useWindowDimensions();
  let ratio = width / height;
  let className;
  if (ratio > 1.1) {
    className = classNames(classes.main, classes.mainRaised);
  } else {
    className = classNames(classes.main, classes.mainRaisedMobile);
  }

  const handleSave = () => {
    api(CallTypes.LOGIN.UPDATE, () => {}, {
      oldEmail: oldEmail,
      oldPassword: oldPassword,
      newEmail: newEmail,
      newPassword: newPassword
    });
  };

  const callApi = () => {
    api(CallTypes.NEWSLETTER.RETURN, res => {
      if (res.status === 200) {
        let text = "";
        for (let i = 0; i < res.message.length; i++) {
          text += res.message[i].email;
          if (i + 1 < res.message.length) text += ", ";
        }
        setEmails(text);
      }
    });
  };
  if (initialCall) {
    setInitialCall(false);
    callApi();
  }

  const handleDelete = () => {
    api(CallTypes.NEWSLETTER.DELETE, res => {
      if (res.status === 200) setEmails("");
    });
  };

  return (
    <div>
      <div>
        <Header
          brand="Admin Interface"
          rightLinks={<HeaderLinks />}
          color="dark"
          fixed
          {...rest}
        />
      </div>
      <Box>
        <div className={className}>
          <Box>&ensp;</Box>
          <Box width="100%" marginLeft={1.5} marginTop={-1} marginBottom={2}>
            <Typography>Passwort oder Email ändern:</Typography>
            <Box marginTop={2}>
              <form>
                <TextField
                  label="Alte Email"
                  defaultValue={oldEmail}
                  onChange={event => {
                    setOldEmail(event.target.value);
                  }}
                  variant="outlined"
                  autoComplete="current-email"
                />
                &ensp;
                <FormControl variant="outlined">
                  <InputLabel>Altes Passwort</InputLabel>
                  <OutlinedInput
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={event => {
                      setOldPassword(event.target.value);
                    }}
                    autoComplete="current-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowOldPassword(!showOldPassword);
                          }}
                          onMouseDown={event => {
                            event.preventDefault();
                          }}
                          edge="end"
                        >
                          {showOldPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={110}
                  />
                </FormControl>
              </form>
            </Box>
            <Box marginTop={1}>
              <form>
                <TextField
                  label="Neue Email"
                  defaultValue={newEmail}
                  onChange={event => {
                    setNewEmail(event.target.value);
                  }}
                  variant="outlined"
                  autoComplete="new-email"
                />
                &ensp;
                <FormControl variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Neues Passwort
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={event => {
                      setNewPassword(event.target.value);
                    }}
                    autoComplete="new-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowNewPassword(!showNewPassword);
                          }}
                          onMouseDown={event => {
                            event.preventDefault();
                          }}
                          edge="end"
                        >
                          {showNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={120}
                  />
                </FormControl>
              </form>
              <Box marginTop={2}>
                <Fab variant="extended" onClick={handleSave} color="primary">
                  <SaveIcon />
                  &ensp;Speichern
                </Fab>
              </Box>
            </Box>
            <Box marginTop={3}>
              <Typography>Email-Liste für Newsletter:</Typography>
              <Box marginTop={2} width={264}>
                <div>
                  <TextField
                    fullWidth
                    label="Emails"
                    multiline
                    rows="5"
                    value={emails}
                    variant="outlined"
                  />
                </div>
              </Box>
              <Box marginTop={1.5}>
                <Tooltip title="Emails kopieren">
                  <Fab
                    variant="extended"
                    color="default"
                    onClick={() => {
                      navigator.clipboard.writeText(emails);
                    }}
                  >
                    <EmailIcon />
                    &ensp; Emails kopieren
                  </Fab>
                </Tooltip>
                &ensp;&ensp;
                <Tooltip title="Emails leeren">
                  <Fab color="secondary" onClick={handleDelete}>
                    <ClearIcon />
                  </Fab>
                </Tooltip>
              </Box>
              <div>&ensp;</div>
            </Box>
          </Box>
        </div>
      </Box>
    </div>
  );
}
