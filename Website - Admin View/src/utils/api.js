import axios from "axios";
import baseURL from "../APIconfig";

/*
  API

  This class handles all the calls to the API and returns an object with a status and a message.
*/

export const CallTypes = {
  APPOINTMENTS: {
    RETURN: 0,
    RETURNMONTH: 1,
    RETURNDAY: 2,
    SENDREQUEST: 3
  },
  BIKES: {
    UPDATE: 4,
    DELETE: 5,
    INSERT: 6,
    RETURN: 7,
    RETURNAVAILABLE: 8
  },
  LOANS: {
    UPDATE: 9,
    UPDATESTATUS: 10,
    DELETE: 11,
    RETURN: 12,
    RETURNMONTH: 13
  },
  LOGIN: {
    LOGIN: 14,
    UPDATE: 15
  },
  REQUESTS: {
    UPDATE: 16,
    DELETE: 17,
    RETURN: 18,
    RETURNMONTH: 19,
    RETURNPENDING: 20
  },
  RESERVATIONS: {
    UPDATE: 21,
    DELETE: 22,
    RETURN: 23,
    RETURNMONTH: 24,
    RETURNPENDING: 25
  },
  COMMENTS: {
    RETURNBIKE: 26
  },
  TIMES: {
    BIKEUNAVAILABLE: 27
  },
  INFORMATIONS: {
    RETURN: 28,
    UPDATE: 29
  },
  NEWSLETTER: {
    RETURN: 30,
    DELETE: 31
  },
  CONTRACTS: {
    RETURN: 32,
    RETURNMONTH: 33
  }
};

export const API = axios.create({
  baseURL: baseURL
});

