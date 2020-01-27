import React from "react";
import Box from "@material-ui/core/Box";
import ScheduleAffirmationAppointments from "./AppointmentAffirmation";
import ScheduleAffirmationReservations from "./ReservationAffirmation";
import { CallTypes, api } from "../../utils/api.js";

/*
  ScheduleAffirmationView

  This component shows all unconfirmed requests of appointments and reservations.
  
  Uses: AppointmentAffirmation, ReservationAffirmation
*/

class ScheduleAffirmationView extends React.Component {
  state = {
    appointmentRequests: [],
    reservationRequests: [],
    bikeList: []
  };

  componentDidMount() {
    api(
      CallTypes.CONTRACTS.RETURN,
      res => {
        if (res.status === 200) {
          this.setState({ appointmentRequests: res.message });
        }
      },
      1001337,
      1001337
    );

    api(CallTypes.BIKES.RETURN, res => {
      if (res.status === 200) {
        this.setState({ bikeList: res.message });
      }
    });

    api(CallTypes.RESERVATIONS.RETURNPENDING, res => {
      if (res.status === 200) {
        this.setState({ reservationRequests: res.message });
      }
    });
  }

  render() {
    let appointmentArray = [];
    let reservationArray = [];

    if (this.state.appointmentRequests.length === 0) {
      appointmentArray.push(
        <Box marginLeft={2} marginBottom={1} key={-1}>
          Alles erledigt.
        </Box>
      );
    } else {
      for (let i = 0; i < this.state.appointmentRequests.length; i++) {
        appointmentArray.push(
          <ScheduleAffirmationAppointments
            event={this.state.appointmentRequests[i]}
            key={i}
            updateParent={this.props.updateSchedule}
          />
        );
      }
    }
    if (this.state.reservationRequests.length === 0) {
      reservationArray.push(
        <Box marginLeft={2} marginBottom={1} key={-1}>
          Alles erledigt.
        </Box>
      );
    } else {
      for (let i = 0; i < this.state.reservationRequests.length; i++) {
        reservationArray.push(
          <ScheduleAffirmationReservations
            event={this.state.reservationRequests[i]}
            bikeList={this.state.bikeList}
            key={i}
            updateParent={this.props.updateSchedule}
          />
        );
      }
    }

    return (
      <Box>
        <Box>&ensp;</Box>
        <Box
          fontWeight="fontWeightMedium"
          fontSize={18}
          marginBottom={0.5}
          marginTop={-1}
          marginLeft={2}
        >
          Terminanfragen:
        </Box>
        <Box>{appointmentArray}</Box>
        <Box
          fontWeight="fontWeightMedium"
          fontSize={18}
          marginBottom={0.5}
          marginLeft={2}
        >
          Reservierungsanfragen:
        </Box>
        <Box>{reservationArray}</Box>
      </Box>
    );
  }
}

export default ScheduleAffirmationView;
