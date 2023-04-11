import React, { useState } from "react";
import { DateRange } from "react-date-range";


function Testpage() {

    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
          key: "selection"
        }
      ]);
    
      const dates = [
        new Date("2023-06-01T00:00:00.000Z").toISOString().substring(0, 10),
        new Date("2023-06-29T00:00:00.000Z").toISOString().substring(0, 10),
      ];


   return (
    <div>
      <DateRange
        editableDateInputs={true}
        onChange={(item) => setDate([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={date}
        className="date"
        minDate={new Date()}
        disabledDates={dates}
      />
    </div>
  );
}

export default Testpage