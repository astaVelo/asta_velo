package com.raywenderlich.asta_velo;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
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

// Die Klasse wird nicht mehr gebracuht, aber ich trau mich nciht, sie zu loeschen
public class RentBike extends AppCompatActivity {
    EditText firstnameField;
    EditText lastnameField;
    EditText date;
    EditText time;
    EditText email;
    //EditText phone;
    String my_date;
    String my_email;
    String my_firstname;
    String my_lastname;
    String my_phone;
    String my_time;


    private static final String favoritedBookNamesKey = "favoritedBookNamesKey";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rent_bike);

        firstnameField = (EditText) findViewById(R.id.editText_firstname2);
        lastnameField = (EditText) findViewById(R.id.editText_lastname2);
        date = (EditText) findViewById(R.id.editText_date2);
        time = (EditText) findViewById(R.id.editText_time2);
        email = (EditText) findViewById(R.id.editText_mail2);
        /*EditText massage = (EditText) findViewById(R.id.editText_massage2);*/
        //phone = (EditText) findViewById(R.id.editText_phone2);

        final Button rentFinishButton = (Button) findViewById(R.id.rentDoneButton);
        rentFinishButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (TextUtils.isEmpty(firstnameField.getText().toString()) || TextUtils.isEmpty(lastnameField.getText().toString()) || TextUtils.isEmpty(date.getText().toString()) || TextUtils.isEmpty(time.getText().toString()) || TextUtils.isEmpty(email.getText().toString())) {
                    Toast.makeText(RentBike.this, "Bitte alle Felder mit * ausfüllen", Toast.LENGTH_SHORT).show();
                } else {

                    my_date = date.getText().toString();
                    my_email = email.getText().toString();
                    my_firstname = firstnameField.getText().toString();
                    my_lastname = lastnameField.getText().toString();
                    //my_phone = phone.getText().toString();
                    my_time = time.getText().toString();

                    //send Reservation Request
                    new HttpTask().execute("http://localhost:5000/actions/api/v1/sendReservationRequest\n");

                }
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
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                conn.setRequestProperty("Accept", "application/json");
                conn.setDoInput(true);
                conn.setDoOutput(true);

                JSONObject jsonObject = new JSONObject();
                jsonObject.put("id", 0);
                jsonObject.put("date_from", my_date + "." + my_time);
                jsonObject.put("date_to", false);
                jsonObject.put("bike_ids", "pickup");

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

       /* GridView gridView = (GridView)findViewById(R.id.gridview);
        final BikeAdapter bikeAdapter = new BikeAdapter(this,bikes);
        gridView.setAdapter(bikeAdapter);
        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Bike bike = bikes[position];
                bike.toggleFavorite();
                bikeAdapter.notifyDataSetChanged();
            }
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        final List<Integer> favoritedBookNames = new ArrayList<>();
        for (Bike bike : bikes) {
            if (bike.getIsFavorite()) {
                favoritedBookNames.add(bike.getId());
            }
        }

        outState.putIntegerArrayList(favoritedBookNamesKey, (ArrayList)favoritedBookNames);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);

        final List<Integer> favoritedBookNames =
                savedInstanceState.getIntegerArrayList(favoritedBookNamesKey);

        // warning: typically you should avoid n^2 loops like this, use a Map instead.
        // I'm keeping this because it is more straightforward
        for (int bikeId : favoritedBookNames) {
            for (Bike bike : bikes) {
                if (bike.getId() == bikeId) {
                    bike.setIsFavorite(true);
                    break;
                }
            }
        }
    }

         private Bike[] bikes = {  new Bike(int id, int inventory_number, int imageResource, int number_of_gears, boolean available, String imageUrl));

    private Bike[] bikes = {  new Bike(5,3,1,5,true,"www.teststring.de")};*/

    private void startNewActivity() {
        Intent intent = new Intent(this.getApplicationContext(), Finish.class);
        this.getApplicationContext().startActivity(intent);
    }
}
