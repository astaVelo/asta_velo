import React from "react";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import EmailIcon from "@material-ui/icons/MailOutline";
import IconButton from "@material-ui/core/IconButton";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import SVG from "react-inlinesvg";
import PickUpIcon from "../../icons/PickUp.svg";
import ReturnIcon from "../../icons/BringBack.svg";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import { yellow } from "@material-ui/core/colors";
import { CallTypes, api } from "../../utils/api.js";

/*
  AppointmentAffirmation

  This component displays an Appointment which can be confirmed.

  Used by: ScheduleAffirmationView and HistoryAffirmationView
*/

AppointmentAffirmation.propTypes = {
  event: PropTypes.object,
  updateParent: PropTypes.func,
  isHistoryComponent: PropTypes.bool,
  isPast: PropTypes.bool
};
export default function AppointmentAffirmation(props) {
  const [done, setDone] = React.useState(false);
  const ev = props.event;
  const History = props.isHistoryComponent;
  const Past = props.isPast;
  const Accepted = ev.confirmed;

  const [show, setShow] = React.useState(0);
  const [string, setString] = React.useState("");
  const [undo, setUndo] = React.useState(false);

  if (done) return <Box></Box>;

  const handleDecline = () => {
    if (undo) setUndo(false);
    setString("Abgelehnt.");
    setShow(1);
    setTimeout(hide, 1800);
  };
  const handleAccept = () => {
    if (undo) setUndo(false);
    setString(unescape("Best%E4tigt."));
    setShow(1);
    setTimeout(hide, 1800);
  };
  const handleUndo = () => {
    setUndo(true);
    setString("Undo");
    setShow(0);
  };
  function hide() {
    if (!undo) setShow(5);
  }
  let srcIcon = "";
  if (ev.type === "return") srcIcon = ReturnIcon;
  else srcIcon = PickUpIcon;
  let show0 = (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      fontWeight="fontWeightLight"
      borderTop={1}
      borderColor="grey.100"
    >
      &ensp;&ensp;{new Date(ev.date_time).toLocaleDateString()} &ensp;
      <Box marginTop={-0.5}>
        <Tooltip title={ev.type === "return" ? "Rückgabe" : "Abholung"}>
          <SVG src={srcIcon} width={28} height={28} />
        </Tooltip>
      </Box>
      &ensp;
      {/* {data.number_of_bikes} &thinsp; <BikeIcon /> 
      &ensp;  */}
      <Box color={History ? (Accepted ? "green" : "red") : ""}>
        {ev.first_name}
        &ensp;
        {ev.last_name}
      </Box>
      <Box marginTop={-1.5} display="flex" flexDirection="row">
        {History && (Past || Accepted) ? (
          <Box></Box>
        ) : (
          <Tooltip title="Akzeptieren">
            <IconButton
              color="primary"
              aria-label="Accept"
              onClick={handleAccept}
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
        )}
        {History && (Past || !Accepted) ? (
          <Box></Box>
        ) : (
          <Tooltip title="Ablehnen">
            <IconButton
              color="secondary"
              aria-label="Decline"
              onClick={handleDecline}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Email kopieren">
          <IconButton
            style={{ color: yellow[500] }}
            aria-label="Email"
            onClick={() => {
              navigator.clipboard.writeText(ev.email);
            }}
          >
            <EmailIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
  const show1 = (
    <div>
      &ensp;&ensp;{string}
      <IconButton color="primary" aria-label="Undo" onClick={handleUndo}>
        <SettingsBackupRestoreIcon />
      </IconButton>
    </div>
  );
  const show5 = <div />;

  if (show === 0) {
    return show0;
  } else if (show === 1) {
    return show1;
  } else {
    if (!undo) {
      let confirmed;
      if (string === "Abgelehnt.") confirmed = false;
      else confirmed = true;
      api(
        CallTypes.REQUESTS.UPDATE,
        res => {
          if (res.status === 200) props.updateParent(props.date);
          else {
            props.updateParent(props.date);
          }
        },
        ev.id,
        {
          id: ev.id,
          date_time: ev.date_time,
          confirmed: confirmed,
          type: ev.type,
          reservation_id: ev.reservation_id,
          loan_id: ev.loan_id
        }
      );
      setDone(true);
      return show5;
    } else {
      setShow(0);
      setUndo(false);
      return show0;
    }
  }
}
