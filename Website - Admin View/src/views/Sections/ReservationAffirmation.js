import React from "react";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import EmailIcon from "@material-ui/icons/MailOutline";
import IconButton from "@material-ui/core/IconButton";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import { yellow } from "@material-ui/core/colors";
import { CallTypes, api } from "../../utils/api.js";

/*
  ReservationAffirmation

  This component displays a Reservation.

  Used by: HistoryAffirmationView, ScheduleAffirmationView
*/

ReservationAffirmation.propTypes = {
  event: PropTypes.object,
  updateParent: PropTypes.func,
  isHistoryComponent: PropTypes.bool,
  isPast: PropTypes.bool,
  bikeList: PropTypes.array
};
export default function ReservationAffirmation(props) {
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
  const bikeList = props.bikeList;
  let reservatedBikes = String(ev.bike_ids).split("###");
  let idDisplay = "";
  try {
    for (let i = 0; i < reservatedBikes.length; i++) {
      let bikeId = parseInt(reservatedBikes[i]);
      idDisplay +=
        "[" + bikeList.find(x => x.id === bikeId).inventory_number + "] ";
    }
  } catch (e) {
    //Do nothing (This exception disappears with the next render of this component, so it has no negative effect.)
  }

  const show0 = (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      borderTop={1}
      borderColor="grey.100"
    >
      &ensp;&ensp;{new Date(ev.date_from).toLocaleDateString()} -{" "}
      {new Date(ev.date_to).toLocaleDateString()}: &ensp; Fahrräder: {idDisplay}
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
      else confirmed = false;
      api(
        CallTypes.RESERVATIONS.UPDATE,
        res => {
          if (res.status === 200) props.updateParent();
        },
        ev.id,
        {
          id: ev.id,
          date_from: ev.date_from,
          date_to: ev.date_to,
          bike_ids: ev.bike_ids,
          confirmed: confirmed,
          email: ev.email
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
