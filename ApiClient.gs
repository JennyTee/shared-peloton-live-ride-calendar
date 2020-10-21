var data;
var instructorList;
var classList;
//var query = '"Apps Script" stars:">=100"';
var url = 'https://api.onepeloton.com/api/v3/ride/live?exclude_complete=true&content_provider=studio&exclude_live_in_studio_only=true&browse_category=cycling&start=1602738000&end=1603947599';
  // + '&q=' + encodeURIComponent(query);

function updatePelotonLiveRideCalendar() {
  var existingEvents = getUpcomingPelotonCalendarEvents();
  Logger.log('There are ' + existingEvents.size + ' existing calendar events.');
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var json = response.getContentText();
  data = JSON.parse(json);
  
  instructorList = data.instructors;
  classList = data.rides;
  Logger.log('There are ' + classList.length + ' rides returned from the Peloton API, including Encore rides.');
  
  for (var i = 0; i < classList.length; i++) {
    var pelotonClass = classList[i];
    var hasMatchingCalendarEvent = existingEvents.has(pelotonClass.id);
    if (pelotonClass.original_air_time != null) {
      Logger.log(pelotonClass.title + ' is an Encore class.');
    } else if (hasMatchingCalendarEvent) {
      var existingEvent = existingEvents.get(pelotonClass.id);
      checkForEventUpdates(pelotonClass, existingEvent);
      Logger.log('ClassId ' + pelotonClass.id + ' already has a calendar event.');
      existingEvents.delete(pelotonClass.id);
    } else {
      createEvent(pelotonClass);
    }
  }
  
  if (existingEvents.size > 0) {
    Logger.log('One or more calendar events will be removed due to class cancellations.');
    var eventsToRemove = existingEvents.values();
    
    for(var i = 0; i < existingEvents.size; i++) {
      var eventToRemove = eventsToRemove.next().value;
      deleteEvent(eventToRemove.id);
    }
  }  
}