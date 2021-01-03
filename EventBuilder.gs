var calendarId = 'primary';

function createEvent(ride, actualStartTime, isEncore, rideMetadataId) {
  let startTime = actualStartTime * 1000;
  let endTime = startTime + (ride.duration * 1000);
  
  let summary = buildEventSummary(ride, actualStartTime, isEncore);
  let instructorName = getInstructorName(ride.instructor_id);
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
        classType: ride.fitness_discipline_display_name,
        hasClosedCaptions: ride.has_closed_captions,
        instructor: getInstructorName(ride.instructor_id),
        metadataId: rideMetadataId
      }
    }
  };
  // Create event in main shared calendar
  event = Calendar.Events.insert(event, calendarId);
  
  // Create event in instructor calendar
  let instructorCalendarId = !!instructorCalendars ? instructorCalendars.get(instructorName) : null;
  if (!!instructorCalendarId) {
    Calendar.Events.insert(event, instructorCalendarId);
  }
  
  return event;
}

function buildEventSummary(ride, actualStartTime, isEncore) {
  let foreignLanguageIndicator = '';
  // If rides are offered in other languages someday, this will need to be updated.
  if (ride.origin_locale == 'de-DE') {
    foreignLanguageIndicator = ' [German]';
  }
  let encoreIndicator = !!isEncore ? ' [Encore]' : '';
  let eventSummary = `${ride.title}${foreignLanguageIndicator}${encoreIndicator}`;
  return eventSummary;
}

function getUpcomingPelotonCalendarEvents() {
  let existingEvents = new Map();
  let now = new Date();
  let events = Calendar.Events.list(calendarId, {
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
    let startTime = new Date(event.getStartTime());
    let endTime = new Date(startTime.getTime() + 1000);
    let instructorName = event.getLocation();
    
    // Delete shared calendar event
    event.deleteEvent();
    
    let instructorCalendarId = instructorCalendars.get(instructorName);
    if (!!instructorCalendarId) {
      let matchingInstructorCalendarEvents = CalendarApp.getCalendarById(instructorCalendarId)
                                                        .getEvents(startTime, endTime, {});
      
      // Delete matching instructor calendar event
      if (!!matchingInstructorCalendarEvents) {
        matchingInstructorCalendarEvents[0].deleteEvent();
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
  let startDate = new Date();
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

// Deletes all existing events in the instructor-specific Google calendars.
// Does NOT touch the main shared calendar. Only use if you really want to delete all existing events!
// You may have to run this more than once--it seems to time out if there are many items in the calendar.
function deleteAllFutureInstructorCalendarEvents() {
  instructorCalendars.forEach(function(value, key) {
      let startDate = new Date();
      // endDate is set for 30 days from now (this method will delete all events in the next 30 days)
      let endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      let matchingInstructorCalendarEvents = CalendarApp.getCalendarById(value).getEvents(startDate, endDate, {});                     
      if (!!matchingInstructorCalendarEvents) {
        matchingInstructorCalendarEvents.forEach(e => e.deleteEvent());
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
  let startDate = new Date(2018, 11, 24, 10, 33, 30, 0);
  let events = Calendar.Events.list(calendarId, {
    timeMin: startDate.toISOString(),
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
      if (!!sharedExtendedProperties && sharedExtendedProperties.classId != null) {
        eventIds.push(event.id);
      }
    }
  }

  return eventIds;
}

