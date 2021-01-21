// Peloton Live Ride Calendar Script
// Version 1.3.0

// Update these variables before script execution, if desired
const emailForLogs = 'pelotontestcalendar@gmail.com';
var testMode = true;

// Do not update these variables
var calendarId = 'primary';
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


function createEvent(ride, actualStartTime, isEncore, rideMetadataId) {
  const startTime = actualStartTime * 1000;
  const endTime = startTime + (ride.duration * 1000);
  
  const summary = buildEventSummary(ride, actualStartTime, isEncore);
  const instructorName = getInstructorName(ride.instructor_id);
  const classType = ride.fitness_discipline_display_name;
  let event = {
    summary: summary,
    location: instructorName,
    description: ride.description + '\n\nCompliments of the largest global Peloton community at https://www.reddit.com/r/pelotoncycle',
    start: {
      dateTime: new Date(startTime).toISOString()
    },
    end: {
      dateTime: new Date(endTime).toISOString()
    },
    colorId: isEncore ? 3 : 2,
    // Extended properties are not currently displayed in created calendar events. They are just metadata tags.
    extendedProperties: {
      shared: {
        classLength: ride.duration / 60,
        classId: ride.id,
        classType: classType,
        hasClosedCaptions: ride.has_closed_captions,
        instructor: getInstructorName(ride.instructor_id),
        metadataId: rideMetadataId
      }
    }
  };
  // Create event in main shared calendar
  event = Calendar.Events.insert(event, calendarId);
  Utilities.sleep(500);
  
  // Create event in instructor calendar
  const instructorCalendarId = !!groupCalendars ? groupCalendars.get(instructorName) : null;
  if (!!instructorCalendarId) {
    Utilities.sleep(500);
    Calendar.Events.insert(event, instructorCalendarId);
    Logger.log(`Added event to ${instructorName} calendar.`);
  }

  // Create event in category-specific calendar
  const categoryCalendarId = !!groupCalendars ? groupCalendars.get(classType.toLowerCase()) : null;
  if (!!categoryCalendarId) {
    Calendar.Events.insert(event, categoryCalendarId);
    Utilities.sleep(500);
    Logger.log(`Added event to ${classType.toLowerCase()} calendar.`);
  }

  // Also add cycling & bike bootcamp classes to shared cycling + bike bootcamp calendar
  if (classType.toLowerCase() === 'cycling' || classType.toLowerCase() === 'bike bootcamp') {
    const cyclingAndBikeBootcampCalendarId = !!groupCalendars ? groupCalendars.get('cycling + bike bootcamp') : null;
    if (!!cyclingAndBikeBootcampCalendarId) {
      Calendar.Events.insert(event, cyclingAndBikeBootcampCalendarId);
      Utilities.sleep(500);
      Logger.log(`Added event to cycling + bootcamp calendar.`);
    }
  }

  // Dreaming of the day this will happen...
  if (classType.toLowerCase() === 'stretching' || classType.toLowerCase() === 'outdoor') {
    const classUrl = `https://members.onepeloton.com/schedule/cycling?modal=scheduledClassDetails&liveId=${rideMetadataId}`;
    const message = `HOLY MOLY! A live (or encore) ${classType.toLowerCase()} class has been created. Check it out here: `;
    const subject = `Live ${classType.toLowerCase()} created`;

    MailApp.sendEmail(emailForLogs, subject, message);
  }
  
  return event;
}

function buildEventSummary(ride, actualStartTime, isEncore) {
  let foreignLanguageIndicator = '';
  // If rides are offered in other languages someday, this will need to be updated.
  if (ride.origin_locale == 'de-DE') {
    foreignLanguageIndicator = ' [German]';
  }
  const encoreIndicator = !!isEncore ? ' [Encore]' : '';
  const eventSummary = `${ride.title}${foreignLanguageIndicator}${encoreIndicator}`;
  return eventSummary;
}

function getUpcomingPelotonCalendarEvents() {
  let existingEvents = new Map();
  const now = new Date();
  const events = Calendar.Events.list(calendarId, {
    timeMin: now.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 500
  });
  if (events.items && events.items.length > 0) {
    for (let i = 0; i < events.items.length; i++) {
      let event = events.items[i];
      let extendedProperties = event.getExtendedProperties()
      if (!extendedProperties) { 
        continue;
      }
      let sharedExtendedProperties = extendedProperties.getShared();
      if (!!sharedExtendedProperties && sharedExtendedProperties.metadataId != null) {
        existingEvents.set(sharedExtendedProperties.metadataId, event);
      }
    }
  }
  return existingEvents;
}

function deleteEventById(eventId) {
  try {
    let event = CalendarApp.getCalendarById(calendarId).getEventById(eventId);
    const startTime = new Date(event.getStartTime());
    const endTime = new Date(startTime.getTime() + 1000);
    const instructorName = event.getLocation();
    
    // Delete shared calendar event
    event.deleteEvent();
    Logger.log('main calendar event deleted');
    Utilities.sleep(500);
    
    const instructorCalendarId = groupCalendars.get(instructorName);
    if (!!instructorCalendarId) {
      let matchingInstructorCalendarEvents = CalendarApp.getCalendarById(instructorCalendarId)
                                                        .getEvents(startTime, endTime, {});
      
      // Delete matching instructor calendar event
      if (!!matchingInstructorCalendarEvents && matchingInstructorCalendarEvents.length > 0) {
        matchingInstructorCalendarEvents[0].deleteEvent();
        Utilities.sleep(500);
        Logger.log('group calendar event deleted.');
      } 
    }
  } catch(e) {
    logError(e);
  }
}

