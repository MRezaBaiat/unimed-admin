import React, { memo, useState, useEffect, Fragment } from 'react';
import moment from 'jalali-moment';
import ReservationsApi from './../../network/ReservationsApi';
import { Helper, Reservation, User, WorkTime, WorkTimes } from 'api';
import Kit, { smartDate } from 'javascript-dev-kit';
import PersianCalendarPicker from '../../components/composite/react-native-persian-calendar-picker';
import { formatDateShamsi } from '../../helpers';
import AppScrollable from '../../components/base/app_scrollable/AppScrollable';
import AppTextView from '../../components/base/app_text/AppTextView';
import AppList from '../../components/base/app_list/AppList';

interface Props{
  doctorInfo:User['details']['reservationInfo'] & {reserved: Reservation[]},
  selection: {from: number, to: number}[],
  onSelect: (selection: {from: number, to: number}[])=> void
}
function AttendanceView (props: Props) {
  const { onSelect } = props;
  const { reserved, workTimes, gapMinutes } = props.doctorInfo;
  const [date, setDate] = useState(undefined as moment.Moment | undefined);
  const [intervals, setIntervals] = useState(undefined as string[] | undefined);
  const [selectedItem, setSelectedItem] = useState(undefined as string | undefined);
  const [conflicts, setConflicts] = useState(undefined as any[] | undefined);

  useEffect(() => {
    setSelectedItem('');
    onSelect([]);

    const now = smartDate();
    let from = smartDate(date).toBeginningOfDay();
    if (from.getTime() < now.getTime()) {
      from = now;
    }
    const to = smartDate(date).toEndOfDay();
    const intervals = Helper.calculateWorkTimeIntervals(from.getTime(), to, [], workTimes, gapMinutes);// empty to get all available
    setIntervals(intervals);
    if (!date || !intervals) {
      return;
    }
    const conflicts: any[] = [];
    for (const interval of intervals) {
      if (findConflict(interval.split(' - ')[0], interval.split(' - ')[1])) {
        conflicts.push(interval);
      }
    }
    setConflicts(conflicts);
  }, [date]);

  const reserveRequest = (from: string, to: string) => {
    if (!from || !to || !date) {
      return;
    }
    const fromMoment = smartDate(`${date.format('YYYY/MM/DD')} ${from}`);
    const toMoment = smartDate(`${date.format('YYYY/MM/DD')} ${to}`);

    onSelect([{ from: fromMoment.getTime(), to: toMoment.getTime() }]);
  };

  const findConflict = (from: string, to: string) => {
    if (!date) {
      return;
    }
    const fromMoment = smartDate(`${date.format('YYYY/MM/DD')} ${from}`);
    const toMoment = smartDate(`${date.format('YYYY/MM/DD')} ${to}`);

    return Kit.datesRangesConflict({ from: fromMoment.getTime(), to: toMoment.getTime() }, reserved.map(r => { return { from: r.due.date.from, to: r.due.date.to }; }), 60 * 1000);
  };

  return (
    <div style={{ backgroundColor: '#50BCBD', flex: 1 }}>
      <div style={{
        height: '80vh',
        width: '100vw',
        padding: 4,
        marginTop: 11,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        alignItems: 'center'
      }}>
        <AppScrollable
          showsVerticalScrollIndicator={false}
        >
          <PersianCalendarPicker
            onDateChange={(...args) => {
              // @ts-ignore
              const d = args[0];
              setConflicts(undefined);
              setDate(d);
              setSelectedItem('');
            }}
            isRTL
            textStyle={{ color: '#BDBDBD' }}
            selectedDays={workTimes || {}}
          />
          {
            date && !Kit.isVoid(conflicts) && !Kit.isVoid(intervals) &&
            <Fragment>
              <div style={{ width: '85vw', flexDirection: 'row-reverse', justifyContent: 'space-between', alignSelf: 'center', marginTop: 3 }}>
                <AppTextView style={{ color: '#38488A' }} text='انتخاب ساعت ویزیت' />
              </div>
              <AppList
                onClick={(item) => {
                  // setSelectedItem(item);
                }}
                items={intervals}
                contentContainerStyle={{ paddingHorizontal: 1 }}
                getItemKey={(item, index) => {
                  return index;
                }}
                numColumns={3}
                renderItem={(item) => {
                  // @ts-ignore
                  const hasConflict = conflicts.includes(item);
                  return <Row hasConflict={hasConflict} item={item} key={item} reserveRequest={reserveRequest} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>;
                }
                }
              />
            </Fragment>
          }
        </AppScrollable>
      </div>
    </div>
  );
}

const Row = ({ item, setSelectedItem, hasConflict, reserveRequest, selectedItem }) => {
  return (
    <div
      disabled={hasConflict}
      onClick={() => {
        if (hasConflict) {
          return;
        }
        setSelectedItem(item);
        const from = item.split(' - ')[0];
        const to = item.split(' - ')[1];
        reserveRequest(from, to);
      }}
      style={selectedItem === item ? styles.selected : hasConflict ? styles.reserved : styles.open}>
      <AppTextView style={{ color: selectedItem === item ? '#FFFFFF' : hasConflict ? '#9E9E9E' : '#50BCBD' }} text={item.slice(0, 5)} />
    </div>
  );
};

const styles = {
  reserved: {
    height: '6.5vh',
    width: '26vw',
    backgroundColor: '#F2F2F2',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    marginVertical: 2
  },
  open: {
    height: '6.5vh',
    width: '26vw',
    backgroundColor: '#FFFFFF',
    borderRadius: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#50BCBD'
  },
  selected: {
    height: '6.5vh',
    width: '26vw',
    backgroundColor: '#50BCBD',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    marginVertical: 2
  }

};

export default memo(AttendanceView);
