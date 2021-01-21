# Peloton Live Ride Calendar Google Apps Script
This script provides automatic updates to a shared Google calendar when Peloton creates, updates, or cancels a cycling class.

### How it works:
 - Queries the Peloton API for live cycling class list once per day
 - Compares existing Google Calendar events to Peloton API response and adds/updates/deletes Google Calendar events as needed for both live and encore classes
 - Also maintains sub-calendars for each Peloton instructor and different class categories (e.g., Strength, Yoga, Cycling, Meditation, etc.)
 - Logs script runs and classes added/removed/updated via Google Cloud logging (a.k.a. Stackdriver logging)
