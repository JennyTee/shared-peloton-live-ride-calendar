// This map lists instructors and their corresponding Google calendar ID
// If a new instructor is added, the first/last names must match exactly with 
// what is displayed in the Peloton UI, including any special characters.
// Hyphens are special characters and need to have a backslash (\) in front of them.
var instructorCalendars = new Map([
  ['Alex Toussaint', '6pm615s2jnv1efvht6vuf7u1oc@group.calendar.google.com'],
  ['Ally Love','dvd9ttghhodbk16mt5jd6qmbdk@group.calendar.google.com'],
  ['Ben Alldis', '0bcqndak201io7glugei7ar824@group.calendar.google.com'],
  ['Christian Vande Velde', 'rgn5lpau7aubm64adoikd2qr2o@group.calendar.google.com'],
  ['Christine D\'Ercole', '5h971vkfls9ct5fvpf9v12ij8c@group.calendar.google.com'],
  ['Cody Rigsby', 'n81tmgcoagmgtpo5skvgk6068o@group.calendar.google.com'],
  ['Denis Morton', '5jtkvoit8bgorbc1iboih809d8@group.calendar.google.com'],
  ['Emma Lovewell', 'tf7s15attpcsisais72ao3uhjc@group.calendar.google.com'],
  ['Erik Jäger', '5f3dofj02m2tfdl5kcsj22lrlg@group.calendar.google.com'],
  ['Hannah Frankson', '8bjko3iujqmgnmrvhf19as7nfs@group.calendar.google.com'],
  ['Hannah Corbin', 'mhq5pqm0gakm43d3ns00ui1844@group.calendar.google.com'],
  ['Irène Scholz', 't2bf63kigpgi1ruche2pqk0qus@group.calendar.google.com'],
  ['Jenn Sherman', 'n1eb69bfioolb2too86tt9bjcs@group.calendar.google.com'],
  ['Jess King', 'm7veq83bn81dhpho45tscnop2o@group.calendar.google.com'],
  ['Kendall Toole', 'p3nojavv8sn1o3osq5fds4eufg@group.calendar.google.com'],
  ['Leanne Hainsby', '2avo5rj394bm1826e3vpdktar0@group.calendar.google.com'],
  ['Matt Wilpers', 'l2r15qnd0287i5v8mrv68no430@group.calendar.google.com'],
  ['Olivia Amato', 'havf1jom0a1tk5jp3vbueo1s68@group.calendar.google.com'],
  ['Robin Arzón', '85ng60q2h6lc3cqe828kins0tk@group.calendar.google.com'],
  ['Sam Yo', 'dnbu2r8urbbkp5onpdlt0448rc@group.calendar.google.com'],
  ['Tunde Oyeneyin', '0i0iinstdsdh43kgdflnksm2ks@group.calendar.google.com']
]);

// Used for testing
var testInstructorCalendars = new Map([
  ['Alex Toussaint', 'fgb9tnv3i5lp5nc3f291mhbqio@group.calendar.google.com'],
  ['Christine D\'Ercole', 'vlmi3d70cioq0ef0kgoouh91cg@group.calendar.google.com']
]);
