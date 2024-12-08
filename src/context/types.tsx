export interface DateObject {
    year: number;
    month: number;
    day: number;
  }
  
  export interface DateContextType {
    startDate: DateObject | null;
    endDate: DateObject | null;
    setStartDate: (date: DateObject | null) => void;
    setEndDate: (date: DateObject | null) => void;
  }