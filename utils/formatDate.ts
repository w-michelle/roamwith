import { format } from "date-fns";
import { TbDatabaseStar } from "react-icons/tb";

export const formatDate = (dateString: string) => {
  const dateObject = new Date(dateString);
  const formattedDate = dateObject.toString().split(" GMT")[0];
  return formattedDate;
};

export const formatCalDate = (date: Date) => {
  return format(date, "dd MMM yy").toUpperCase();
};

export const formatSingleDate = (date: Date) => {
  return format(date, "MMMM dd").toUpperCase();
};
