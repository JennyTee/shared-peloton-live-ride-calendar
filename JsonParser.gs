function getInstructorName(instructorId) {
  for (var i = 0; i < instructorList.length; i++) {
    if (instructorList[i].id == instructorId) {
      return `${instructorList[i].first_name} ${instructorList[i].last_name}`;
    }
  }
  return '';
}

function getMatchingEncoreClassStartTime(classId) {
  for (var i = 0; i < encoreClassData.length; i++) {
    if (encoreClassData[i].ride_id == classId) {
      return encoreClassData[i].start_time;
    }
  }
}