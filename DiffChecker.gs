function checkForEventUpdates(pelotonClass, existingEvent, encoreClassStartTime){
  // Extended properties are not currently checked for differences, as they are hidden to the end user.
  var changesNeeded = false;
  
  if (pelotonClass.title != existingEvent.summary) {
    changesNeeded = true;
    Logger.log(existingEvent.id + ' class title updated');
  };
  
  var instructorName = getInstructorName(pelotonClass.instructor_id);
  if (instructorName != existingEvent.location) {
    changesNeeded = true;
    Logger.log(existingEvent.id + ' instructor updated');
  }
  
  if (pelotonClass.description != existingEvent.description) {
    changesNeeded = true;
    Logger.log(existingEvent.id + ' class description updated');
  }
  
  var startTimeEpochTime = !!encoreClassStartTime ? encoreClassStartTime * 1000 : pelotonClass.scheduled_start_time * 1000;
  var endTimeEpochTime = startTimeEpochTime + (pelotonClass.duration * 1000);
  
  var existingStartTime = existingEvent.getStart().getDateTime();
  var existingStartTimeEpochTime = Date.parse(existingStartTime);
  var existingEndTime = existingEvent.getEnd().getDateTime();
  var existingEndTimeEpochTime = Date.parse(existingEndTime);

  if (startTimeEpochTime != existingStartTimeEpochTime) {
    changesNeeded = true;
    Logger.log(existingEvent.id + ' start time updated');
  }

  if (endTimeEpochTime != existingEndTimeEpochTime) {
    changesNeeded = true;
    Logger.log(existingEvent.id + ' end time updated');
  }
  
  if (changesNeeded) {
    deleteEvent(existingEvent.id);
    createEvent(pelotonClass, encoreClassStartTime);
  }
}