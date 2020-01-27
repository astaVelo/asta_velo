import React from "react";
import { useState, useEffect } from "react";
import classNames from "classnames";
// @material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
// Header
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// Others
import styles from "assets/jss/material-kit-react/views/components.js";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
// Own components
import HistoryMonthView from "./Sections/HistoryMonthView.js";

/*
  History

  This component displays the history containing a calendar with the Sections/HistoryMonthView.

  Uses: HistoryMonthView
*/

moment.locale("de");
const localizer = momentLocalizer(moment);
const myEventsList = [];

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

const calendarHeight = 800;

export default function History(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const messages = {
    allDay: "Tageszeit",
    previous: "<",
    next: ">",
    today: "Aktueller Monat",
    month: "Monat",
    week: "Woche",
    day: "Tag",
    agenda: "Agenda",
    date: "Datum",
    time: "Zeit",
    event: "Termin",
    showMore: total => `+ ${total} Weitere Termine`
  };
  const views = {
    month: HistoryMonthView
  };
  const { height, width } = useWindowDimensions();
  let ratio = width / height;
  let flexDirectionString;
  let boxWidthLeftBox;
  let className;
  if (ratio > 1.1) {
    flexDirectionString = "row";
    boxWidthLeftBox = "100%";
    className = classNames(classes.main, classes.mainRaised);
  } else {
    flexDirectionString = "column-reverse";
    boxWidthLeftBox = "100%";
    className = classNames(classes.main, classes.mainRaisedMobile);
  }

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
      <Box display="flex" flexDirection={flexDirectionString}>
        <Box width={boxWidthLeftBox}>
          <div className={className}>
            <Box height={calendarHeight}>
              <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                views={views}
                drilldownView="day"
                messages={messages}
              />
            </Box>
          </div>
        </Box>
      </Box>
    </div>
  );
}
