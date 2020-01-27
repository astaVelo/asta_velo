Software Engineering WS19/20
project15

AsTA Velo Admin Interface

You can view the website on https://lh1221002.github.io/AsTAVelo-AdminInterface/ //Change URL.

###Building locally:

To start it locally you need to have yarn installed (npm should work too but we do not guarantee for it). 
Build it with yarn (npm build). 
Run it with yarn start (npm start).

###Deployment:

First step: Go to \Website - Admin View\src and open APIconfig.js with any text editor. There, type in the URL to the deployed API.

For a more detailed description and more options see https://create-react-app.dev/docs/deployment .

We recommend to use GitHub Pages (free) with our provided setup:

run ‘yarn run build’
run ‘yarn run deploy’

For adding a custom domain see https://help.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site
or
https://medium.com/@hossainkhan/using-custom-domain-for-github-pages-86b303d3918a.

###Usage:
The following descriptions assume that one is already logged in (on welcome screen, type in email and password of an existing admin entry in the database and click ‘Login’).

#View Appointments: 
Month View: Click on ‘Terminplan’
Day View: Click on ‘Terminplan’→ Click on ‘Tag’ at the top right of the calendar
#Confirming an Appointment/Reservation:
New Requests: Click on ‘Terminplan’→ Click on ✓ or X on the specific appointment or reservation on the right hand side
Old Requests: Click on ‘Verlauf’ → Click on ✓ or X on the specific appointment or reservation on the right hand side
#Adding a Loan from an appointment: Go to the day view of the calendar → click on the appointment belonging to the loan you want to add → fill out the form → click on ‘Speichern’
#Printing a contract: Follow above instructions on how to add a aloan from an appointment → click on ‘Drucken’
#View the income of a specific month: Go to history → Choose the month by clicking on ‘>’ or ‘<’
#Add a bike to the database: Go to ‘Fahrräder&Preise’ → click on ‘+ Neues Fahrrad’
#Change information of a bike: Go to ‘Fahrräder&Preise’ → fill out the form of the specific bike → click on ‘Speichern’
#Change prices: Go to ‘Fahrräder&Preise’ → fill out the form of the prices on the right hand side → click on ‘Speichern’
#Change opening hours: Go to ‘Fahrräder&Preise’ → fill out the form of opening hours on the right hand side → click on ‘Speichern’
#Change email or password: Go to ‘Einstellungen’ → fill out the form for emails and password → click on ‘Speichern’
#Get email list for the newsletter: Go to ‘Einstellungen’ → click ‘Emails kopieren’
