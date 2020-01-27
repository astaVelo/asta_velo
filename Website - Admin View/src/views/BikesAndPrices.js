import React from "react";
import classNames from "classnames";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui components
import Skeleton from "@material-ui/lab/Skeleton";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
// Header
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
// Others
import styles from "assets/jss/material-kit-react/views/components.js";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
// Own components
import { CallTypes, api } from "../utils/api.js";
import BikesComponent from "./Sections/BikesComponent";
import TimesAndPrices from "./Sections/TimesAndPrices";

/*
  BikesAndPrices

  This component displays the bikes, prices and opening hours.

  Uses: BikesComponent, TimesAndPrices
*/

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

let bcoa = false;
export default function BikesAndPrices(props) {
  function Media(props) {
    const { loading = false } = props;
    return (
      <Box marginLeft={1}>
        <Grid container wrap="wrap">
          {loading
            ? Array.from(new Array(6)).map((item, index) => (
                <Box key={index} width={210} marginRight={0.5} my={5}>
                  <Skeleton variant="rect" width={210} height={118} />
                  <Box pt={0.5}>
                    <Skeleton />
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </Box>
                </Box>
              ))
            : props.data
                .reverse()
                .map(item => <BikesComponent key={item.id} item={item} />)}
          {loading ? (
            <div></div>
          ) : (
            <Box
              display="flex"
              color="blue"
              height={600}
              width={180}
              justifyContent="center"
              alignItems="center"
              marginLeft={1}
              marginRight={1}
            >
              <Fab
                variant="extended"
                color="primary"
                aria-label="add"
                onClick={() => {
                  addNewBike();
                }}
              >
                <AddIcon />
                Neues Fahrrad
              </Fab>
            </Box>
          )}
        </Grid>
      </Box>
    );
  }
  Media.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.array
  };

  const classes = useStyles();
  const { ...rest } = props;
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

  const [mediaDisplay, setMediaDisplay] = React.useState(<Media loading />);

  const returnBikes = () => {
    api(
      CallTypes.BIKES.RETURN,
      res => {
        if (res.status === 200) {
          setMediaDisplay(<Media data={res.message} />);
        } else if (res.status === 404 || res.status === 400) {
          setMediaDisplay(<Media data={[]} />);
        }
      },
      1001337
    );
  };

  const addNewBike = () => {
    api(
      CallTypes.BIKES.INSERT,
      res => {
        if (res.status === 200) {
          returnBikes();
        }
      },
      {
        id: 0,
        inventory_number: "0",
        size: "",
        image_url:
          "https://images.pexels.com/photos/207779/pexels-photo-207779.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        number_of_gears: 0,
        type_of_breaks: "",
        available: true,
        number_of_loans: 0,
        type: "",
        information: ""
      }
    );
  };

  if (!bcoa) {
    bcoa = true;
    returnBikes();
  } else {
    bcoa = false;
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
          <div className={className}>{mediaDisplay}</div>
        </Box>
        <Box width={boxWidthRightBox} marginBottom={marginBotCorrection}>
          <div className={className}>
            <TimesAndPrices />
          </div>
        </Box>
      </Box>
    </div>
  );
}
