import React from "react";
import Typography from "@material-ui/core/Typography";
import * as dates from "date-arithmetic";
import { Navigate } from "react-big-calendar";
import Box from "@material-ui/core/Box";
import * as dateMath from "date-arithmetic";
import HistoryMonthComponent from "./ContractComponent";
import HistoryAffirmationView from "./HistoryAffirmationView.js";
import { CallTypes, api } from "../../utils/api.js";

/*
  HistoryMonthView

  This component is the view displayed by the calendar from History.

  Uses: ContractComponent, HistoryAffirmationView
*/

class HistoryMonthView extends React.Component {
  state = {
    monthsContracts: [],
    bikeList: undefined,
    information: undefined,
    lastDate: undefined,
    monthsAppointmentsAccepted: undefined,
    monthsAppointmentsDeclined: undefined,
    monthsReservations: undefined
  };

  apiCall(date) {
    // Calls for Loan History

    api(CallTypes.BIKES.RETURN, res => {
      if (res.status === 200) {
        this.setState({ bikeList: res.message });
      } else {
        this.setState({ bikeList: [] });
      }
    });
    api(CallTypes.INFORMATIONS.RETURN, res => {
      if (res.status === 200) {
        this.setState({ information: res.message });
      } else {
        this.setState({ information: { price_monthly: 0, price_weekly: 0 } });
      }
    });
    api(
      CallTypes.LOANS.RETURNMONTH,
      res => {
        if (res.status === 200)
          this.setState({
            monthsContracts: res.message
          });
        else {
          this.setState({ monthsContracts: [] });
        }
      },
      date.getFullYear(),
      date.getMonth() + 1
    );

    // Calls for appointment and reservation history

    api(
      CallTypes.CONTRACTS.RETURNMONTH,
      res => {
        if (res.status === 200) {
          this.setState({ monthsAppointmentsAccepted: res.message });
        } else {
          this.setState({ monthsAppointmentsAccepted: [] });
        }
      },
      1001337,
      1,
      date.getFullYear(),
      date.getMonth() + 1
    );
    api(
      CallTypes.CONTRACTS.RETURNMONTH,
      res => {
        if (res.status === 200) {
          this.setState({ monthsAppointmentsDeclined: res.message });
        } else {
          this.setState({ monthsAppointmentsDeclined: [] });
        }
      },
      1001337,
      0,
      date.getFullYear(),
      date.getMonth() + 1
    );
    api(
      CallTypes.RESERVATIONS.RETURNMONTH,
      res => {
        if (res.status === 200)
          this.setState({ monthsReservations: res.message });
        else {
          this.setState({ monthsReservations: [] });
        }
      },
      date.getFullYear(),
      date.getMonth() + 1
    );
  }

  componentDidMount() {
    let { date } = this.props;
    this.setState({ lastDate: date });
    this.apiCall(date);
  }

  render() {
    let { date } = this.props;
    if (
      this.state.lastDate &&
      new Date(date).getMonth() !== this.state.lastDate.getMonth()
    ) {
      this.apiCall(date);
      this.setState({ lastDate: date });
    }
    if (!this.state.bikeList || !this.state.information) return <Box></Box>;
    let thisMonthsContracts = [];
    var eve;
    var i;
    for (i = 0; i < this.state.monthsContracts.length; i++) {
      eve = this.state.monthsContracts[i];
      if (
        dateMath.eq(date, eve.start_date, "month") &&
        (eve.status === "running" || eve.status === "closed")
      ) {
        thisMonthsContracts.push(eve);
      }
    }
    // Build an array of items
    let array = [];
    let incomeResult = 0;
    let amountOfLoans = 0;
    let amountOfBikes = 0;
    for (let i = 0; i < thisMonthsContracts.length; i++) {
      array.push(
        <HistoryMonthComponent
          event={{ data: thisMonthsContracts[i] }}
          key={i}
          isHistoryComponent={true}
          bikeList={this.state.bikeList}
          information={this.state.information}
        />
      );
      incomeResult += thisMonthsContracts[i].price;
      amountOfLoans++;
      amountOfBikes += thisMonthsContracts[i].number_of_bikes;
    }

    return (
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        bgcolor="white"
        marginBottom={2}
      >
        {array.length > 0 ? (
          <Box marginLeft={0.5} marginRight={0.5}>
            <Typography>
              &ensp; Insgesamte Einnahmen für dieses Monat:
            </Typography>
            <Box
              fontWeight="fontWeightBold"
              fontSize={32}
              marginLeft={1.5}
              marginTop={1}
              marginBottom={1}
            >
              {incomeResult}€
            </Box>
            <Box marginLeft={1.5}>
              in {amountOfLoans} Vermietungen von insgesamt {amountOfBikes}{" "}
              Fahrrädern.
            </Box>
            <div>&ensp;</div>
            <Typography>&ensp; Alle Vertr&auml;ge von diesem Monat:</Typography>
            <Box marginLeft={-0.5}>{array}</Box>
            <div>&ensp;</div>
          </Box>
        ) : (
          <Box marginLeft={0.5} marginRight={0.5}>
            <Typography>
              &ensp; Keine Vertr&auml;ge f&uuml;r diesen Monat.
            </Typography>
            <Box
              fontWeight="fontWeightBold"
              fontSize={32}
              marginLeft={1.5}
              marginTop={1}
              marginBottom={1}
            >
              {incomeResult}€
            </Box>
          </Box>
        )}
        <Box marginLeft={0.5} marginRight={0.5}>
          <HistoryAffirmationView
            date={date}
            bikeList={this.state.bikeList}
            monthsAppointmentsAccepted={this.state.monthsAppointmentsAccepted}
            monthsAppointmentsDeclined={this.state.monthsAppointmentsDeclined}
            monthsReservations={this.state.monthsReservations}
          />
        </Box>
      </Box>
    );
  }
}

HistoryMonthView.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -1, "month");

    case Navigate.NEXT:
      return dates.add(date, 1, "month");

    default:
      return date;
  }
};

HistoryMonthView.title = date => {
  const options = { month: "long", year: "numeric" };
  return `${date.toLocaleDateString("de-DE", options)}`;
};

export default HistoryMonthView;
