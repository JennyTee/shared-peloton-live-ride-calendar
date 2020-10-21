# Peloton Live Ride Calendar Google Apps Script

## Current functionality:
 - Queries Peloton API for live cycling class list
 - Creates Google Calendar events for each live or encore class
 - Script is re-runnable - compares existing Google Calendar events to Peloton API response and adds/updates/deletes events as needed.
 - Basic logging functionality via Google Apps Script log
 - Incudes trigger that calls Peloton's API once/day to update calendar
    
## Upcoming functionality:  
 - Add shared external properties to calendar events with class attributes (instructor, difficulty rating, length, etc.)
 - Accept user-entered class filtering criteria (including class type) - try to filter server-side (request URL params), but can do client-side if needed (filtering)
 - Export logging to Google sheet - tbd
