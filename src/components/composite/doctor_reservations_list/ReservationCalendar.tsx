// @ts-nocheck
import React, { useState } from 'react';
import './styles.css';
import 'react-big-calendar-like-google/lib/css/react-big-calendar.css';
import BigCalendar from 'react-big-calendar-like-google';
import Agenda from 'react-big-calendar-like-google/lib/Agenda';
import moment from 'moment-jalali';
import { Reservation, ReservationRequest, Colors, Translations } from 'api';
import AppTextView from '../../base/app_text/AppTextView';
import r from 'react-big-calendar-like-google/lib/localizer';
import { smartDate } from 'javascript-dev-kit';

r.format = function (date, format, culture) {
  // console.log(...args);
  if (typeof date === 'object' && date.start && date.end) {
    return smartDate(date.start).formatJalali('LT') + ' - ' + smartDate(date.end).formatJalali('LT');
  } else {
    return smartDate(date).formatJalali(format);
  }
};

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);
/* const render = Agenda.prototype.render;
Agenda.prototype.render = function () {
  const Comp = render.apply(this);
  return React.cloneElement({
    ...Comp,
    props: {
      ...Comp.props,
      children: Comp.props.children.map((child, index) => {
        const events = this.props.events;
        console.log(child);
        return React.cloneElement(child, {
          onClick: () => {
            alert('click ' + JSON.stringify(events[index - 1]));
          }
        });
      })
    }
  }, {

  });
}; */

const CalendarWithTooltip = ({ ...props }) => {
  return <BigCalendar
    {...props}
    components={{
      event: (component: any) => {
        const { event } = component;
        alert('comp');
        console.log(component);
        return component;
      }
      /* toolbar: (props) => {
        console.log(props);
        return <div {...props}/>;
      } */
    }}
  />;
};

const Event = ({ event, onClick }) => {
  const { reservation } = event;
  return <div style={{ flexDirection: 'row', cursor: 'pointer' }} onClick={onClick}>
    <AppTextView text={event.title}/>
    <AppTextView text={`(${Translations.reservations[event.reservation.state]})`} style={{ marginLeft: 10 }} textColor={Colors.reservations[reservation.state]}/>
  </div>;
};
const EventWrapper = ({ event, children }) => {
  return <div style={{ backgroundColor: event.bgColor }}>{children}</div>;
};

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max));
}
interface Props{
  reservations:Reservation[],
  onSelected?: (reservation: Reservation)=>void
}
function ReservationCalendar (props: Props) {
  const { reservations, onSelected } = props;

  return (
      <BigCalendar
        style={{ fontFamily: 'subtitle-font', minHeight: '100vh', backgroundColor: 'white' }}
        components={{
          event: (props) => <Event {...props} onClick={() => { onSelected(props.event.reservation); }}/>
        }}
        popup={false}
        selectable={false}
        events={reservations.map((reservation) => {
          return {
            bgColor: Colors.reservations[reservation.state],
            allDay: false,
            start: new Date(reservation.due.date.from),
            end: new Date(reservation.due.date.to),
            desc: 'Big conference for important people',
            title: reservation.info.name || reservation.trackingCode,
            reservation: reservation
          };
        })}

        onSelectEvent={(selected, e) => {
          onSelected && onSelected(selected.reservation);
        }}
        defaultView='month'
        defaultDate={new Date()}
      />
  );
}

export default React.memo(ReservationCalendar);
