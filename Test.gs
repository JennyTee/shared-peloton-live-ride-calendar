// Sample API response for a ride:
var mockClass = {
         class_type_ids:[
            "7579b9edbdf9464fa19eb58193897a73"
         ],
         content_provider:"peloton",
         content_format:"video",
         description:"TESTING TESTING TESTING",
         difficulty_estimate:0.0,
         overall_estimate:0.0,
         difficulty_rating_avg:0.0,
         difficulty_rating_count:0,
         difficulty_level:null,
         duration:2700,
         equipment_ids:[
            "0f5f1ff2d6c647cf98d599ed90ad72d3"
         ],
         equipment_tags:[
            
         ],
         extra_images:[
            
         ],
         fitness_discipline:"cycling",
         fitness_discipline_display_name:"Cycling",
         has_closed_captions:false,
         has_pedaling_metrics:true,
         home_peloton_id:"d486de431e2f4388b812fadedd7721d9",
         id:"659ac2fe1c894e4fa52343f48bf6eaa6",
         image_url:null,
         instructor_id:"baf5dfb4c6ac4968b2cb7f8f8cc0ef10",
         is_archived:false,
         is_closed_caption_shown:false,
         is_explicit:false,
         has_free_mode:false,
         is_live_in_studio_only:false,
         language:"english",
         origin_locale:"en-US",
         length:0,
         live_stream_id:"659ac2fe1c894e4fa52343f48bf6eaa6-live",
         live_stream_url:null,
         location:"psny-studio-1",
         metrics:[
            "heart_rate",
            "cadence",
            "calories"
         ],
         original_air_time:null,
         overall_rating_avg:0.0,
         overall_rating_count:0,
         pedaling_start_offset:0,
         pedaling_end_offset:0,
         pedaling_duration:0,
         rating:0,
         ride_type_id:"7579b9edbdf9464fa19eb58193897a73",
         ride_type_ids:[
            "7579b9edbdf9464fa19eb58193897a73"
         ],
         sample_vod_stream_url:null,
         scheduled_start_time:1611979200,
         series_id:"283319daf8834b86a6205737001b0d56",
         sold_out:false,
         studio_peloton_id:"9a699cdadc3d4bcca887cccfcbba0b63",
         title:"TESTING TESTING TESTING",
         total_ratings:0,
         total_in_progress_workouts:0,
         total_workouts:0,
         vod_stream_url:null,
         vod_stream_id:"659ac2fe1c894e4fa52343f48bf6eaa6-vod",
         captions:[
            
         ],
         metadataId:'9a699cdadc3d4bcca887cccfcbba0a88'
      };
      

function createTestEvent() {
  getUpcomingPelotonCalendarEvents();
  let existingEvents = getUpcomingPelotonCalendarEvents();
  let existingEventCount = existingEvents.size;
  let response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  let json = response.getContentText();
  data = JSON.parse(json);
  
  instructorList = data.instructors;
  instructorHashMap = new Map(instructorList.map(i => [i.id, i]));
  
  let calendarId = 'primary';
  let startTime = mockClass.scheduled_start_time * 1000;
  let endTime = startTime + (mockClass.duration * 1000);
  let event = {
    summary: mockClass.title,
    location: getInstructorName(mockClass.instructor_id),
    description: mockClass.description,
    start: {
      dateTime: new Date(startTime).toISOString()
    },
    end: {
      dateTime: new Date(endTime).toISOString()
    },
    colorId: 10,
    extendedProperties: {
      shared: {
        classLength: mockClass.duration / 60,
        classId: mockClass.id,
        classType: mockClass.fitness_discipline_display_name,
        hasClosedCaptions: mockClass.has_closed_captions,
        instructor: getInstructorName(mockClass.instructor_id),
        metadataId: mockClass.metadataId
      }
  }
  };
  event = Calendar.Events.insert(event, calendarId);
  Calendar.Events.insert(event, 'stp4rnl5g2e9nq4bq8tm90735k@group.calendar.google.com'); // test cycling calendar
  Calendar.Events.insert(event, 'fgb9tnv3i5lp5nc3f291mhbqio@group.calendar.google.com'); //Alex T. test calendar
  Calendar.Events.insert(event, 'k8r8hkfuns4uohf3qj33j7ka3s@group.calendar.google.com'); //Test cycling + bootcamp calendar
}

// Deletes all existing events in the main shared Google calendar AND instructor-specific calendars.
// Only use if you really want to delete all existing events!
// You may have to run this more than once--it seems to time out if there are many items in the calendar.
function deleteAllFutureEvents() {
  const now = new Date();
  let events = Calendar.Events.list(calendarId, {
    timeMin: now.toISOString(),
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

// Deletes ALL events (future and past) added to main calendar.
function deleteAllEventsAddedByScript() {
  let existingEvents = getAllPelotonCalendarEventIds();
  for (let i = 0; i < existingEvents.length; i++) {
    let eventId = existingEvents[i];
    deleteEventById(eventId);
  }
}

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
