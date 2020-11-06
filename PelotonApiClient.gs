var data;
var instructorList;
var instructorHashMap;
var classList;
var encoreClassData;
var encoreHashMap;
var addedClassCount = 0;
var removedClassCount = 0;
var updatedClassCount = 0;

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
  var existingEventCount = existingEvents.size;
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var json = response.getContentText();
  data = JSON.parse(json);
  
  instructorList = data.instructors;
  instructorHashMap = new Map(instructorList.map(i => [i.id, i]));
  classList = data.rides;
  encoreClassData = data.data;
  encoreHashMap = new Map(encoreClassData.map(i => [i.ride_id, i]));
    
  for (var i = 0; i < classList.length; i++) {
    var pelotonClass = classList[i];
    var classData = encoreHashMap.get(pelotonClass.id);
    if (processedClasses.has(pelotonClass.id)) {
      continue;
    }
    
    processedClasses.add(pelotonClass.id);
    var hasMatchingCalendarEvent = existingEvents.has(pelotonClass.id);
    // The actual class start time is located inside of the Data object
    var actualStartTime = classData.scheduled_start_time;

    if (hasMatchingCalendarEvent) {
      var existingEvent = existingEvents.get(pelotonClass.id);
      checkForEventUpdates(pelotonClass, existingEvent, actualStartTime, classData.is_encore);
      existingEvents.delete(pelotonClass.id);
    } else {
      var createdEvent = createEvent(pelotonClass, actualStartTime, classData.is_encore);
      addedClassCount++;
      logCreatedEvent(createdEvent);
    }
  }
  
  if (existingEvents.size > 0) {
    var eventsToRemove = existingEvents.values();
    
    for(var i = 0; i < existingEvents.size; i++) {
      var eventToRemove = eventsToRemove.next().value;
      deleteEventById(eventToRemove.id);
      removedClassCount++;
      logDeletedEvent(eventToRemove);
    }
  } 
  
  logScriptRun(existingEventCount, classList.length, addedClassCount, removedClassCount, updatedClassCount);
}

function getInstructorName(instructorId) {
  var instructor = instructorHashMap.get(instructorId);
  if (!!instructor) {
    return `${instructor.first_name} ${instructor.last_name}`;
  }
  return '';
}