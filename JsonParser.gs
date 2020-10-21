function getInstructorName(instructorId) {
  for (var i = 0; i < instructorList.length; i++) 
  {
    if (instructorList[i].id == instructorId)
    {
      return `${instructorList[i].first_name} ${instructorList[i].last_name}`;
    }
  }
  return '';
}