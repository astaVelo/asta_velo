import React from "react";
import classNames from "classnames";
import { useState, useEffect } from "react";
// @material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
// Header
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// Other Libraries
import SVG from "react-inlinesvg";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import styles from "assets/jss/material-kit-react/views/components.js";
// Own components and Icons
import PickUpIcon from "../icons/PickUp.svg";
import ReturnIcon from "../icons/BringBack.svg";
import ScheduleAffirmationView from "./Sections/ScheduleAffirmationView.js";
import ScheduleDayView from "./Sections/ScheduleDayView.js";
import { CallTypes, api } from "../utils/api.js";

/*
  Schedule

  This component displays a calendar (including /Sections/ScheduleDayView) on the left hand side 
  and a card for confirmations (/Sections/ScheduleAffirmationView) on the right hand side.

  Uses: ScheduleDayView, ScheduleAffirmationView
*/

export var information = { price_weekly: 0, price_monthly: 0 };
api(CallTypes.INFORMATIONS.RETURN, res => {
  if (res.status === 200) {
    information = res.message;
  }
});

moment.locale("de");
const localizer = momentLocalizer(moment);

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
let boac = false;

export default function Schedule(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const messages = {
    allDay: "Tageszeit",
    previous: "<",
    next: ">",
    today: "Heute",
    month: "Monat",
    week: "Woche",
    day: "Tag",
    agenda: "Agenda",
    date: "Datum",
    time: "Zeit",
    event: "Termin",
    showMore: total => `+ ${total} Weitere Termine`
  };

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [myEventsList, setMyEventsList] = React.useState([]);

  if (!boac) {
    api(
      CallTypes.CONTRACTS.RETURNMONTH,
      res => {
        if (res.status === 200) {
          let temp = [];
          let tempEl;
          for (let i = 0; i < res.message.length; i++) {
            tempEl = res.message[i];
            temp.push({
              allDay: true,
              start: tempEl.date_time,
              end: tempEl.date_time,
              firstName: tempEl.first_name,
              lastName: tempEl.last_name,
              email: tempEl.email,
              title: tempEl.last_name,
              type: tempEl.type,
              data: tempEl
            });
          }
          boac = true;
          setMyEventsList(temp);
        }
      },
      1001337,
      1,
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
  } else boac = false;

  const childChanged = () => {
    setCurrentDate(new Date(currentDate));
  };

  const views = {
    month: true,
    day: ScheduleDayView
  };

  function customEventDisplay(event) {
    let icon;
    if (event.event.type === "return") {
      icon = (
        <Tooltip title="Rückgabe">
          <SVG src={ReturnIcon} width={28} height={28} />
        </Tooltip>
      );
    } else {
      icon = (
        <Tooltip title="Abholung">
          <SVG src={PickUpIcon} width={28} height={28} />
        </Tooltip>
      );
    }
    return (
      <Box display="flex" flexDirection="row">
        <Box fontSize={16} flexGrow={1} marginTop={1} marginRight={0.5}>
          {event.title}
        </Box>
        <Box marginTop={0.75} marginRight={0.5}>
          {icon}
        </Box>
      </Box>
    );
  }

  const { height, width } = useWindowDimensions();
  let ratio = width / height;
  let flexDirectionString;
  let boxWidthLeftBox;
  let boxWidthRightBox;
  let marginBotCorrection;
  let className;
  if (ratio > 1.1) {
    flexDirectionString = "row";
    boxWidthLeftBox = "60%";
    boxWidthRightBox = "40%";
    marginBotCorrection = 0;
    className = classNames(classes.main, classes.mainRaised);
  } else {
    flexDirectionString = "column-reverse";
    boxWidthLeftBox = "100%";
    boxWidthRightBox = "100%";
    marginBotCorrection = -8;
    className = classNames(classes.main, classes.mainRaisedMobile);
  }

  const reRender = date => {
    if (new Date(date).getMonth() !== currentDate.getMonth())
      setCurrentDate(new Date(date));
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
                onNavigate={reRender}
                components={{
                  event: customEventDisplay
                }}
                onDoubleClickEvent={childChanged}
              />
            </Box>
          </div>
        </Box>
        <Box width={boxWidthRightBox} marginBottom={marginBotCorrection}>
          <div className={className}>
            <ScheduleAffirmationView updateSchedule={childChanged} />
          </div>
        </Box>
      </Box>
    </div>
  );
}
