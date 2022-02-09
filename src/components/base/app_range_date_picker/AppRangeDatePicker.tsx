// @ts-nocheck
import React, { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker2';
import './styles.css';
import moment from 'moment-jalali';
// import { DatePicker } from 'react-persian-datepicker';
import DatePicker from 'react-modern-calendar-datepicker';
import { formatDateShamsi } from '../../../helpers';
import { numbersToEnglish } from '../../../helpers/Utils';
import { smartDate } from 'javascript-dev-kit';
// import 'react-modern-calendar-datepicker/lib/DatePicker.css';

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

interface AppDatePickerProps{
  onChange:(start, end)=>void
  start: number,
  end:number
}
function AppRangeDatePicker (props: AppDatePickerProps) {
  const { onChange, start, end } = props;
  const [selectedDayRange, setSelectedDayRange] = useState(
    {
      from: null,
      to: null
    }
  );
  useEffect(() => {
    const from = moment(start);
    const to = moment(end);
    setSelectedDayRange({
      from: { day: Number(numbersToEnglish(from.format('jD'))), month: Number(numbersToEnglish(from.format('jM'))), year: Number(numbersToEnglish(from.format('jYYYY'))) },
      to: { day: Number(numbersToEnglish(to.format('jD'))), month: Number(numbersToEnglish(to.format('jM'))), year: Number(numbersToEnglish(to.format('jYYYY'))) }
    });
  }, []);

  useEffect(() => {
    if (!selectedDayRange.from || !selectedDayRange.to) { return; }
    const from = moment(`${selectedDayRange.from.year}/${selectedDayRange.from.month}/${selectedDayRange.from.day} 00:00`, 'jYYYY/jMM/jDD HH:mm');
    const to = moment(`${selectedDayRange.to.year}/${selectedDayRange.to.month}/${selectedDayRange.to.day} 23:59`, 'jYYYY/jMM/jDD HH:mm');

    onChange(
      from.toDate().getTime(),
      to.toDate().getTime()
    );
  }, [selectedDayRange]);

  return (
    <div style={{ flexDirection: 'column' }}>
      <DatePicker
        value={selectedDayRange}
        locale="fa"
        shouldHighlightWeekends
        onChange={setSelectedDayRange}
      />
      {/* <DatePicker
        value={moment(endDate)}
        onChange={(date) => {
          setEndDate(date);
        }}
      /> */}
    </div>
  );
}

export default React.memo(AppRangeDatePicker);
