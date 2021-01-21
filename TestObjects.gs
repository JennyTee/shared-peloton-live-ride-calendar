// Sample API response for a ride:
var mockClass = {
         class_type_ids:[
            "7579b9edbdf9464fa19eb58193897a73"
         ],
         content_provider:"peloton",
         content_format:"video",
         description:"Bursts of effort alternated with free weight segments, this ride " +
           "will challenge your mind and strengthen your body from the inside out.",
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
         scheduled_start_time:1611169200,
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
}
