function logCreatedEvent(event) {
  var logEntry = new LogEntry('Class added', event.getSummary(), event);
  Logger.log(logEntry);
}

function logDeletedEvent(event) {
  var logEntry = new LogEntry('Class deleted', event.getSummary(), event);
  Logger.log(logEntry);
}

function logUpdatedEvent(event, eventUpdates) {
  var logEntry = new LogEntry('Class updated', event.getSummary(), eventUpdates);
  Logger.log(logEntry);
}

function logScriptRun(existingCalendarEventCount, pelotonClassCount, addedClassCount, removedClassCount, updatedClassCount) {
  var summary = 'Script run completed ' + new Date();
  var details = {
    existingClassesInCalendar: existingCalendarEventCount,
    classesFromPelotonApi: pelotonClassCount,
    classesAdded: addedClassCount,
    classesRemoved: removedClassCount,
    classesUpdated: updatedClassCount
  };
  var logEntry = new LogEntry('Script run', summary, details);
  Logger.log(logEntry);
}
    
class LogEntry {
  constructor(logType, summary, eventDetails) {
  this.summary = summary;
  this.logType = logType;
  this.eventDetails = eventDetails
  }
}