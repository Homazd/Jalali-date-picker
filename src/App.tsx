import moment from "moment";
import DatePicker from "./components/DatePicker";
import { DateProvider } from "./context/DateContext";

function App(): JSX.Element {
  return (
    <DateProvider>
      <div className="bg-gray-100 flex items-center justify-center">
        <DatePicker
          disabledBeforeDate={moment("1403-01-01", "jYYYY-jMM-jDD").toDate()}
        />
      </div>
    </DateProvider>
  );
}

export default App;
