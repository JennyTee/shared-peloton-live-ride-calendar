/* 
This map lists instructors/class categories and their corresponding Google calendar ID.

If a new instructor is added, the first/last names must match exactly with what is displayed
in the Peloton UI, including any special characters. Hyphens are special characters and need 
to have a backslash (\) in front of them.

Class categories correspond to the Peloton API's fitness_discipline_display_name.
*/

var groupCalendars = new Map();

if (!testMode) {
  groupCalendars = new Map([
    ['Alex Toussaint', '6pm615s2jnv1efvht6vuf7u1oc@group.calendar.google.com'],
    ['Ally Love','dvd9ttghhodbk16mt5jd6qmbdk@group.calendar.google.com'],
    ['Ben Alldis', '0bcqndak201io7glugei7ar824@group.calendar.google.com'],
    ['Christian Vande Velde', 'rgn5lpau7aubm64adoikd2qr2o@group.calendar.google.com'],
    ['Christine D\'Ercole', '5h971vkfls9ct5fvpf9v12ij8c@group.calendar.google.com'],
    ['Cliff Dwenger', 'fj5ekbtf6hg7143ec9lde3e328@group.calendar.google.com'],
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
    ['Mayla Wedekind', 'bf6g8oaofkmapcms2j93ark9t4@group.calendar.google.com'],
    ['Olivia Amato', 'havf1jom0a1tk5jp3vbueo1s68@group.calendar.google.com'],
    ['Robin Arzón', '85ng60q2h6lc3cqe828kins0tk@group.calendar.google.com'],
    ['Sam Yo', 'dnbu2r8urbbkp5onpdlt0448rc@group.calendar.google.com'],
    ['Tunde Oyeneyin', '0i0iinstdsdh43kgdflnksm2ks@group.calendar.google.com'],
    ['cycling', 'ivlb32poijkm1krhbj0fvorm18@group.calendar.google.com'],
    ['cycling + bike bootcamp', 'il5q5h9b9vqpqg376sj47dc00o@group.calendar.google.com'],
    ['strength', 'fcj87tk28hqmkr9g1lsfchkoas@group.calendar.google.com'],
    ['yoga', 'v4pd2riueq6gtmr907p2sb38sg@group.calendar.google.com'],
    ['meditation', 'pgo7htif4jqs13f290sdmeoef4@group.calendar.google.com'],
    ['cardio', 'o6id1u0o1td2tjuu0s8qkvf0uo@group.calendar.google.com'],
    ['running', 'bmri9j6ro1p4ttdlppmffv6g9k@group.calendar.google.com'],
    ['walking', 'fjp7ks1o4euderjul676m2lob4@group.calendar.google.com'],
    ['tread bootcamp', '9840jare2qcspggq06v9gdthqk@group.calendar.google.com'],
    ['bike bootcamp', '532gfu22cjibm7i3l5dtsgausg@group.calendar.google.com'],
    ['outdoor', 'hs7bo2rb85tsmg03f16h5ckps0@group.calendar.google.com'],
    ['stretching', 'apvp4qtpr4nqsr3uk9duvj3ngc@group.calendar.google.com']
  ]);
} else {
  groupCalendars = new Map([
    ['Alex Toussaint', 'fgb9tnv3i5lp5nc3f291mhbqio@group.calendar.google.com'],
    // ['Christine D\'Ercole', 'vlmi3d70cioq0ef0kgoouh91cg@group.calendar.google.com'],
    ['cycling', 'stp4rnl5g2e9nq4bq8tm90735k@group.calendar.google.com'],
    ['cycling + bike bootcamp', 'k8r8hkfuns4uohf3qj33j7ka3s@group.calendar.google.com'],
    ['strength', 'lg7de6tqn9q32k9vc9143ck2jc@group.calendar.google.com'],
    ['yoga', 'b65gmqehsufal3ss2rd1ctu9o8@group.calendar.google.com']
  ]);
}