// Deletes all existing events in the main shared Google calendar AND instructor-specific calendars.
// Only use if you really want to delete all existing events!
// You may have to run this more than once--it seems to time out if there are many items in the calendar.
function deleteAllFutureEvents() {
  const startDate = new Date();
  let events = Calendar.Events.list(calendarId, {
    timeMin: startDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 1000
  });
  
  if (events.items && events.items.length > 0) {
    events.items.forEach(i => deleteEventById(i.id));
  }
}

// Deletes all existing events in the instructor- and category-specific Google calendars.
// Does NOT touch the main shared calendar. Only use if you really want to delete all existing events!
// You may have to run this more than once--it may time out if there are many items in the calendar.
function deleteAllFutureGroupCalendarEvents() {
  groupCalendars.forEach(function(value, key) {
      const startDate = new Date();
      // endDate is set for 30 days from now (this method will delete all events in the next 30 days)
      const endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      let matchingInstructorCalendarEvents = CalendarApp.getCalendarById(value).getEvents(startDate, endDate, {});                     
      if (!!matchingInstructorCalendarEvents) {
        matchingInstructorCalendarEvents.forEach(e => {
          e.deleteEvent();
          Logger.log('group calendar event deleted');
          Utilities.sleep(500);
        });
      }
   });
}

// used for testing
function deleteAllEventsAddedByScript() {
  let existingEvents = getAllPelotonCalendarEventIds();
  for (let i = 0; i < existingEvents.length; i++) {
    let eventId = existingEvents[i];
    deleteEventById(eventId);
  }
}

// used for testing
function getAllPelotonCalendarEventIds() {
  let eventIds = [];
  const startDate = new Date(2018, 11, 24, 10, 33, 30, 0);
  let events = Calendar.Events.list(calendarId, {
    timeMin: startDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 500
  });
  if (events.items && events.items.length > 0) {
    for (let i = 0; i < events.items.length; i++) {
      let event = events.items[i];
      const extendedProperties = event.getExtendedProperties()
      if (!extendedProperties) { 
        continue;
      }
      const sharedExtendedProperties = extendedProperties.getShared();
      if (!!sharedExtendedProperties && sharedExtendedProperties.classId != null) {
        eventIds.push(event.id);
      }
    }
  }

  return eventIds;
}

function checkForEventUpdates(pelotonClass, existingEvent, actualStartTime, isEncore, metadataId) {
  // Extended properties are not currently checked for differences, as they are hidden to the end user.
  let titleUpdated = false;
  let titleUpdate = null;
  let instructorUpdated = false;
  let instructorUpdate = null;
  let descriptionUpdated = false;
  let descriptionUpdate = null;
  let startTimeUpdated = false;
  let startTimeUpdate = null;
  let endTimeUpdated = false;
  let endTimeUpdate = null;
  
  // Remove "[Encore]" and "[German]" from existing event titles before comparing ride names
  let existingEventTitle = existingEvent.summary.replace(/ \[Encore]| \[German]/gi, '');
  if (pelotonClass.title != existingEventTitle) {
    titleUpdated = true;
    titleUpdate = {
      previousTitle: existingEventTitle,
      newTitle: pelotonClass.title
    };
  } else {
    titleUpdate = {
      unchangedTitle: existingEvent.summary
    }
  }
  
  let instructorName = getInstructorName(pelotonClass.instructor_id);
  if (instructorName !== existingEvent.location) {
    instructorUpdated = true;
    instructorUpdate = {
      previousInstructor: existingEvent.location,
      newInstructor: instructorName
    };
  } else {
    instructorUpdate = {
      unchangedInstructor: existingEvent.location
    }
  }
  
  // Remove custom string added to ride description
  let existingEventDescription = existingEvent.description.replace(/\n\nCompliments of the largest global Peloton community at https:\/\/www\.reddit\.com\/r\/pelotoncycle/gi, '');
  if (pelotonClass.description != existingEventDescription) {
    descriptionUpdated = true;
    descriptionUpdate = {
      previousDescription: existingEventDescription,
      newDescription: pelotonClass.description
    }
  } else {
    descriptionUpdate = {
      unchangedDescription: existingEvent.description
    }
  }
  
  let startTimeEpochTime = actualStartTime * 1000;
  let endTimeEpochTime = startTimeEpochTime + (pelotonClass.duration * 1000);
  
  let existingStartTime = existingEvent.getStart().getDateTime();
  let existingStartTimeEpochTime = Date.parse(existingStartTime);
  let existingEndTime = existingEvent.getEnd().getDateTime();
  let existingEndTimeEpochTime = Date.parse(existingEndTime);

  if (startTimeEpochTime != existingStartTimeEpochTime) {
    startTimeUpdated = true;
    startTimeUpdate = {
      previousStartTime: existingStartTime,
      newStartTime: new Date(startTimeEpochTime).toISOString()
    }
  } else {
    startTimeUpdate = {
      unchangedStartTime: existingStartTime
    }
  }

  if (endTimeEpochTime != existingEndTimeEpochTime) {
    endTimeUpdated = true;
    endTimeUpdate = {
      previousEndTime: existingEndTime,
      newEndTime: new Date(endTimeEpochTime).toISOString()
    }
  } else {
    endTimeUpdate = {
      unchangedEndTime: existingEndTime
    }
  }
  
  if (titleUpdated || instructorUpdated || descriptionUpdated || startTimeUpdated || endTimeUpdated) {
    let eventUpdates = {
      titleUpdate: titleUpdate,
      instructorUpdate: instructorUpdate,
      descriptionUpdate: descriptionUpdate,
      startTimeUpdate: startTimeUpdate,
      endTimeUpdate: endTimeUpdate
    }

    deleteEventById(existingEvent.id);
    createEvent(pelotonClass, actualStartTime, isEncore, metadataId);
    updatedClassCount++;
    logUpdatedEvent(existingEvent, eventUpdates);
  }
}
