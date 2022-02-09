import React, { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker2';
import './styles.css';
import moment from 'moment-jalali';
// import { DatePicker } from 'react-persian-datepicker';
import DatePicker from 'react-modern-calendar-datepicker';
import { smartDate, DateInputTypes } from 'javascript-dev-kit';
import { numbersToEnglish } from '../../../helpers/Utils';
// import 'react-modern-calendar-datepicker/lib/DatePicker.css';

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

interface AppDatePickerProps{
  onChange:(date)=>void
  value: DateInputTypes
}
function AppDatePicker (props: AppDatePickerProps) {
  const { onChange, value } = props;

  const d = moment(value);

  return (
    <div style={{ flexDirection: 'column' }}>
      <DatePicker
        value={{ day: Number(numbersToEnglish(d.format('jD'))), month: Number(numbersToEnglish(d.format('jM'))), year: Number(numbersToEnglish(d.format('jYYYY'))) }}
        locale="fa"
        shouldHighlightWeekends
        onChange={onChange}
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

export default React.memo(AppDatePicker);
