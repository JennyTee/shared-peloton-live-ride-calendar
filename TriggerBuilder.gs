function buildDailyTrigger() {
 ScriptApp.newTrigger('updatePelotonLiveRideCalendar')
      .timeBased()
      .everyDays(1)
      .atHour(5)
      .create();
}