package com.raywenderlich.asta_velo;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class Start extends AppCompatActivity {
TextView openingHours;
TextView weekly_txt, monthly_txt;
Button information_button;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        Context mContext = getApplicationContext();


        //weekly_txt = (TextView) findViewById(R.id.price_weekly);
        //monthly_txt = (TextView) findViewById(R.id.price_monthly);
        //openingHours = (TextView) findViewById(R.id.opening_hours);
        information_button = (Button) findViewById(R.id.popup_information);
        //send Request to get the opening hours
        new HttpTask().execute("http://10.0.2.2:5000/admin/api/v1/informations\n");

        //PopupWindow pw = new PopupWindow(inflater.inflate(R.layout.popup_information, null, false),100,100, true);



        information_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(getApplicationContext(), PopActivity.class);
                startActivity(i);

                //pw.showAtLocation(this.findViewById(R.id.start), Gravity.CENTER, 0, 0);
            }
        });

        final Button appointmentButton = (Button) findViewById(R.id.appointmentButton);
        appointmentButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), Appointment.class);
                v.getContext().startActivity(intent);
            }
        });

        final Button rentBikeButton = (Button) findViewById(R.id.rentBikeButton);
        rentBikeButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), MainActivity.class);
                v.getContext().startActivity(intent);
            }
        });

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
            //Log.d("FAIL", result);
            //textView.setText(result);

            try {
                JSONObject jsonObject = new JSONObject(result);

                int price_weekly = jsonObject.getInt("price_weekly");
                int price_monthly = jsonObject.getInt("price_monthly");
                String opening_hours = jsonObject.getString("opening_hours");

                String[] split = opening_hours.split("###");
                String monday = split[0];
                String tuesday = split[1];
                String wendsday = split[2];
                String thursday = split[3];
                String friday = split[4];

                /*openingHours.setText("Öffnungszeiten: " +
                " Montag: " + monday+ " Dienstag: " + tuesday + " Mittwoch: " + wendsday + " Donnerstag: " + thursday + " Freitag: " + friday);

                weekly_txt.setText("Preis pro Woche: " + price_weekly);
                monthly_txt.setText("Preis pro Monat: " + price_monthly);*/

            } catch (JSONException e) {
                e.printStackTrace();
            }


        }
    }
}
