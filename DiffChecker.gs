function checkForEventUpdates(pelotonClass, existingEvent, encoreClassStartTime){
  // Extended properties are not currently checked for differences, as they are hidden to the end user.
  var changesNeeded = false;
  
  if (pelotonClass.title != existingEvent.summary) {
    changesNeeded = true;
    Logger.log('Class title updated. Previous title: ' + existingEvent.summary + '. New title: ' + pelotonClass.title + '.');
  };
  
  var instructorName = getInstructorName(pelotonClass.instructor_id);
  if (instructorName != existingEvent.location) {
    changesNeeded = true;
    Logger.log('Instructor for ' + pelotonClass.title + ' updated. Previous instructor: ' + existingEvent.location + 
      '. New instructor: ' + instructorName + '.');
  }
  
  if (pelotonClass.description != existingEvent.description) {
    changesNeeded = true;
    Logger.log('Description for ' + pelotonClass.title + ' updated. Previous description: ' + existingEvent.description + 
      '. New description: ' + pelotonClass.description + '.');
  }
  
  var startTimeEpochTime = !!encoreClassStartTime ? encoreClassStartTime * 1000 : pelotonClass.scheduled_start_time * 1000;
  var endTimeEpochTime = startTimeEpochTime + (pelotonClass.duration * 1000);
  
  var existingStartTime = existingEvent.getStart().getDateTime();
  var existingStartTimeEpochTime = Date.parse(existingStartTime);
  var existingEndTime = existingEvent.getEnd().getDateTime();
  var existingEndTimeEpochTime = Date.parse(existingEndTime);

  if (startTimeEpochTime != existingStartTimeEpochTime) {
    changesNeeded = true;
    Logger.log('Start time for ' + pelotonClass.title + ' updated. Previous start time: ' + existingStartTime + 
      '. New start time: ' + new Date(startTimeEpochTime).toISOString() + '.');
  }

  if (endTimeEpochTime != existingEndTimeEpochTime) {
    changesNeeded = true;
    Logger.log('End time for ' + pelotonClass.title + ' updated. Previous end time: ' + existingEndTime + 
      '. New end time: ' + new Date(endTimeEpochTime).toISOString() + '.');
  }
  
  if (changesNeeded) {
    deleteEventById(existingEvent.id);
    createEvent(pelotonClass, encoreClassStartTime);
  }
}