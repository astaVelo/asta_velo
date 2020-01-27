/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { EventNote, HistoryTwoTone, Edit, Settings } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="terminplan"
          title="&Uuml;bersicht aller Abhol- und R&uuml;ckgabetermine"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/Schedule"
          >
            <EventNote className={classes.icons} />
            Terminplan
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="verlauf"
          title="Verlauf aller vergangenen und bestehenden Vertr&auml;ge"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            component={Link}
            to="/History"
            className={classes.navLink}
          >
            <HistoryTwoTone className={classes.icons} />
            Verlauf
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="aenderungen"
          title="Ver&auml;nderung bestehender Informationen"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            component={Link}
            to="/Bikesandprices"
            className={classes.navLink}
          >
            <Edit className={classes.icons} />
            Fahrr&auml;der & Preise
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="settings"
          title="Einstellungen"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            component={Link}
            to="/settings"
            className={classes.navLink}
          >
            <Settings className={classes.icons} />
          </Button>
        </Tooltip>
      </ListItem>
    </List>
  );
}
