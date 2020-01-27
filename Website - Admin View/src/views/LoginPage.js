import React from "react";
import { Redirect } from "react-router";
// @material-ui components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import Icon from "@material-ui/core/Icon";
// material kit components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Badge from "components/Badge/Badge.js";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
// own components
import { CallTypes, api } from "../utils/api.js";
import { setIndexLogin } from "../index";

/*
  Login Page

  This is the default page and it handles the login.
*/

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  let cardAnimaton = "";
  const classes = useStyles();
  const { ...rest } = props;

  const [password, setPassword] = React.useState("");
  const handlePasswordInput = event => {
    setPassword(event.target.value);
  };
  const [email, setEmail] = React.useState("");
  const handleEmailInput = event => {
    setEmail(event.target.value);
  };
  const [login, setLogin] = React.useState(false);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const doLogin = res => {
    if (res.status === 200) {
      setIndexLogin(true);
      setLogin(true);
    } else if (res.status === 404) {
      setLoginFailed(true);
      setErrorMessage("Falsche Kombination von Email und Passwort.");
    } else {
      setLoginFailed(true);
      setErrorMessage("Login Error: " + res.status + " " + res.message);
    }
  };
  const handleLogin = () => {
    api(CallTypes.LOGIN.LOGIN, doLogin, email, password);
  };
  const LoginError = () => {
    if (loginFailed) {
      return (
        <CardFooter className={classes.cardFooter}>
          <Badge color="danger">{errorMessage}</Badge>
        </CardFooter>
      );
    } else {
      return;
    }
  };

  if (!login) {
    return (
      <div>
        <Header brand="Admin Interface" color="dark" fixed {...rest} />
        <div className={classes.pageHeader}>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Admin Authentifizierung</h4>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                        labelText="Email"
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "email",
                          autoComplete: "current-email",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                          onChange: handleEmailInput,
                          onKeyDown: e => {
                            if (e.key === "Enter") handleLogin();
                          }
                        }}
                      />
                      <CustomInput
                        labelText="Passwort"
                        id="pass"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password",
                          autoComplete: "current-password",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          onChange: handlePasswordInput,
                          onKeyDown: e => {
                            if (e.key === "Enter") handleLogin();
                          }
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={handleLogin}
                      >
                        Login
                      </Button>
                    </CardFooter>
                    {LoginError()}
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to="/schedule" />;
  }
}
