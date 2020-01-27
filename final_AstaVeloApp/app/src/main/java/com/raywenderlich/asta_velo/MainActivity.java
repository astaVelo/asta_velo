/*
 * Copyright (c) 2016 Razeware LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package com.raywenderlich.asta_velo;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CheckedTextView;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

  EditText firstnameField;
  EditText lastnameField;
  EditText startdate;
  EditText starttime;
  EditText enddate;
  EditText endtime;
  EditText email;
  List<Bike> bikes;
  EditText phone;
  String my_startdate;
  String my_starttime;
  String my_enddate;
  String my_endtime;
  String my_email;
  String my_firstname;
  String my_lastname;
  String my_phone;
  String availableBikeString;
  List<Integer> favoritedBookNames;
  TextView textView;
  CheckedTextView checkedTextView;
  CheckBox check;
  JSONArray availableBikes;
  private static final String favoritedBookNamesKey = "favoritedBookNamesKey";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    sendGetAllAvailableBikesRequest();
    bikes = new ArrayList<Bike>();

    firstnameField = (EditText) findViewById(R.id.editText_firstname2);
    lastnameField = (EditText) findViewById(R.id.editText_lastname2);
    startdate = (EditText) findViewById(R.id.editText_startdate2);
    starttime = (EditText) findViewById(R.id.editText_starttime2);
    enddate = (EditText) findViewById(R.id.editText_enddate2);
    endtime = (EditText) findViewById(R.id.editText_endtime2);
    email = (EditText) findViewById(R.id.editText_mail2);
    phone = (EditText) findViewById(R.id.editText_phone2);
    //checkedTextView = (CheckedTextView) findViewById(R.id.checkedText);
    check = (CheckBox) findViewById(R.id.checkBox);

    final Button rentFinishButton = (Button) findViewById(R.id.rentDoneButton);
    rentFinishButton.setOnClickListener(new View.OnClickListener() {
      public void onClick(View v) {
        if (TextUtils.isEmpty(firstnameField.getText().toString()) || TextUtils.isEmpty(lastnameField.getText().toString()) || TextUtils.isEmpty(startdate.getText().toString()) || TextUtils.isEmpty(starttime.getText().toString()) || TextUtils.isEmpty(enddate.getText().toString()) || TextUtils.isEmpty(endtime.getText().toString()) || TextUtils.isEmpty(email.getText().toString())) {
          Toast.makeText(MainActivity.this, "Bitte alle Felder mit * ausfüllen", Toast.LENGTH_SHORT).show();
        } else {

          //send Reservation Request
          my_startdate = startdate.getText().toString();
          my_starttime = starttime.getText().toString();
          my_enddate = enddate.getText().toString();
          my_endtime = endtime.getText().toString();
          my_email = email.getText().toString();
          my_firstname = firstnameField.getText().toString();
          my_lastname = lastnameField.getText().toString();
          my_phone = phone.getText().toString();


            favoritedBookNames = new ArrayList<>();
            //my_phone = phone.getText().toString();
            for (Bike bike : bikes) {
                if (bike.isFavorite()) {
                    favoritedBookNames.add(bike.getId());
                }
            }
            availableBikeString = TextUtils.join("###",favoritedBookNames);

            if(check.isChecked()){
                //TODO send Newsletter Request
                Log.d("TEST", "checkbox was checked");
                new HttpTaskPostNewsletter().execute("http://10.0.2.2:5000/actions/api/v1/sendNewsletterRequest\n");
            }

          //send Reservation Request
          new HttpTaskPostReservation().execute("http://10.0.2.2:5000/actions/api/v1/sendReservationRequest\n");

          new HttpTaskPostAppointment().execute("http://10.0.2.2:5000/actions/api/v1/sendAppointmentRequest");

        }
      }
    });



    //Gridview add new view for each available bike
  GridView gridView = (GridView)findViewById(R.id.gridview);
    final BikesAdapter bikesAdapter = new BikesAdapter(this, bikes);
    gridView.setAdapter(bikesAdapter);

    gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
      @Override
      public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        Bike bike = bikes.get(position);
        bike.toggleFavorite();
        bikesAdapter.notifyDataSetChanged();
      }
    });
  }

    private class HttpTaskPostNewsletter extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... strURLs) {
            URL url = null;
            HttpURLConnection conn = null;
            try {
                url = new URL(strURLs[0]);

                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setRequestProperty("Accept", "application/json");
                conn.setDoInput(true);
                conn.setDoOutput(true);

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", 0);
                jsonObject.put("email", my_email);

                Log.d("JSON", jsonObject.toString());


                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = jsonObject.toString().getBytes("utf-8");
                    os.write(input, 0, input.length);
                    os.flush();
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                int responseCode = conn.getResponseCode();

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    //startNewActivity();
                    Log.d("TAG", "Newsletter request send!");
                }

            } catch (JSONException e) {
                e.printStackTrace();
                return "Unable to connect";
            } catch (ProtocolException e) {
                e.printStackTrace();
                return "Unable to connect";

            } catch (MalformedURLException e) {
                e.printStackTrace();
                return "Unable to connect";

            } catch (IOException e) {
                e.printStackTrace();
                return "Unable to connect";

            }

            return "null";
        }
    }

  private class HttpTaskPostReservation extends AsyncTask<String, Void, String> {
    @Override
    protected String doInBackground(String... strURLs) {
      URL url = null;
      HttpURLConnection conn = null;
      try {
        url = new URL(strURLs[0]);

        conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoInput(true);
        conn.setDoOutput(true);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", 0);
        jsonObject.put("date_from", my_startdate + "." + my_starttime);
        jsonObject.put("date_to", my_enddate + "." + my_endtime);
        jsonObject.put("bike_ids", availableBikeString);
          jsonObject.put("confirmed", false);
          jsonObject.put("email", my_email);


        Log.d("JSON", jsonObject.toString());


        try (OutputStream os = conn.getOutputStream()) {
          byte[] input = jsonObject.toString().getBytes("utf-8");
          os.write(input, 0, input.length);
          os.flush();
        } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
        } catch (IOException e) {
          e.printStackTrace();
        }

        int responseCode = conn.getResponseCode();

        if (responseCode == HttpURLConnection.HTTP_OK) {
            //startNewActivity();
            Log.d("TAG", "Reservation request send!");
        }

      } catch (JSONException e) {
        e.printStackTrace();
        return "Unable to connect";
      } catch (ProtocolException e) {
        e.printStackTrace();
        return "Unable to connect";

      } catch (MalformedURLException e) {
        e.printStackTrace();
        return "Unable to connect";

      } catch (IOException e) {
        e.printStackTrace();
        return "Unable to connect";

      }

      return "null";
    }
  }

  private void sendGetAllAvailableBikesRequest() {
    new HttpTask().execute("http://10.0.2.2:5000/service/api/v1/availableBikes/1337");

  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);




    outState.putIntegerArrayList(favoritedBookNamesKey, (ArrayList)favoritedBookNames);
  }

  @Override
  protected void onRestoreInstanceState(Bundle savedInstanceState) {
    super.onRestoreInstanceState(savedInstanceState);

    final List<Integer> favoritedBikeNames =
      savedInstanceState.getIntegerArrayList(favoritedBookNamesKey);

    // warning: typically you should avoid n^2 loops like this, use a Map instead.
    // I'm keeping this because it is more straightforward
    for (int bookName : favoritedBikeNames) {
      for (Bike bike : bikes) {
        if (bike.getId() == bookName) {
          bike.setFavorite(true);
          break;
        }
      }
    }
  }



  private class HttpTask extends AsyncTask<String, Void, String> {
    @Override
    protected String doInBackground(String... strURLs) {
      URL url = null;
      HttpURLConnection conn = null;
      try {
        url = new URL(strURLs[0]);
        conn = (HttpURLConnection) url.openConnection();
        int responseCode = conn.getResponseCode();

        if (responseCode == HttpURLConnection.HTTP_OK) {

          InputStream in = url.openStream();
          BufferedReader reader = new BufferedReader(new InputStreamReader(in));
          StringBuilder result = new StringBuilder();
          String line;
          while ((line = reader.readLine()) != null) {
            result.append(line);
          }
          Log.d("CORRECT", result.toString().replace("/N/", System.getProperty("line.separator")));
          return result.toString().replace("/N/", System.getProperty("line.separator"));
        } else {
          Log.d("FAIL", " " + responseCode);
          return "Fail (" + responseCode + ")";
        }
      } catch (IOException e) {
        Log.e("Error", String.valueOf(e.fillInStackTrace()));
        return "Unable to connect";
      }
    }

    @Override
    protected void onPostExecute(String result) {
      Log.d("FAIL", result);
      //textView.setText(result);

      try {
        availableBikes = new JSONArray(result);

        ArrayList<String> listdata = new ArrayList<String>();
        JSONArray jArray = (JSONArray) availableBikes;
        if (jArray != null) {
          for (int i = 0; i < jArray.length(); i++) {
            listdata.add(jArray.getString(i));
            JSONObject jsonObject = jArray.getJSONObject(i);
            //JSONObject json = jArray.getJSONObject(i).getJSONObject("id");
            //int id = jArray.getJSONObject(i).getInt("id");
            //Log.d("TEST", "" + id);
            Bike bike = new Bike(jsonObject.getInt("id"), jsonObject.getInt("size"), jsonObject.getString("image_url"), jsonObject.getInt("number_of_gears"), jsonObject.getString("type_of_breaks"), jsonObject.getBoolean("available"),
                    jsonObject.getInt("number_of_loans"), jsonObject.getString("type"), jsonObject.getInt("inventory_number"), jsonObject.getString("information"));
            bikes.add(bike);
          }
        }
        //textView.setText(result);

      } catch (JSONException e) {
        e.printStackTrace();
      }


    }
  }

    private class HttpTaskPostAppointment extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... strURLs) {
            URL url = null;
            HttpURLConnection conn = null;
            try {
                url = new URL(strURLs[0]);
                //conn = (HttpURLConnection) url.openConnection();
                //URL url = new URL("http://10.0.2.2:5000/actions/api/v1/sendAppointmentRequest");
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setRequestProperty("Accept", "application/json");
                conn.setDoInput(true);
                conn.setDoOutput(true);

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", 0);
                jsonObject.put("date_time", my_startdate + "." + my_starttime);
                jsonObject.put("confirmed", false);
                jsonObject.put("type", "pickup");
                //TODO
                jsonObject.put("reservation_id", 0);
                jsonObject.put("loan_id", 0);

                jsonObject.put("start_date", my_startdate + "." + my_starttime);
                jsonObject.put("end_date", my_enddate + "." + my_endtime);
                jsonObject.put("loan_duration", 0);
                jsonObject.put("price", 0);
                jsonObject.put("status", "pending");
                jsonObject.put("email", my_email);
                jsonObject.put("bike_ids", availableBikeString);
                jsonObject.put("first_name", my_firstname);
                jsonObject.put("last_name", my_lastname);
                jsonObject.put("phone_number", my_phone);
                jsonObject.put("deposit", 60);
                jsonObject.put("number_of_bikes", availableBikes.length());
                jsonObject.put("birthday", "test");
                jsonObject.put("street", "test");
                jsonObject.put("location", "test");

                Log.d("JSON", jsonObject.toString());


                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = jsonObject.toString().getBytes("utf-8");
                    os.write(input, 0, input.length);
                    os.flush();
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                int responseCode = conn.getResponseCode();

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    startNewActivity();
                }

            } catch (JSONException e) {
                e.printStackTrace();
                return "Unable to connect";
            } catch (ProtocolException e) {
                e.printStackTrace();
                return "Unable to connect";

            } catch (MalformedURLException e) {
                e.printStackTrace();
                return "Unable to connect";

            } catch (IOException e) {
                e.printStackTrace();
                return "Unable to connect";

            }

            return "null";
        }
    }

  private void startNewActivity() {
    Intent intent = new Intent(this.getApplicationContext(), Finish.class);
    this.getApplicationContext().startActivity(intent);
  }

}
