var dataForSheet = [];

function logCreatedEvent(event) {
  const logEntry = new LogEntry('Class added', event.getSummary(), event);
  Logger.log(logEntry);

  const extendedProperties = event.getExtendedProperties();
  const sharedProperties = extendedProperties.getShared();
  dataForSheet.push([
    new Date().toLocaleString(),
    'class added',
    new Date(event.getStart().getDateTime()).toLocaleString(),
    event.getSummary(),
    sharedProperties.classType,
    event.getLocation(),
    sharedProperties.metadataId
    ]);
}

function logDeletedEvent(event) {
  const logEntry = new LogEntry('Class deleted', event.getSummary(), event);
  Logger.log(logEntry);

  const extendedProperties = event.getExtendedProperties();
  const sharedProperties = extendedProperties.getShared();
  dataForSheet.push([
    new Date().toLocaleString(),
    'class deleted',
    new Date(event.getStart().getDateTime()).toLocaleString(),
    event.getSummary(),
    sharedProperties.classType,
    event.getLocation(),
    sharedProperties.metadataId
    ]);
}

function logUpdatedEvent(event, eventUpdates) {
  let logEntry = new LogEntry('Class updated', event.getSummary(), eventUpdates);
  Logger.log(logEntry);

  const extendedProperties = event.getExtendedProperties();
  const sharedProperties = extendedProperties.getShared();
  dataForSheet.push([
    new Date().toLocaleString(),
    'class updated',
    new Date(event.getStart().getDateTime()).toLocaleString(),
    event.getSummary(),
    sharedProperties.classType,
    event.getLocation(),
    sharedProperties.metadataId
    ]);
}

function logScriptRun(existingCalendarEventCount, pelotonClassCount, addedClassCount, removedClassCount, updatedClassCount) {
  const summary = 'Script run completed ' + new Date();
  const details = {
    existingClassesInCalendar: existingCalendarEventCount.toFixed(),
    classesFromPelotonApi: pelotonClassCount.toFixed(),
    classesAdded: addedClassCount.toFixed(),
    classesRemoved: removedClassCount.toFixed(),
    classesUpdated: updatedClassCount.toFixed()
  };
  const logEntry = new LogEntry('Script run', summary, details);
  Logger.log(logEntry);

  writeToSheeet();
}

function logError(exception) {
  const logEntry = new LogEntry('Script error', exception, 'No event details available.');
  Logger.log(logEntry);
}
    
class LogEntry {
  constructor(logType, summary, eventDetails) {
    this.logType = logType;
    this.summary = summary;
    this.eventDetails = eventDetails
  }
}

function writeToSheeet(){
  const range = `A${getFirstEmptyRowByColumnArray()}`;
  const valueInputOption = 'USER_ENTERED';
  var valueRange = Sheets.newValueRange();
  valueRange.values = dataForSheet;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
    valueInputOption: valueInputOption
  });
}

function getFirstEmptyRowByColumnArray() {
  var spr = SpreadsheetApp.openById(spreadsheetId);
  var column = spr.getRange('A:A');
  var values = column.getValues(); // get all data in one call
  var ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}
