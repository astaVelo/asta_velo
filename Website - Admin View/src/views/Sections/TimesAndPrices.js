import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Fab from "@material-ui/core/Fab";
import { CallTypes, api } from "../../utils/api.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from "@material-ui/pickers";
import "date-fns";
import de from "date-fns/locale/de";
import DateFnsUtils from "@date-io/date-fns";

/*
  TimesAndPrices

  This component shows all the opening times and prices.

  Used by: History
*/

TimesAndPrices.propTypes = {};

function TimesAndPrices() {
  DateFnsUtils.locale = de;

  const defaultVonDate = new Date().setHours(12, 0);
  const defaultBisDate = new Date().setHours(18, 0);

  const [state, setState] = React.useState({
    initialCall: true,
    weekPrice: 0,
    monthPrice: 0,
    mondayVon: defaultVonDate,
    mondayBis: defaultBisDate,
    tuesdayVon: defaultVonDate,
    tuesdayBis: defaultBisDate,
    wednesdayVon: defaultVonDate,
    wednesdayBis: defaultBisDate,
    thursdayVon: defaultVonDate,
    thursdayBis: defaultBisDate,
    fridayVon: defaultVonDate,
    fridayBis: defaultBisDate,
    saturdayVon: defaultVonDate,
    saturdayBis: defaultBisDate,
    sundayVon: defaultVonDate,
    sundayBis: defaultBisDate,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });

  const callApi = () => {
    api(CallTypes.INFORMATIONS.RETURN, res => {
      if (res.status === 200) {
        let ev = res.message;
        let times = String(ev.opening_hours).split(/###|-|:/);
        setState({
          initialCall: false,
          weekPrice: ev.price_weekly,
          monthPrice: ev.price_monthly,
          mondayVon: new Date().setHours(times[0], times[1]),
          mondayBis: new Date().setHours(times[2], times[3]),
          tuesdayVon: new Date().setHours(times[4], times[5]),
          tuesdayBis: new Date().setHours(times[6], times[7]),
          wednesdayVon: new Date().setHours(times[8], times[9]),
          wednesdayBis: new Date().setHours(times[10], times[11]),
          thursdayVon: new Date().setHours(times[12], times[13]),
          thursdayBis: new Date().setHours(times[14], times[15]),
          fridayVon: new Date().setHours(times[16], times[17]),
          fridayBis: new Date().setHours(times[18], times[19]),
          saturdayVon: new Date().setHours(times[20], times[21]),
          saturdayBis: new Date().setHours(times[22], times[23]),
          sundayVon: new Date().setHours(times[24], times[25]),
          sundayBis: new Date().setHours(times[26], times[27]),
          monday: !(times[0] === times[2] && times[1] === times[3]),
          tuesday: !(times[4] === times[6] && times[5] === times[7]),
          wednesday: !(times[8] === times[10] && times[9] === times[11]),
          thursday: !(times[12] === times[14] && times[13] === times[15]),
          friday: !(times[16] === times[18] && times[17] === times[19]),
          saturday: !(times[20] === times[22] && times[21] === times[23]),
          sunday: !(times[24] === times[26] && times[25] === times[27])
        });
      }
    });
  };
  if (state.initialCall) {
    callApi();
  }

  const entrysBeforeTimes = 3;
  const entrysAfterTimes = 7;
  const handleSave = () => {
    let stateArray = Object.values(state);
    let formatters = ["###", "-"];
    let times = "";
    for (
      let i = 0;
      i < stateArray.length - entrysAfterTimes - entrysBeforeTimes;
      i++
    ) {
      let b =
        stateArray[stateArray.length - entrysAfterTimes + Math.floor(i / 2)];
      times += b ? new Date(stateArray[i + entrysBeforeTimes]).getHours() : 0;
      times += ":";
      times += b ? new Date(stateArray[i + entrysBeforeTimes]).getMinutes() : 0;
      if (i + 1 < stateArray.length - entrysAfterTimes - entrysBeforeTimes)
        times += formatters[(i + entrysBeforeTimes) % 2];
    }
    api(CallTypes.INFORMATIONS.UPDATE, () => {}, {
      id: 0,
      price_weekly: parseInt(state.weekPrice),
      price_monthly: parseInt(state.monthPrice),
      opening_hours: times
    });
  };

  const timePickers = (weekdayString, show, dateVon, dateBis) => {
    return show ? (
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
          <KeyboardTimePicker
            ampm={false}
            margin="normal"
            label="Von"
            value={dateVon}
            onChange={date => {
              let temp = JSON.parse(JSON.stringify(state)); //needs to be a new object for React to recognize that the state has changed
              switch (weekdayString) {
                case "Montag":
                  temp.mondayVon = date;
                  break;
                case "Dienstag":
                  temp.tuesdayVon = date;
                  break;
                case "Mittwoch":
                  temp.wednesdayVon = date;
                  break;
                case "Donnerstag":
                  temp.thursdayVon = date;
                  break;
                case "Freitag":
                  temp.fridayVon = date;
                  break;
                case "Samstag":
                  temp.saturdayVon = date;
                  break;
                case "Sonntag":
                  temp.sundayVon = date;
                  break;
                default:
                  break;
              }
              setState(temp);
            }}
            KeyboardButtonProps={{
              "aria-label": "change time"
            }}
          />
          <KeyboardTimePicker
            ampm={false}
            margin="normal"
            label="Bis"
            value={dateBis}
            onChange={date => {
              let temp = JSON.parse(JSON.stringify(state)); //needs to be a new object for React to recognize that the state has changed
              switch (weekdayString) {
                case "Montag":
                  temp.mondayBis = date;
                  break;
                case "Dienstag":
                  temp.tuesdayBis = date;
                  break;
                case "Mittwoch":
                  temp.wednesdayBis = date;
                  break;
                case "Donnerstag":
                  temp.thursdayBis = date;
                  break;
                case "Freitag":
                  temp.fridayBis = date;
                  break;
                case "Samstag":
                  temp.saturdayBis = date;
                  break;
                case "Sonntag":
                  temp.sundayBis = date;
                  break;
                default:
                  break;
              }
              setState(temp);
            }}
            KeyboardButtonProps={{
              "aria-label": "change time"
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>
    ) : (
      <div></div>
    );
  };

  const checkBox = (weekdayString, bool) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={bool}
            onChange={ev => {
              let temp = JSON.parse(JSON.stringify(state)); //needs to be a new object for React to recognize that the state has changed
              switch (weekdayString) {
                case "Montag":
                  temp.monday = ev.target.checked;
                  break;
                case "Dienstag":
                  temp.tuesday = ev.target.checked;
                  break;
                case "Mittwoch":
                  temp.wednesday = ev.target.checked;
                  break;
                case "Donnerstag":
                  temp.thursday = ev.target.checked;
                  break;
                case "Freitag":
                  temp.friday = ev.target.checked;
                  break;
                case "Samstag":
                  temp.saturday = ev.target.checked;
                  break;
                case "Sonntag":
                  temp.sunday = ev.target.checked;
                  break;
                default:
                  break;
              }
              setState(temp);
            }}
            value="secondary"
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        }
        label={weekdayString}
        labelPlacement="end"
      />
    );
  };

  return (
    <Box marginLeft={2}>
      <Box>&ensp;</Box>
      <Box marginTop={-1.5}>
        <Typography>Preise</Typography>
      </Box>
      <Box display="flex" flexWrap="wrap">
        <Box marginTop={2} marginRight={1.5}>
          <TextField
            id="weeklyPrice"
            label="Preis pro Woche:"
            type="number"
            value={state.weekPrice}
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>
            }}
            onChange={event => {
              let temp = JSON.parse(JSON.stringify(state));
              temp.weekPrice = event.target.value;
              setState(temp);
            }}
          />
        </Box>
        <Box marginTop={2} marginRight={1.5}>
          <TextField
            id="monthlyPrice"
            label="Preis pro Monat:"
            type="number"
            value={state.monthPrice}
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>
            }}
            onChange={event => {
              let temp = JSON.parse(JSON.stringify(state));
              temp.monthPrice = event.target.value;
              setState(temp);
            }}
          />
        </Box>
      </Box>
      <div> &ensp; </div>
      <Typography>Öffnungszeiten</Typography>
      <Box>
        {checkBox("Montag", state.monday)}
        {timePickers("Montag", state.monday, state.mondayVon, state.mondayBis)}
      </Box>
      <Box>
        {checkBox("Dienstag", state.tuesday)}
        {timePickers(
          "Dienstag",
          state.tuesday,
          state.tuesdayVon,
          state.tuesdayBis
        )}
      </Box>
      <Box>
        {checkBox("Mittwoch", state.wednesday)}
        {timePickers(
          "Mittwoch",
          state.wednesday,
          state.wednesdayVon,
          state.wednesdayBis
        )}
      </Box>
      <Box>
        {checkBox("Donnerstag", state.thursday)}
        {timePickers(
          "Donnerstag",
          state.thursday,
          state.thursdayVon,
          state.thursdayBis
        )}
      </Box>
      <Box>
        {checkBox("Freitag", state.friday)}
        {timePickers("Freitag", state.friday, state.fridayVon, state.fridayBis)}
      </Box>
      <Box>
        {checkBox("Samstag", state.saturday)}
        {timePickers(
          "Samstag",
          state.saturday,
          state.saturdayVon,
          state.saturdayBis
        )}
        <Box>
          {checkBox("Sonntag", state.sunday)}
          {timePickers(
            "Sonntag",
            state.sunday,
            state.sundayVon,
            state.sundayBis
          )}
        </Box>
      </Box>
      <div> &ensp; </div>
      <Fab variant="extended" onClick={handleSave} color="primary">
        <SaveIcon />
        &ensp;Speichern
      </Fab>
      <div>&ensp;</div>
    </Box>
  );
}

export default React.memo(TimesAndPrices); //Memo prevents updating controlled by upper Classes
