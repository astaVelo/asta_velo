import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import HistoryAffirmationAppointments from "./AppointmentAffirmation";
import HistoryAffirmationReservations from "./ReservationAffirmation";
import * as dateMath from "date-arithmetic";
import Box from "@material-ui/core/Box";

/*
  HistoryAffirmationView

  This component displays the history of requests for appointments and reservations.

  Uses: AppointmentAffirmation, ReservationAffirmation
*/

class HistoryAffirmationView extends React.Component {
  render() {
    let {
      bikeList,
      monthsAppointmentsAccepted,
      monthsAppointmentsDeclined,
      monthsReservations
    } = this.props;
    let appointmentArray = [];
    let reservationArray = [];
    let currentDate = new Date();

    const pushAppointmentArray = (appointment, key) => {
      appointmentArray.push(
        <HistoryAffirmationAppointments
          event={appointment}
          key={key}
          isHistoryComponent={true}
          isPast={dateMath.lt(
            new Date(appointment.date_time),
            currentDate,
            "day"
          )}
          updateParent={() => {}}
        />
      );
    };

    if (monthsAppointmentsAccepted && monthsAppointmentsDeclined) {
      if (
        monthsAppointmentsAccepted.length === 0 &&
        monthsAppointmentsDeclined.length === 0
      ) {
        appointmentArray.push(
          <div key={0}>
            <Typography>
              &ensp; Keiner Terminanfragen für dieses Monat.
            </Typography>
          </div>
        );
      } else {
        for (let i = 0; i < monthsAppointmentsAccepted.length; i++) {
          pushAppointmentArray(monthsAppointmentsAccepted[i], i);
        }
        for (let i = 0; i < monthsAppointmentsDeclined.length; i++) {
          pushAppointmentArray(
            monthsAppointmentsDeclined[i],
            i + monthsAppointmentsAccepted.length
          );
        }
      }
    }
    if (monthsReservations) {
      if (monthsReservations.length === 0) {
        reservationArray.push(
          <div key={0}>
            <Typography>
              &ensp; Keine Reservierungen für diesen Monat.
            </Typography>
          </div>
        );
      } else {
        for (let i = 0; i < monthsReservations.length; i++) {
          reservationArray.push(
            <HistoryAffirmationReservations
              event={monthsReservations[i]}
              bikeList={bikeList}
              isHistoryComponent={true}
              key={i}
              updateParent={() => {}}
            />
          );
        }
      }
    }

    return (
      <div>
        <div>
          <Box fontWeight="fontWeightMedium" fontSize={18} marginBottom={0.5}>
            &ensp; Terminanfragen:
          </Box>
          <Box marginLeft={2}>{appointmentArray}</Box>
        </div>
        <div>
          <Box fontWeight="fontWeightMedium" fontSize={18} marginBottom={0.5}>
            &ensp; Reservierungsanfragen:
          </Box>
          <Box marginLeft={2}>{reservationArray}</Box>
        </div>
      </div>
    );
  }
}

HistoryAffirmationView.propTypes = {
  bikeList: PropTypes.array,
  monthsAppointmentsAccepted: PropTypes.array,
  monthsAppointmentsDeclined: PropTypes.array,
  monthsReservations: PropTypes.array
};

export default HistoryAffirmationView;
