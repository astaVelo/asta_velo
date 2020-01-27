package com.raywenderlich.asta_velo;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class Finish extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_finish);

        final Button appointmentBackButton = (Button) findViewById(R.id.appointmentBack);
        appointmentBackButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), Start.class);
                v.getContext().startActivity(intent);
            }
        });
    }
}
