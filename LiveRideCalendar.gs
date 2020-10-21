/*
  Current functionality:
    -Queries Peloton API for live cycling class list
    -Creates Google Calendar events for each live class with shared external properties (does not handle Encore classes)
    
  Upcoming functionality:  
      -Accept user-entered class filtering criteria (including class type) - try to filter client-side (request URL params), but can do server-side if needed (filtering)
      -Handle Encore classes
      -Ensure script re-runnability
      -Create diff method to add/update/delete existing class calendar events
      -Add logging for classes added/updated/deleting
      -Add trigger to call Peloton API once/day to update calendar
      -Export logging to Google sheet - tbd
      -DeleteAllUpcomingClassEvents function 
      
       TODO: remove extended properties (except for classId) or find another use for them
       Consider adding extended property values into event description instead (this will complicate diff checking).
 */