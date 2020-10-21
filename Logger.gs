function logEvent(event) {
  Logger.log(event);
}

function logEventFormatted(event) {
  Logger.log(`\nEvent: ${JSON.stringify(event, undefined, 2)}`);
}