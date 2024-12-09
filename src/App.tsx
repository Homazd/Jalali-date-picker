import DatePicker from "./components/DatePicker";
import { DateProvider } from "./context/DateContext";
import ConvertToJalali from "./utils/Convert";

function App(): JSX.Element {
  return (
    <DateProvider>
      <div className="min-h-screen flex items-center justify-center">
        <DatePicker
          disabledBeforeDate={ConvertToJalali("2024-08-22").toDate()}
          range={25}
        />
      </div>
    </DateProvider>
  );
}

export default App;
