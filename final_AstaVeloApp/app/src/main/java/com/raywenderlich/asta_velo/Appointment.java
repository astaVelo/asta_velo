package com.raywenderlich.asta_velo;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

public class Appointment extends AppCompatActivity {

    EditText firstnameField;
    EditText lastnameField;
    EditText date;
    EditText time;
    EditText email;
    EditText phone;
    String my_date;
    String my_email;
    String my_firstname;
    String my_lastname;
    String my_phone;
    String my_time;
    CheckBox check;

    HttpURLConnection conn;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_appointment);

        firstnameField = (EditText) findViewById(R.id.editText_firstname);
        lastnameField = (EditText) findViewById(R.id.editText_lastname);
        date = (EditText) findViewById(R.id.editText_date);
        time = (EditText) findViewById(R.id.editText_time);
        email = (EditText) findViewById(R.id.editText_mail);
        EditText massage = (EditText) findViewById(R.id.editText_massage2);
        check = (CheckBox) findViewById(R.id.checkBox2);
        phone = (EditText) findViewById(R.id.editText_phone);


       //phone.setText("01839");
        final Button appointmentFinishButton = (Button) findViewById(R.id.appointmentFinishButton);
        appointmentFinishButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (TextUtils.isEmpty(firstnameField.getText().toString()) || TextUtils.isEmpty(lastnameField.getText().toString()) || TextUtils.isEmpty(date.getText().toString()) || TextUtils.isEmpty(time.getText().toString()) || TextUtils.isEmpty(email.getText().toString())) {
                    Toast.makeText(Appointment.this, "Bitte alle Felder mit * ausfüllen", Toast.LENGTH_SHORT).show();
                } else {
                    my_date = date.getText().toString();
                    my_email = email.getText().toString();
                    my_firstname = firstnameField.getText().toString();
                    my_lastname = lastnameField.getText().toString();
                    my_phone = phone.getText().toString();
                    my_time = time.getText().toString();

                    new HttpTask().execute("http://10.0.2.2:5000/actions/api/v1/sendAppointmentRequest");

                    if(check.isChecked()){
                        Log.d("TEST", "checkbox was checked");
                        new HttpTaskPostNewsletter().execute("http://10.0.2.2:5000/actions/api/v1/sendNewsletterRequest\n");
                    }
                }
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


    private class HttpTask extends AsyncTask<String, Void, String> {
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
                jsonObject.put("date_time", my_date + "." + my_time);
                jsonObject.put("confirmed", false);
                jsonObject.put("type", "pickup");
                //TODO
                jsonObject.put("reservation_id", 0);
                jsonObject.put("loan_id", 0);

                jsonObject.put("start_date", "01.01.10.01:01");
                jsonObject.put("end_date", "01.01.10.01:01");
                jsonObject.put("loan_duration", 0);
                jsonObject.put("price", 0);
                jsonObject.put("status", "test");
                jsonObject.put("email", my_email);
                jsonObject.put("bike_ids", "0###0");
                jsonObject.put("first_name", my_firstname);
                jsonObject.put("last_name", my_lastname);
                jsonObject.put("phone_number", my_phone);
                jsonObject.put("deposit", 60);
                jsonObject.put("number_of_bikes", 0);
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

