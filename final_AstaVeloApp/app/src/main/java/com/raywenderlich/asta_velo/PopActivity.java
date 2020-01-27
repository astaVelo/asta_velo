package com.raywenderlich.asta_velo;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class PopActivity extends AppCompatActivity {
    TextView openingHours;
    TextView weekly_txt, monthly_txt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pop);
        getSupportActionBar().hide();

        DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);

        int width = dm.widthPixels;
        int height = dm.heightPixels;

        getWindow().setLayout((int) (width*.8), (int) (height*.7));

        WindowManager.LayoutParams params = getWindow().getAttributes();
        params.gravity = Gravity.CENTER;
        params.x = 0;
        params.y = -20;

        getWindow().setAttributes(params);

        weekly_txt = (TextView) findViewById(R.id.weekly);
        monthly_txt = (TextView) findViewById(R.id.monthly);
        openingHours = (TextView) findViewById(R.id.hours);

        //Send Get Information Request
        new HttpTask().execute("http://10.0.2.2:5000/admin/api/v1/informations\n");

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

                String monday = "Montag: " + split[0];
                String tuesday = "Dienstag: " + split[1];
                String wendsday = "Mittwoch: " + split[2];
                String thursday = "Donnerstag: " + split[3];
                String friday = "Freitag: " + split[4];

                if(monday.equals("Montag: 0:0-0:0")){
                    monday = " ";
                }
                if(tuesday.equals("Dienstag: 0:0-0:0")){
                    tuesday = " ";
                }
                if(wendsday.equals("Mittwoch: 0:0-0:0")){
                    wendsday = " ";
                }
                if(thursday.equals("Donnerstag: 0:0-0:0")){
                    thursday = " ";

                }if(friday.equals("Freitag: 0:0-0:0")){
                    friday = " ";
                }


                openingHours.setText("Öffnungszeiten: " + monday+  tuesday + wendsday + thursday + friday);

                weekly_txt.setText("Preis pro Woche: " + price_weekly);
                monthly_txt.setText("Preis pro Monat: " + price_monthly);

            } catch (JSONException e) {
                e.printStackTrace();
            }


        }
    }
}
