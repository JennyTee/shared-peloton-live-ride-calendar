var data;
var instructorList;
var classList;
var encoreClassData;
var queryStartTime = Math.round(Date.now() / 1000);
// get end time 13 days in future
var queryEndTime = queryStartTime + 1213199;
var url = `https://api.onepeloton.com/api/v3/ride/live?exclude_complete=true&content_provider=studio&exclude_live_in_studio_only=true&browse_category=cycling&start=${queryStartTime}&end=${queryEndTime}`;

function updatePelotonLiveRideCalendar() {
  var existingEvents = getUpcomingPelotonCalendarEvents();
  Logger.log('There are ' + existingEvents.size + ' existing calendar events.');
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var json = response.getContentText();
  data = JSON.parse(json);
  
  instructorList = data.instructors;
  classList = data.rides;
  encoreClassData = data.data;
  
  Logger.log('There are ' + classList.length + ' rides returned from the Peloton API, including Encore rides.');
  
  for (var i = 0; i < classList.length; i++) {
    var encoreClassStartTime = null;
    var pelotonClass = classList[i];
    var hasMatchingCalendarEvent = existingEvents.has(pelotonClass.id);
    var isEncore = pelotonClass.original_air_time != null;
    
    if (isEncore) {
      Logger.log(pelotonClass.title + ' is an Encore class.');
      encoreClassStartTime = getMatchingEncoreClassStartTime(pelotonClass.id);
    }

    if (hasMatchingCalendarEvent) {
      var existingEvent = existingEvents.get(pelotonClass.id);
      checkForEventUpdates(pelotonClass, existingEvent, encoreClassStartTime);
      Logger.log('ClassId ' + pelotonClass.id + ' already has a calendar event.');
      existingEvents.delete(pelotonClass.id);
    } else {
      createEvent(pelotonClass, encoreClassStartTime);
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