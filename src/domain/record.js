import { getStudentListFromDb } from "../repo/record";

// extract all universities registered in database
export const getStudentList = (MACaddress) => {
  return getStudentListFromDb(MACaddress).then((studentList) => {
    if (studentList == null) 
        return null;
    else{
        let students = {
            universityID : studentList[0].univID,
            studentPresent : studentList
        }
        return students;
    }
    });
};

