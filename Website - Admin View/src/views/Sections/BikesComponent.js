import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import PropTypes from "prop-types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Fab from "@material-ui/core/Fab";
import { CallTypes, api } from "../../utils/api.js";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InfoIcon from "@material-ui/icons/Info";

/*
  BikesComponent

  This component displays a bike and its information.

  Used by: BikesAndPrices
*/

BikesComponent.propTypes = {
  id: PropTypes.number,
  item: PropTypes.object
};

export default function BikesComponent(props) {
  let item = props.item;
  let id = props.id;

  const [deleted, setDeleted] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [comments, setComments] = React.useState(
    <Box>Keine Kommentare für dieses Fahrrad.</Box>
  );
  const [reservationTimes, setReservationTimes] = React.useState("/");

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  const bikeId = item ? item.id : -1;
  const [inventoryNumber, setInventoryNumber] = React.useState(
    item ? item.inventory_number : 0
  );
  const [available, setAvailable] = React.useState(
    item ? item.available : false
  );
  const [size, setSize] = React.useState(item ? item.size : "");
  const [gears, setGears] = React.useState(item ? item.number_of_gears : 1);
  const [breaks, setBreaks] = React.useState(item ? item.type_of_breaks : "");
  const [type, setType] = React.useState(item ? item.type : "");
  const [additionalInfo, setAdditionalInfo] = React.useState(
    item ? item.information : ""
  );

  const [picture, setPicture] = React.useState(
    item ? item.image_url : undefined
  );

  const handleClickOpen = () => () => {
    setOpen(true);
    api(
      CallTypes.COMMENTS.RETURNBIKE,
      res => {
        if (res.status === 200) {
          let array = [];
          for (let i = 0; i < res.message.length; i++) {
            array.push(
              <Box display="flex" flexWrap="wrap" key={i}>
                <Box fontWeight="fontWeightMedium">
                  {res.message[i].email}:&ensp;
                </Box>
                <Box>{res.message[i].comment}</Box>
              </Box>
            );
          }
          setComments(array);
        }
      },
      bikeId
    );

    api(
      CallTypes.TIMES.BIKEUNAVAILABLE,
      res => {
        if (res.status === 200) {
          let array = [];
          for (let i = 0; i < res.message.length; i++) {
            array.push(
              <Box display="flex" flexWrap="wrap" key={i}>
                <Box>
                  {res.message[i].start_date}&ensp;-&ensp;
                  {res.message[i].end_date}
                </Box>
              </Box>
            );
          }
          if (array.length === 0) array.push(<Box>/</Box>);
          setReservationTimes(array);
        }
      },
      bikeId
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    api(
      CallTypes.BIKES.DELETE,
      res => {
        if (res.status === 200) {
          setDeleted(true);
        }
      },
      bikeId
    );
  };
  const handleSave = () => {
    api(CallTypes.BIKES.UPDATE, () => {}, bikeId, {
      id: bikeId,
      inventory_number: inventoryNumber,
      size: size,
      image_url: picture,
      number_of_gears: gears,
      type_of_breaks: breaks,
      available: available,
      number_of_loans: item.number_of_loans,
      type: type,
      information: additionalInfo
    });
  };

  const marks = [
    {
      value: 1,
      label: "1"
    },
    {
      value: 3,
      label: "3"
    },
    {
      value: 7,
      label: "7"
    },
    {
      value: 18,
      label: "18"
    },
    {
      value: 21,
      label: "21"
    },
    {
      value: 24,
      label: "24"
    },
    {
      value: 27,
      label: "27"
    }
  ];

  if (deleted) {
    return null;
  }
  return (
    <Box key={id} width={210} marginRight={0.5} my={1} marginBottom={2}>
      <img
        style={{ width: 200, height: 150 }}
        alt="Bild hinzufügen"
        src={picture}
        onClick={() => {
          const newUrl = prompt("Gib eine URL für das neue Bild ein:");
          if (newUrl !== "" && newUrl != null) setPicture(newUrl);
        }}
      />
      <Box pr={2}>
        <TextField
          label="Typ"
          defaultValue={type}
          onChange={ev => {
            setType(ev.target.value);
          }}
        />
        <TextField
          label="Inventarnummer"
          defaultValue={inventoryNumber}
          type="number"
          onChange={ev => {
            setInventoryNumber(ev.target.value);
          }}
        />
        <TextField
          label="Größe"
          defaultValue={size}
          onChange={ev => {
            setSize(ev.target.value);
          }}
        />
        <div> &ensp; </div>
        <Typography>Anzahl der Gänge</Typography>
        <Slider
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          marks={marks}
          min={1}
          max={27}
          value={gears}
          onChange={(ev, newValue) => {
            setGears(newValue);
          }}
        />
        <TextField
          label="Bremstyp"
          defaultValue={breaks}
          onChange={ev => {
            setBreaks(ev.target.value);
          }}
        />
        <div>&ensp;</div>
        <TextField
          label="Sonstiges"
          multiline
          rows="4"
          defaultValue={additionalInfo}
          variant="outlined"
          onChange={ev => {
            setAdditionalInfo(ev.target.value);
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={available}
              onChange={event => {
                setAvailable(event.target.checked);
              }}
              value="available"
              color="primary"
            />
          }
          label="Verfügbar"
        />
        &ensp; &ensp;
        <Fab variant="extended" onClick={handleSave} color="primary">
          <SaveIcon />
        </Fab>
        &ensp;
        <Fab
          variant="extended"
          onClick={e => {
            if (
              window.confirm(
                "Soll dieses Fahrrad wirklich unwiderruflich entfernt werden?"
              )
            )
              handleDelete(e);
          }}
          color="secondary"
        >
          <DeleteIcon />
        </Fab>
        &ensp;
        <Fab variant="extended" onClick={handleClickOpen()}>
          <InfoIcon />
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle>
            Vertragszeiten und Kommentare: [{bikeId}]{type}
          </DialogTitle>
          <DialogContent>
            <Box fontSize={20} fontWeight="fontWeightRegular">
              Nicht verfügbar zu folgenden Zeiten:
            </Box>
            <Box>{reservationTimes}</Box>
            <Box fontSize={20} fontWeight="fontWeightRegular">
              Kommentare:
            </Box>
            <Box>{comments}</Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
