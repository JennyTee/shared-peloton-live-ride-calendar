var calendarId = 'primary';

function createEvent(ride, encoreClassStartTime) {
  var startTime = !!encoreClassStartTime ? encoreClassStartTime * 1000 : ride.scheduled_start_time * 1000;
  var endTime = startTime + (ride.duration * 1000);
  var event = {
    summary: ride.title,
    location: getInstructorName(ride.instructor_id),
    description: ride.description,
    start: {
      dateTime: new Date(startTime).toISOString()
    },
    end: {
      dateTime: new Date(endTime).toISOString()
    },
    // TODO: update color based on class type (once querying supports all class types)
    colorId: !!encoreClassStartTime ? 3 : 2,
    // TODO: find a use for the non-classId extended properties or consider removing them, as they are not currently used
    extendedProperties: {
      shared: {
        classLength: ride.duration / 60,
        classId: ride.id,
        classType: ride.fitness_discipline_display_name,
        hasClosedCaptions: ride.has_closed_captions,
        instructor: getInstructorName(ride.instructor_id),
        language: ride.language
      }
    }
  };
  event = Calendar.Events.insert(event, calendarId);
  Logger.log(ride.title + ' event created.');
  logEventFormatted(event);
}

function getUpcomingPelotonCalendarEvents() {
  var existingEvents = new Map();
  var now = new Date();
  var events = Calendar.Events.list(calendarId, {
    timeMin: now.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 500
  });
  if (events.items && events.items.length > 0) {
    for (var i = 0; i < events.items.length; i++) {
      var event = events.items[i];
      var extendedProperties = event.getExtendedProperties()
      if (!extendedProperties) { 
        continue;
      }
      var sharedExtendedProperties = extendedProperties.getShared();
      if (!!sharedExtendedProperties && sharedExtendedProperties.classId != null) {
        existingEvents.set(sharedExtendedProperties.classId, event);
      }
    }
  } else {
    Logger.log('No exisiting events found.');
  }
  return existingEvents;
}

function deleteEvent(eventId) {
  try {
    CalendarApp.getCalendarById(calendarId).getEventById(eventId).deleteEvent();
    Logger.log('Event ' + eventId + ' deleted.');
  } catch(e) {
    console.error("Error deleting event " + eventId + " from calendar " + calendarId + ". Error: " + e);
  }
}

// used for testing
function deleteAllEvents() {
  var existingEvents = getAllPelotonCalendarEventIds();
  for (var i = 0; i < existingEvents.length; i++) {
    var eventId = existingEvents[i];
    deleteEvent(eventId);
  }
}

// used for testing
function getAllPelotonCalendarEventIds() {
  var eventIds = [];
  var startDate = new Date(2018, 11, 24, 10, 33, 30, 0);
  var events = Calendar.Events.list(calendarId, {
    timeMin: startDate.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 500
  });
  if (events.items && events.items.length > 0) {
    for (var i = 0; i < events.items.length; i++) {
      var event = events.items[i];
      var extendedProperties = event.getExtendedProperties()
      if (!extendedProperties) { 
        continue;
      }
      var sharedExtendedProperties = extendedProperties.getShared();
      if (!!sharedExtendedProperties && sharedExtendedProperties.classId != null) {
        eventIds.push(event.id);
      }
    }
  } else {
    Logger.log('No events found.');
  }
  Logger.log('Existing event count: ' + eventIds.length);
  return eventIds;
}
