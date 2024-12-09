import moment from "moment";

const ConvertToJalali = (gregorianDate: Date | string): moment.Moment => {
  if (typeof gregorianDate === "string") {
    return moment(gregorianDate, "YYYY-MM-DD", true).locale("fa");
  }
  return moment(gregorianDate).locale("fa");
};
export default ConvertToJalali;
