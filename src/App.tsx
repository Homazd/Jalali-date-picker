import DatePicker from "./components/DatePicker";
import { DateProvider } from "./context/DateContext";
import ConvertToJalali from "./utils/Convert";

function App(): JSX.Element {
  return (
    <DateProvider>
      <div className="min-h-screen flex items-center justify-center">
        <DatePicker
          // disable dates before 9th of December 2024. it is for test and optional
          disabledBeforeDate={ConvertToJalali("2024-12-09").toDate()}
          range={25}
        />
      </div>
    </DateProvider>
  );
}

export default App;
