import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import moment from "moment";

const CalendarPicker = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={"Enter Date"}
        value={props.value}
        onChange={(newValue) => {
          props.handleCallback(moment(newValue).format("YYYY-MM-DD"));
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default CalendarPicker;
