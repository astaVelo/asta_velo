import React from "react";
import PropTypes from "prop-types";
//Material-Ui Components
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import PrintIcon from "@material-ui/icons/Print";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
//Date components
import DateFnsUtils from "@date-io/date-fns";
import de from "date-fns/locale/de";
import * as dateMath from "date-arithmetic";
//Own components
import { Print } from "../../utils/Printer";
import { CallTypes, api } from "../../utils/api.js";

/*
ContractComponent

This is the component to display one appointment in the day view of the calendar in Schedule or one loan in the month view of the calendar in History.

Used by: HistoryMonthView, ScheduleDayView
*/

//Global Variables
let PricePerMonth = 0;
let PricePerWeek = 0;
const PriceDeposit = 60;

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  images: {
    width: "5%"
  },
  menuItems: {
    width: "30%"
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

//Global Help Functions
function calculateCosts(weeks, amountOfBikes) {
  let result = 0;
  result += Math.floor(weeks / 4) * PricePerMonth;
  let rest = (weeks % 4) * PricePerWeek;
  if (rest > PricePerMonth) rest = PricePerMonth;
  result += rest;
  return Math.max(0, result * amountOfBikes);
}
function weekOrWeeks(weeks) {
  if (weeks === 1) return "Woche";
  return "Wochen";
}

//The class

ContractComponent.propTypes = {
  event: PropTypes.object,
  updateSchedule: PropTypes.func,
  isHistoryComponent: PropTypes.bool,
  bikeList: PropTypes.array,
  information: PropTypes.object
};

export default function ContractComponent(props) {
  const classes = useStyles();

  let ev = props.event;
  let History = props.isHistoryComponent;
  let date_time = History ? new Date(ev.data.start_date) : new Date(ev.start);
  let Return = History ? true : ev.type === "return";

  PricePerMonth = parseInt(props.information.price_monthly);
  PricePerWeek = parseInt(props.information.price_monthly);

  //State variables
  const [initialCall, setInitialCall] = React.useState(true);
  const [update, setUpdate] = React.useState(true);
  const [noBikeChosen, setNoBikeChosen] = React.useState(true);
  const [selectedStartDate, setselectedStartDate] = React.useState(
    new Date(ev.data.start_date).getFullYear() >= 2000
      ? ev.data.start_date
      : ev.data.date_from
      ? ev.data.date_from
      : date_time
  );
  const [selectedEndDate, setselectedEndDate] = React.useState(
    new Date(ev.data.end_date).getFullYear() >= 2000
      ? ev.data.end_date
      : ev.data.date_to
      ? ev.data.date_to
      : date_time
  );
  const [durationW, setDurationW] = React.useState(
    Math.ceil(
      dateMath.diff(
        new Date(selectedStartDate),
        new Date(selectedEndDate),
        "day",
        false
      ) / 7
    )
  );
  const [amount, setAmount] = React.useState(
    Math.max(parseInt(ev.data.number_of_bikes), 1)
  );
  const [weekplural, setWeekplural] = React.useState(weekOrWeeks(durationW));
  const [costs, setCosts] = React.useState(
    ev.data.price ? ev.data.price : calculateCosts(durationW, amount)
  );
  const [deposit, setDeposit] = React.useState(
    ev.data.deposit ? ev.data.deposit : PriceDeposit * amount
  );
  const [textColor, setTextColor] = React.useState("text.primary");
  const [state, setState] = React.useState({
    checkedPayed: ev.data.status !== "pending"
  });
  const [errorMeldung, setErrorMeldung] = React.useState(<Box></Box>);
  const [bikeId1, setBikeId1] = React.useState(0);
  const [bikeId2, setBikeId2] = React.useState(0);
  const [bikeId3, setBikeId3] = React.useState(0);
  const [bikeId4, setBikeId4] = React.useState(0);
  const [bikeId5, setBikeId5] = React.useState(0);
  const [name, setName] = React.useState(ev.data.last_name);
  const [vorname, setVorname] = React.useState(ev.data.first_name);
  const [geburtsdatum, setGeburtsdatum] = React.useState(ev.data.birthday);
  const [strasseHausnummer, setStrasseHausnummer] = React.useState(
    ev.data.street
  );
  const [postleitzahlOrt, setPostleitzahlOrt] = React.useState(
    ev.data.location
  );
  const [telefonnummer, setTelefonnummer] = React.useState(
    ev.data.phone_number
  );
  const [email, setEmail] = React.useState(ev.data.email);
  const [bikeList, setAvailableBikes] = React.useState([]);

  //Functions
  //  Main Functions
  const handlePrint = () => {
    let customer = {
      name: name,
      vorname: vorname,
      geburtsdatum: geburtsdatum,
      strasseHausnummer: strasseHausnummer,
      postleitzahlOrt: postleitzahlOrt,
      telefonnummer: telefonnummer,
      email: email
    };
    let fahrrad1 = "";
    if (bikeId1 > 0) fahrrad1 = bikeList[bikeId1 - 1].name;
    let fahrrad2 = "";
    if (bikeId2 > 0 && amount > 1) fahrrad2 = bikeList[bikeId2 - 1].name;
    let fahrrad3 = "";
    if (bikeId3 > 0 && amount > 2) fahrrad3 = bikeList[bikeId3 - 1].name;
    let bikes = { fahrrad1: fahrrad1, fahrrad2: fahrrad2, fahrrad3: fahrrad3 };
    Print(
      customer,
      bikes,
      costs,
      deposit,
      new Date(selectedStartDate),
      new Date(selectedEndDate)
    );
  };
  const handleSave = () => {
    if (!state.checkedPayed) {
      setErrorMeldung(
        <Box color="red">
          Um zu Speichern muss das Kontrollkästchen bestätigt werden.
        </Box>
      );
      return;
    }
    let bikeIds = "";
    if (bikeId1 > 0) bikeIds += bikeList[bikeId1 - 1].id + "###";
    if (bikeId2 > 0 && amount > 1) bikeIds += bikeList[bikeId2 - 1].id + "###";
    if (bikeId3 > 0 && amount > 2) bikeIds += bikeList[bikeId3 - 1].id;
    let startDate =
      new Date(selectedStartDate).getDate() +
      "." +
      (new Date(selectedStartDate).getMonth() + 1) +
      "." +
      new Date(selectedStartDate).getFullYear() +
      ".12:00";
    let endDate =
      new Date(selectedEndDate).getDate() +
      "." +
      (new Date(selectedEndDate).getMonth() + 1) +
      "." +
      new Date(selectedEndDate).getFullYear() +
      ".12:00";
    let payload = {
      id: ev.data.loan_id,
      start_date: startDate,
      end_date: endDate,
      loan_duration: durationW,
      price: costs,
      status: Return ? "closed" : "running",
      email: email,
      bike_ids: bikeIds,
      first_name: vorname,
      last_name: name,
      phone_number: telefonnummer,
      deposit: deposit,
      number_of_bikes: amount,
      birthday: geburtsdatum,
      street: strasseHausnummer,
      location: postleitzahlOrt
    };
    api(
      CallTypes.LOANS.UPDATE,
      res => {
        if (res.status === 200) props.updateSchedule();
        else
          console.log(
            "error on loan update: " + res.status + ": " + res.message
          );
      },
      ev.data.loan_id,
      payload
    );
    api(
      CallTypes.LOANS.UPDATESTATUS,
      res => {
        if (res.status === 200) props.updateSchedule();
        else
          console.log(
            "error on loan updatestatus: " + res.status + ": " + res.message
          );
      },
      ev.data.loan_id,
      payload
    );
    if (!Return && ev.data.status === "pending") {
      api(
        CallTypes.APPOINTMENTS.SENDREQUEST,
        res => {
          if (res.status === 200) console.log("posted return appointment");
          else
            console.log(
              "error on return appointment post: " +
                res.status +
                ": " +
                res.message
            );
        },
        {
          id: 0,
          date_time: endDate,
          confirmed: true,
          type: "return",
          reservation_id: ev.data.reservation_id,
          loan_id: ev.data.loan_id,
          start_date: startDate,
          end_date: endDate,
          loan_duration: durationW,
          price: costs,
          status: Return ? "closed" : "running",
          email: email,
          bike_ids: bikeIds,
          first_name: vorname,
          last_name: name,
          phone_number: telefonnummer,
          deposit: deposit,
          number_of_bikes: amount,
          birthday: geburtsdatum,
          street: strasseHausnummer,
          location: postleitzahlOrt
        }
      );
    }
  };
  const handleDelete = () => {
    api(
      CallTypes.LOANS.DELETE,
      res => {
        if (res.status === 200) console.log("loan delete succesfull");
        else
          console.log(
            "error on loan delete: " + res.status + ": " + res.message
          );
      },
      ev.data.loan_id ? ev.data.loan_id : ev.data.id
    );
    if (!History) {
      api(
        CallTypes.APPOINTMENTS.DELETE,
        res => {
          if (res.status === 200) console.log("appointment delete succesfull");
          else
            console.log(
              "error on appointment delete: " + res.status + ": " + res.message
            );
        },
        ev.id
      );
    }
  };
  const valuateBikeIds = bikeList => {
    let temp = [];
    for (let i = 0; i < bikeList.length; i++) {
      let stringName =
        "[" + bikeList[i].inventory_number + "] " + bikeList[i].type;
      temp.push({
        name: stringName,
        id: bikeList[i].id,
        available: bikeList[i].available
      });
    }
    temp = temp.reverse();
    if (
      noBikeChosen &&
      ev.data.bike_ids &&
      ev.data.bike_ids !== "" &&
      ev.data.bike_ids !== "default"
    ) {
      setNoBikeChosen(false);
      let ls = String(ev.data.bike_ids).split("###");
      let idStateVariableSetters = [
        setBikeId1,
        setBikeId2,
        setBikeId3,
        setBikeId4,
        setBikeId5
      ];
      for (let i = 0; i < amount; i++) {
        let bikeId = parseInt(ls[i]);
        idStateVariableSetters[i](temp.findIndex(x => x.id === bikeId) + 1);
      }
    }
    setAvailableBikes(temp);
  };
  const apiCalls = () => {
    if (History) {
      valuateBikeIds(props.bikeList);
      setUpdate(!update);
    } else {
      let bikeCallType = CallTypes.BIKES.RETURN;
      api(bikeCallType, res => {
        if (res.status === 200) {
          valuateBikeIds(res.message);
        } else
          console.log(
            "Error while returning available Bikes: " +
              res.status +
              ": " +
              res.message
          );
      });
    }
  };
  //  Value Handlers
  const handleStartDateChange = date => {
    let weeks = Math.ceil(
      dateMath.diff(date, new Date(selectedEndDate), "day", false) / 7
    );
    if (weeks > 0 && weeks <= 24) {
      setTextColor("text.primary");
    } else {
      setTextColor("secondary.main");
    }
    setselectedStartDate(date);
    setDurationW(weeks);
    setCosts(calculateCosts(weeks, amount));
    setWeekplural(weekOrWeeks(weeks));
  };
  const handleEndDateChange = date => {
    let weeks = Math.ceil(
      dateMath.diff(new Date(selectedStartDate), date, "day", false) / 7
    );
    if (weeks > 0 && weeks <= 24) {
      setTextColor("text.primary");
    } else {
      setTextColor("secondary.main");
    }
    setselectedEndDate(date);
    setDurationW(weeks);
    setCosts(calculateCosts(weeks, amount));
    setWeekplural(weekOrWeeks(weeks));
  };
  const handlecheckedPayed = name => event => {
    setState({ ...state, [name]: event.target.checked });
    setErrorMeldung(<Box></Box>);
  };
  function valuetext(value) {
    return `${value}Test`;
  }
  const handleAmountChange = (event, value) => {
    setAmount(value);
    setCosts(calculateCosts(durationW, value));
    setDeposit(PriceDeposit * value);
  };
  const handleBikeIdChange1 = event => {
    setBikeId1(event.target.value);
  };
  const handleBikeIdChange2 = event => {
    setBikeId2(event.target.value);
  };
  const handleBikeIdChange3 = event => {
    setBikeId3(event.target.value);
  };
  const handleBikeIdChange4 = event => {
    setBikeId4(event.target.value);
  };
  const handleBikeIdChange5 = event => {
    setBikeId5(event.target.value);
  };
  const handleBikeIdMethods = [];
  handleBikeIdMethods.push(
    handleBikeIdChange1,
    handleBikeIdChange2,
    handleBikeIdChange3,
    handleBikeIdChange4,
    handleBikeIdChange5
  );
  const bikeIds = [];
  bikeIds.push(bikeId1, bikeId2, bikeId3, bikeId4, bikeId5);

  //Graphic Variables
  const ArrayElementElement = id => {
    return (
      <MenuItem value={id + 1} key={id}>
        <Box color={bikeList[id].available ? "text.primary" : "text.disabled"}>
          {bikeList[id].name}
        </Box>
      </MenuItem>
    );
  };
  let ArrayElementElementList = [];
  for (let i = 0; i < bikeList.length; i++) {
    ArrayElementElementList.push(ArrayElementElement(i));
  }
  const ArrayElement = id => {
    return (
      <Box width="40%" key={id}>
        <FormControl variant="outlined" className={classes.formControl}>
          <Select
            value={bikeIds[id]}
            onChange={handleBikeIdMethods[id]}
            onClick={
              Return
                ? () => {}
                : () => {
                    setNoBikeChosen(false);
                    apiCalls();
                  }
            }
            disabled={Return}
          >
            {ArrayElementElementList}
          </Select>
        </FormControl>
      </Box>
    );
  };
  let Array = [];
  for (let i = 0; i < amount; i++) {
    Array.push(ArrayElement(i));
  }

  let statusDisplay;
  switch (ev.data.status) {
    case "pending":
      statusDisplay = (
        <Tooltip title="Vertrag ausstehend">
          <Box color="orange" fontStyle="italic">
            • ausstehend
          </Box>
        </Tooltip>
      );
      break;
    case "running":
      statusDisplay = (
        <Tooltip title="Vertrag aktiv">
          <Box color="green" fontStyle="italic">
            • aktiv
          </Box>
        </Tooltip>
      );
      break;
    case "closed":
      statusDisplay = (
        <Tooltip title="Vertrag beendet">
          <Box color="red" fontStyle="italic">
            • beendet
          </Box>
        </Tooltip>
      );
      break;
    default:
      console.log("Error: Unknown loan status");
  }

  if (initialCall) {
    setInitialCall(false);
    apiCalls();
  }

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <Box display="flex" flexDirection="row">
          <Box flexGrow={1}>
            <Typography className={classes.heading}>
              {" "}
              {History ? "" : Return ? "Rückgabe:" : "Abholung:"} {vorname}{" "}
              {name} &ensp;
            </Typography>
          </Box>
          {statusDisplay}
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box flexDirection="row">
          <Box>
            Informationen zur Person:
            <Box>
              <Box>
                <TextField
                  label="Name"
                  defaultValue={name}
                  onChange={event => {
                    setName(event.target.value);
                  }}
                  InputProps={Return ? { readOnly: true } : {}}
                />
                &ensp;
                <TextField
                  label="Vorname"
                  defaultValue={vorname}
                  onChange={event => {
                    setVorname(event.target.value);
                  }}
                  InputProps={Return ? { readOnly: true } : {}}
                />
              </Box>
              <Box>
                <TextField
                  label="Geburtsdatum"
                  defaultValue={geburtsdatum}
                  onChange={event => {
                    setGeburtsdatum(event.target.value);
                  }}
                  InputProps={Return ? { readOnly: true } : {}}
                />
              </Box>
              <Box>
                <TextField
                  label="Email"
                  defaultValue={email}
                  onChange={event => {
                    setEmail(event.target.value);
                  }}
                  InputProps={Return ? { readOnly: true } : {}}
                />
                &ensp;
                <TextField
                  label="Telefonnummer"
                  defaultValue={telefonnummer}
                  onChange={event => {
                    setTelefonnummer(event.target.value);
                  }}
                  InputProps={Return ? { readOnly: true } : {}}
                />
              </Box>
              <Box>
                <TextField
                  label={unescape("Stra%DFe%2C Hausnummer")}
                  defaultValue={strasseHausnummer}
                  onChange={event => {
                    setStrasseHausnummer(event.target.value);
                  }}
                  InputProps={Return ? { readOnly: true } : {}}
                />
                &ensp;
                <TextField
                  label="Postleitzahl, Ort"
                  defaultValue={postleitzahlOrt}
                  onChange={event => {
                    setPostleitzahlOrt(event.target.value);
                  }}
                  InputProps={Return ? { readOnly: true } : {}}
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box flexDirection="row">
              <div> &ensp; </div>
              Vertrag:
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
                <Grid container justify="space-around">
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="Vertragsbeginn"
                    value={selectedStartDate}
                    onChange={handleStartDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                    disabled={Return}
                  />
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="Vertragsende"
                    value={selectedEndDate}
                    onChange={handleEndDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                    disabled={History}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <Box color={textColor}>
                Laufzeit: {durationW} {weekplural}{" "}
              </Box>
              <Box>
                Anzahl Fahrr&auml;der:
                <Slider
                  value={amount}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks={[
                    {
                      value: 1,
                      label: "1"
                    },
                    {
                      value: 2,
                      label: "2"
                    },
                    {
                      value: 3,
                      label: "3"
                    }
                  ]}
                  min={1}
                  max={3}
                  onChange={handleAmountChange}
                  disabled={Return}
                />
              </Box>
              <div>Auswahl Fahrr&auml;der:</div>
              {Array}
              <div> &ensp; </div>
              <div>Kaution: {deposit} &euro;</div>
              <div>Mietpreis: {costs} &euro;</div>
              {History ? (
                <Box></Box>
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.checkedPayed}
                      onChange={handlecheckedPayed("checkedPayed")}
                      value="checkedPayed"
                    />
                  }
                  label={Return ? "Kaution zurückgegeben" : "Bezahlt"}
                />
              )}
              {errorMeldung}
              <div> &ensp; </div>
              <Box display="flex" flexDirection="row" flexWrap="wrap">
                {History ? (
                  <Box></Box>
                ) : (
                  <Fab variant="extended" onClick={handleSave} color="primary">
                    <SaveIcon className={classes.extendedIcon} />
                    Speichern
                  </Fab>
                )}
                &ensp;
                <Fab variant="extended" onClick={handlePrint}>
                  <PrintIcon className={classes.extendedIcon} />
                  Drucken
                </Fab>
                &ensp;
                {Return && !History ? (
                  <Box></Box>
                ) : (
                  <Fab
                    variant="extended"
                    onClick={e => {
                      if (
                        window.confirm(
                          "Soll dieser Vertrag wirklich unwiderruflich entfernt werden?"
                        )
                      )
                        handleDelete(e);
                    }}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </Fab>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
