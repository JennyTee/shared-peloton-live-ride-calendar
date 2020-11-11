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