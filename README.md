# Peloton Live Ride Calendar Google Apps Script

Note This project is a work in progress - not ready for public use...yet. :) 

When complete, this script will provide users with automatic updates to their Google calendars based on the Peloton class schedule.

### Current functionality:
 - Queries Peloton API for live cycling class list once/day
 - Compares existing Google Calendar events to Peloton API response and adds/updates/deletes Google Calendar events as needed for both live and encore classes
 - Logs script runs and classes added/removed/updated via Google Cloud logging (a.k.a. Stackdriver logging)
    
### Upcoming functionality:  
 - Accept user-entered class filtering criteria (including class type) to limit kinds of classes considered when adding/removing/updating events from calendar
