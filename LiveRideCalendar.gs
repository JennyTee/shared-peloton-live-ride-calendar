/*
  Current functionality:
    -Queries Peloton API for live cycling class list
    -Creates Google Calendar events for each live class (does not handle Encore classes)
    
  Upcoming functionality:  
      -Add shared external properties to calendar events with class attributes (instructor, difficulty rating, length, etc.)
      -Accept user-entered class filtering criteria (including class type) - try to filter client-side (request URL params), but can do server-side if needed (filtering)
      -Handle Encore classes
      -Ensure script re-runnability
      -Create diff method to add/update/delete existing class calendar events
      -Add logging for classes added/updated/deleting
      -Add trigger to call Peloton API once/day to update calendar
      -Export logging to Google sheet - tbd
      -DeleteAllUpcomingClassEvents function 
 */

var data;
var instructorList;
var classList;
//var query = '"Apps Script" stars:">=100"';
var url = 'https://api.onepeloton.com/api/v3/ride/live?exclude_complete=true&content_provider=studio&exclude_live_in_studio_only=true&browse_category=cycling&start=1602738000&end=1603947599';
  // + '&q=' + encodeURIComponent(query);

function getClasses() {
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var json = response.getContentText();
  data = JSON.parse(json);
  
  instructorList = data.instructors;
  classList = data.rides;
  Logger.log(instructorList);

  //for (var i = 0; i < classList.length; i++) 
  //{
    //var targetClass = classList[i];
    //if (targetClass.original_air_time == null) 
    //{
      //createEvent(targetClass);
    //}
  //}
}

function createEvent(ride) {
  var calendarId = 'primary';
  var startTime = ride.scheduled_start_time * 1000;
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
    // TODO: update color based on class type
    colorId: 11,
    extendedProperties: {
      shared: {
        instructor: getInstructorName(mockClass.instructor_id),
        classLength: ride.duration / 60,
        classId: ride.id,
        classType: ride.fitness_discipline_display_name
      }
    }
  };
  event = Calendar.Events.insert(event, calendarId);
  logEvent(event);
}

function getInstructorName(instructorId) {
  for (var i = 0; i < instructorList.length; i++) 
  {
    if (instructorList[i].id == instructorId)
    {
      return `${instructorList[i].first_name} ${instructorList[i].last_name}`;
    }
  }
  return '';
}

function logEvent(event) {
  Logger.log('Event ID: ' + event.id);
  Logger.log('start: ' + event.start);
  Logger.log('end: ' + event.end);
  Logger.log(event);
}



function createTestEvent() {
  getClasses();
  
  // Sample API response for a class:
  var mockClass = {
         class_type_ids:[
            "7579b9edbdf9464fa19eb58193897a73"
         ],
         content_provider:"peloton",
         content_format:"video",
         description:"Bursts of effort alternated with free weight segments, this ride will challenge your mind and strengthen your body from the inside out.",
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
         scheduled_start_time:1602847800,
         series_id:"283319daf8834b86a6205737001b0d56",
         sold_out:false,
         studio_peloton_id:"9a699cdadc3d4bcca887cccfcbba0b63",
         title:"45 min Intervals & Arms Ride",
         total_ratings:0,
         total_in_progress_workouts:0,
         total_workouts:0,
         vod_stream_url:null,
         vod_stream_id:"659ac2fe1c894e4fa52343f48bf6eaa6-vod",
         captions:[
            
         ]
      };
  
  var calendarId = 'primary';
  var startTime = mockClass.scheduled_start_time * 1000;
  var endTime = startTime + (mockClass.duration * 1000);
  var event = {
    summary: mockClass.title,
    location: getInstructorName(mockClass.instructor_id),
    description: mockClass.description,
    start: {
      dateTime: new Date(startTime).toISOString()
    },
    end: {
      dateTime: new Date(endTime).toISOString()
    },
    // TODO: update color based on class type
    colorId: 10,
    extendedProperties: {
      shared: {
        instructor: getInstructorName(mockClass.instructor_id),
        classLength: mockClass.duration / 60,
        classId: mockClass.id
      }
  }
  };
  event = Calendar.Events.insert(event, calendarId);
  logEvent(event);
}


