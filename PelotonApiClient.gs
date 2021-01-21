// Peloton Live Ride Calendar Script
// Version 1.3.0

// Update these variables before script execution, if desired
const emailForLogs = 'pelotontestcalendar@gmail.com';

// Do not update these variables
var data;
var instructorList;
var instructorHashMap;
var classList;
var classMetadata;
var addedClassCount = 0;
var removedClassCount = 0;
var updatedClassCount = 0;

// If you don't round the queryStartTime, the API only returns about half of the results
const queryStartTime = Math.round(Date.now() / 1000);

// Get end time 13 days in future - the API is finnicky about start/end times passed in and will not return all results if 
// it gets unexpected start/end dates.
const queryEndTime = queryStartTime + 1213199;

/* 
Update the classCategory variable below to change the script to find categories for any class. (And if you want the script 
to run for all class categories, remove &browse_category=${classCategory} from the url below.)

Class category options: 
  cycling, strength, yoga, meditation, cardio, stretching, outdoor, running, walking, bootcamp, bike_bootcamp

(The "bootcamp" category is tread bootcamp only. The "cycling" category does not include bike bootcamp.)
*/

//making classCategory null to get all categories in response
var classCategory = null;

const url = `https://api.onepeloton.com/api/v3/ride/live?exclude_complete=true&content_provider=`
  + `studio&exclude_live_in_studio_only=true${!!classCategory ? `&browse_category=${classCategory}` : null}`
  + `&start=${queryStartTime}&end=${queryEndTime}`;

function updatePelotonLiveRideCalendar() {
  // Need to track processed classes since Peloton API sometimes returns duplicate objects
  let existingEvents = getUpcomingPelotonCalendarEvents();
  const existingEventCount = existingEvents.size;
  const response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  const json = response.getContentText();
  data = JSON.parse(json);
  
  instructorList = data.instructors;
  instructorHashMap = new Map(instructorList.map(i => [i.id, i]));
  
  classList = data.rides;
  
  classMetadata = data.data;
  const pelotonClassCount = classMetadata.length;
    
  for (let i = 0; i < classMetadata.length; i++) {
    const pelotonClassMetadata = classMetadata[i];
    const rideId = pelotonClassMetadata.ride_id;
    const metadataId = pelotonClassMetadata.id;
    
    const classInfoIndex = classList.findIndex(c => c.id === rideId);
    const classInfo = classList.splice(classInfoIndex, 1)[0];
    
    // The actual class start time is located inside of the Data object
    const actualStartTime = pelotonClassMetadata.scheduled_start_time;

    const hasMatchingCalendarEvent = existingEvents.has(metadataId);
    if (hasMatchingCalendarEvent) {
      let existingEvent = existingEvents.get(metadataId);
      checkForEventUpdates(classInfo, existingEvent, actualStartTime, pelotonClassMetadata.is_encore, metadataId);
      existingEvents.delete(metadataId);
    } else {
      let createdEvent = createEvent(classInfo, actualStartTime, pelotonClassMetadata.is_encore, metadataId);
      addedClassCount++;
      logCreatedEvent(createdEvent);
    }    
  }
  
  if (existingEvents.size > 0) {
    let eventsToRemove = existingEvents.values();
    
    for(let i = 0; i < existingEvents.size; i++) {
      let eventToRemove = eventsToRemove.next().value;

      // Do not delete events that have already started
      if (eventToRemove.getStart() < new Date()) {
        continue;
      }

      deleteEventById(eventToRemove.id);
      removedClassCount++;
      logDeletedEvent(eventToRemove);
    }
  } 
  
  logScriptRun(existingEventCount, pelotonClassCount, addedClassCount, removedClassCount, updatedClassCount);
}

function getInstructorName(instructorId) {
  const instructor = instructorHashMap.get(instructorId);
  if (!!instructor) {
    if (!!instructor.last_name) {
      return `${instructor.first_name} ${instructor.last_name}`;
    } else {
    return `${instructor.first_name}`;
    }
  }
  return '';
}