export function api(callType, callAfter, ...args) {
  let method;
  let url;
  let data;
  if (args.length === 0) args.push(1001337);
  if (args.length === 1) args.push(1001337);

  switch (callType) {
    case CallTypes.APPOINTMENTS.RETURN:
      method = "get";
      url =
        "/admin/api/v1/appointments/" + String(args[0]) + "/" + String(args[1]);
      break;
    case CallTypes.APPOINTMENTS.RETURNDAY:
      method = "get";
      url =
        "/admin/api/v1/timeAppointments/" +
        String(args[0]) +
        "/" +
        String(args[1]) +
        "/" +
        String(args[2]);
      break;
    case CallTypes.APPOINTMENTS.RETURNMONTH:
      if (args.length === 2) args.push(1001337);
      method = "get";
      url =
        "/admin/api/v1/timeAppointments/" +
        String(args[0]) +
        "/" +
        String(args[1]) +
        "/" +
        String(args[2]);
      break;
    case CallTypes.APPOINTMENTS.SENDREQUEST:
      method = "post";
      url = "/actions/api/v1/sendAppointmentRequest";
      data = args[0];
      break;
    case CallTypes.BIKES.DELETE:
      method = "delete";
      url = "admin/api/v1/bikes/" + String(args[0]);
      break;
    case CallTypes.BIKES.INSERT:
      method = "post";
      url = "admin/api/v1/newBikes";
      data = args[0];
      break;
    case CallTypes.BIKES.RETURN:
      method = "get";
      url = "admin/api/v1/bikes/" + String(args[0]);
      break;
    case CallTypes.BIKES.RETURNAVAILABLE:
      method = "get";
      url = "service/api/v1/availableBikes/1337";
      break;
    case CallTypes.BIKES.UPDATE:
      method = "put";
      url = "admin/api/v1/bikes/" + String(args[0]);
      data = args[1];
      break;
    case CallTypes.COMMENTS.RETURNBIKE:
      method = "get";
      url = "service/api/v1/comments/" + String(args[0]);
      break;
    case CallTypes.TIMES.BIKEUNAVAILABLE:
      method = "get";
      url = "service/api/v1/notAvailableBikes/" + String(args[0]);
      break;
    case CallTypes.LOANS.DELETE:
      method = "delete";
      url = "admin/api/v1/loans/" + String(args[0]);
      break;
    case CallTypes.LOANS.RETURN:
      method = "get";
      url = "admin/api/v1/loans/" + String(args[0]);
      break;
    case CallTypes.LOANS.RETURNMONTH:
      method = "get";
      url = "admin/api/v1/timeLoans/" + String(args[0]) + "/" + String(args[1]);
      break;
    case CallTypes.LOANS.UPDATE:
      method = "put";
      url = "admin/api/v1/requestedLoans/" + String(args[0]);
      data = args[1];
      break;
    case CallTypes.LOANS.UPDATESTATUS:
      method = "put";
      url = "admin/api/v1/loans/" + String(args[0]);
      data = args[1];
      break;
    case CallTypes.LOGIN.LOGIN:
      method = "post";
      url = "admin/api/v1/login";
      data = { email: args[0], password: args[1] };
      break;
    case CallTypes.LOGIN.UPDATE:
      method = "put";
      url = "admin/api/v1/registerAdmin";
      data = args[0];
      break;
    case CallTypes.REQUESTS.DELETE:
      method = "delete";
      url = "admin/api/v1/requestedAppointments/" + String(args[0]);
      break;
    case CallTypes.REQUESTS.RETURN:
      method = "get";
      url = "admin/api/v1/requestedAppointments/" + String(args[0]);
      break;
    case CallTypes.REQUESTS.RETURNMONTH:
      method = "get";
      url = "admin/api/v1/requestedAppointments/" + String(args[0]);
      break;
    case CallTypes.REQUESTS.RETURNPENDING:
      method = "get";
      url = "admin/api/v1/requestedAppointments/" + String(args[0]);
      break;
    case CallTypes.REQUESTS.UPDATE:
      method = "put";
      url = "admin/api/v1/requestedAppointments/" + String(args[0]);
      data = args[1];
      break;
    case CallTypes.RESERVATIONS.DELETE:
      method = "delete";
      url = "admin/api/v1/reservations/" + String(args[0]);
      break;
    case CallTypes.RESERVATIONS.RETURN:
      method = "get";
      url = "admin/api/v1/reservations/" + String(args[0]);
      break;
    case CallTypes.RESERVATIONS.RETURNMONTH:
      method = "get";
      url =
        "admin/api/v1/timeReservations/" +
        String(args[0]) +
        "/" +
        String(args[1]);
      break;
    case CallTypes.RESERVATIONS.RETURNPENDING:
      method = "get";
      url = "admin/api/v1/requestedReservations/" + String(args[0]);
      break;
    case CallTypes.RESERVATIONS.UPDATE:
      method = "put";
      url = "admin/api/v1/requestedReservations/" + String(args[0]);
      data = args[1];
      break;
    case CallTypes.INFORMATIONS.RETURN:
      method = "get";
      url = "admin/api/v1/informations";
      break;
    case CallTypes.INFORMATIONS.UPDATE:
      method = "post";
      url = "admin/api/v1/informations";
      data = args[0];
      break;
    case CallTypes.NEWSLETTER.RETURN:
      method = "get";
      url = "admin/api/v1/newsletterMails";
      break;
    case CallTypes.NEWSLETTER.DELETE:
      method = "delete";
      url = "admin/api/v1/newsletterMails";
      data = { id: 4, email: "t@t.de" };
      break;
    case CallTypes.CONTRACTS.RETURN:
      method = "get";
      url =
        "/admin/api/v1/contracts/" + String(args[0]) + "/" + String(args[1]);
      break;
    case CallTypes.CONTRACTS.RETURNMONTH:
      method = "get";
      url =
        "/admin/api/v1/timeContracts/" +
        String(args[0]) +
        "/" +
        String(args[1]) +
        "/" +
        String(args[2]) +
        "/" +
        String(args[3]);
      break;
    default:
      return { status: 0, message: "CallType does not exist" };
  }
  let returnValue = { status: 0, message: "" };
  // console.log(data);
  API({
    method: method,
    url: url,
    data: data
  })
    .then(res => {
      returnValue.status = res.status;
      returnValue.message = res.data;
      //console.log(res.data);
      callAfter(returnValue);
    })
    .catch(error => {
      // console.log(error);
      //console.log(error.response);
      try {
        returnValue.status = parseInt(error.response.status);
        switch (returnValue.status) {
          case 400:
            returnValue.message = "Invalide Eingabe";
            break;
          case 404:
            returnValue.message = "Eintrag wurde nicht gefunden.";
            break;
          case 500:
            returnValue.message = "Server Error";
            break;
          default:
            returnValue.message = "Unbekannter Error";
        }
      } catch {
        returnValue.status = -1;
        returnValue.message = "Keine Verbindung zur Datenbank.";
      }
      callAfter(returnValue);
    });
}
