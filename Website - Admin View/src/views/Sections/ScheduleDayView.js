import React from "react";
import Typography from "@material-ui/core/Typography";
import * as dates from "date-arithmetic";
import { Navigate } from "react-big-calendar";
import ScheduleDayComponent from "./ContractComponent";
import { information } from "views/Schedule";

/*
  ScheduleDayView

  This component shows all appointments, with their contracts, of the current date.

  Uses: ContractComponent
*/

class ScheduleDayView extends React.Component {
  state = {
    todaysEvents: [],
    information: {}
  };

  render() {
    let { date, events, onDoubleClickEvent } = this.props;
    const updateSchedule = onDoubleClickEvent;
    let array = [];
    let day = date.getDate();
    for (let i = 0; i < events.length; i++) {
      if (day === new Date(events[i].start).getDate()) {
        array.push(
          <ScheduleDayComponent
            event={events[i]}
            key={i}
            updateSchedule={updateSchedule}
            information={information}
          />
        );
      }
    }

    if (array.length === 0) {
      return (
        <div>
          <Typography>&ensp; Keine Termine f&uuml;r heute.</Typography>
        </div>
      );
    }
    return (
      <div>
        <Typography>&ensp; Heutige Termine:</Typography>
        {array}
      </div>
    );
  }
}

ScheduleDayView.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -1, "day");

    case Navigate.NEXT:
      return dates.add(date, 1, "day");

    default:
      return date;
  }
};

ScheduleDayView.title = date => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return `${date.toLocaleDateString("de-DE", options)}`;
};

export default ScheduleDayView;
