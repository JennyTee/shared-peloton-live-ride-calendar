var data;
var instructorList;
var classList;
var encoreClassData;
// If you don't round the queryStartTime, the API only returns about half of the results
var queryStartTime = Math.round(Date.now() / 1000);
// Get end time 13 days in future - the API is finnicky about start/end times passed in and will
// not return all results if it gets unexpected start/end dates
var queryEndTime = queryStartTime + 1213199;
var url = `https://api.onepeloton.com/api/v3/ride/live?exclude_complete=true&content_provider=`
  + `studio&exclude_live_in_studio_only=true&browse_category=cycling&start=${queryStartTime}&end=${queryEndTime}`;

function updatePelotonLiveRideCalendar() {
  // Need to track processed classes since Peloton API sometimes returns duplicate objects
  var processedClasses = new Set();
  var existingEvents = getUpcomingPelotonCalendarEvents();
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var json = response.getContentText();
  data = JSON.parse(json);
  
  instructorList = data.instructors;
  classList = data.rides;
  encoreClassData = data.data;
  
  logScriptRun(existingEvents.size, classList.length);
  
  for (var i = 0; i < classList.length; i++) {
    var encoreClassStartTime = null;
    var pelotonClass = classList[i];
    if (processedClasses.has(pelotonClass.id)) {
      continue;
    }
    
    processedClasses.add(pelotonClass.id);
    var hasMatchingCalendarEvent = existingEvents.has(pelotonClass.id);
    var isEncore = pelotonClass.original_air_time != null;
    
    if (isEncore) {
      encoreClassStartTime = getMatchingEncoreClassStartTime(pelotonClass.id);
    }

    if (hasMatchingCalendarEvent) {
      var existingEvent = existingEvents.get(pelotonClass.id);
      checkForEventUpdates(pelotonClass, existingEvent, encoreClassStartTime);
      existingEvents.delete(pelotonClass.id);
    } else {
      var createdEvent = createEvent(pelotonClass, encoreClassStartTime);
      logCreatedEvent(createdEvent);
    }
  }
  
  if (existingEvents.size > 0) {
    var eventsToRemove = existingEvents.values();
    
    for(var i = 0; i < existingEvents.size; i++) {
      var eventToRemove = eventsToRemove.next().value;
      deleteEventById(eventToRemove.id);
      logDeletedEvent(eventToRemove);
    }
  }  
}