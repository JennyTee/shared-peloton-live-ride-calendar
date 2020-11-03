function checkForEventUpdates(pelotonClass, existingEvent, encoreClassStartTime) {
  // Extended properties are not currently checked for differences, as they are hidden to the end user.
  var titleUpdated = false;
  var titleUpdate = null;
  var instructorUpdated = false;
  var instructorUpdate = null;
  var descriptionUpdated = false;
  var descriptionUpdate = null;
  var startTimeUpdated = false;
  var startTimeUpdate = null;
  var endTimeUpdated = false;
  var endTimeUpdate = null;
  
  // Remove "[Encore]" and "[German]" from existing event titles before comparing ride names
  var existingEventTitle = existingEvent.summary.replace(/ \[Encore]| \[German]/gi, '');
  if (pelotonClass.title != existingEventTitle) {
    titleUpdated = true;
    titleUpdate = {
      previousTitle: existingEvent.summary,
      newTitle: pelotonClass.title
    };
  } else {
    titleUpdate = {
      unchangedTitle: existingEvent.summary
    }
  }
  
  var instructorName = getInstructorName(pelotonClass.instructor_id);
  if (instructorName != existingEvent.location) {
    instructorUpdated = true;
    instructorUpdate = {
      previousInstructor: existingEvent.summary,
      newInstructor: pelotonClass.title
    };
  } else {
    instructorUpdate = {
      unchangedInstructor: existingEvent.location
    }
  }
  
  if (pelotonClass.description != existingEvent.description) {
    descriptionUpdated = true;
    descriptionUpdate = {
      previousDescription: existingEvent.description,
      newDescription: pelotonClass.description
    }
  } else {
    descriptionUpdate = {
      unchangedDescription: existingEvent.description
    }
  }
  
  var startTimeEpochTime = !!encoreClassStartTime ? encoreClassStartTime * 1000 : pelotonClass.scheduled_start_time * 1000;
  var endTimeEpochTime = startTimeEpochTime + (pelotonClass.duration * 1000);
  
  var existingStartTime = existingEvent.getStart().getDateTime();
  var existingStartTimeEpochTime = Date.parse(existingStartTime);
  var existingEndTime = existingEvent.getEnd().getDateTime();
  var existingEndTimeEpochTime = Date.parse(existingEndTime);

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
    var eventUpdates = {
      titleUpdate: titleUpdate,
      instructorUpdate: instructorUpdate,
      descriptionUpdate: descriptionUpdate,
      startTimeUpdate: startTimeUpdate,
      endTimeUpdate: endTimeUpdate
    }

    deleteEventById(existingEvent.id);
    createEvent(pelotonClass, encoreClassStartTime);
    logUpdatedEvent(existingEvent, eventUpdates);
  }
}