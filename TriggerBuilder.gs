/*
SUGGESTION: select and run one of the options below to set up a trigger that will determine how often
the script runs to update the Google calendar.

Reference documentation: https://developers.google.com/apps-script/reference/script/clock-trigger-builder
*/

// Sets up the script to run during the hour specified (24-hour format).
// For example, if hour = 5, the script will run daily sometime between 5-6am.
function buildDailyTrigger() {
 let hour = 5;
 ScriptApp.newTrigger('updatePelotonLiveRideCalendar')
      .timeBased()
      .everyDays(1)
      .atHour(hour)
      .create();
}

function buildHourlyTrigger() {
  // Sets up the script to run every x hours.
  // For example, if freqeuncyInHours = 1, the script will run every hour.
  let freqeuncyInHours = 1;
  ScriptApp.newTrigger('updatePelotonLiveRideCalendar')
    .timeBased()
    .everyHours(freqeuncyInHours)    
    .create();
}

function buildMinuteTrigger() {
  // Sets up the script to run every x minutes.
  // For example, if freqencyInMinutes = 30, the script will run every 30 minutes.
  let freqencyInMinutes = 30;
  ScriptApp.newTrigger('updatePelotonLiveRideCalendar')
    .timeBased()
    .everyMinutes(freqencyInMinutes)
    .create();
}

