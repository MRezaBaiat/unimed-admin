import React, { useEffect, useState } from 'react';
import { Helper, Reservation, ReservationRequest, ReservationState, User, WorkTimes, Translations } from 'api';
import Dialog from '@material-ui/core/Dialog';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { smartDate } from 'javascript-dev-kit';
import moment from 'moment-jalali';
import AppScrollable from '../../components/base/app_scrollable/AppScrollable';
import PersianCalendarPicker from '../../components/composite/react-native-persian-calendar-picker';
import AttendanceView from '../../pages/reservations_manage/attendance.view';

interface Props {
    onClose:()=>void,
    doctorInfo: User['details']['reservationInfo'] & {reserved: Reservation[]},
    reservation?: Reservation,
    onCreate:(reservationRequest: Partial<ReservationRequest>)=>void,
    onStateChange:(state: ReservationState)=>void
}
function ReservationCreateDialog (props: Props) {
  const { onClose, onCreate, reservation, onStateChange, doctorInfo } = props;
  // @ts-ignore
  const [request, setRequest] = useState({ selection: [] } as {selection:{from: number, to: number}[], for: 'self' | 'other', gender: 'male' | 'female', name: string, mobile: string, nationalCode: string, age: number, attendReason: string});

  useEffect(() => {
    if (!reservation) {
      return;
    }
    setRequest({
      age: reservation.info.age,
      name: reservation.info.name,
      mobile: reservation.info.mobile,
      attendReason: reservation.info.attendReason,
      nationalCode: reservation.info.attendReason,
      gender: reservation.info.gender,
      for: 'self',
      selection: [{ from: reservation.due.date.from, to: reservation.due.date.to }]
    });
  }, []);

  return (
        <Dialog maxWidth={'lg'} style={{ alignItems: 'center', justifyContent: 'center' }} onClose={onClose} open={true}>
            <AppScrollable style={{ minWidth: '60vw', margin: 10, alignItems: 'center' }}>
                <AppInput
                    placeholder={'نام'}
                    initialvalue={request.name}
                    onChange={reservation ? undefined : (text) => {
                      setRequest({ ...request, name: text });
                    }}
                />
                <AppInput
                    placeholder={'شماره تماس'}
                    initialvalue={request.mobile}
                    onChange={reservation ? undefined : (text) => {
                      setRequest({ ...request, mobile: text });
                    }}
                />
                <AppInput
                  placeholder={'کد ملی'}
                  initialvalue={request.nationalCode}
                  multiline={true}
                  onChange={reservation ? undefined : (text) => {
                    setRequest({ ...request, nationalCode: text });
                  }}
                />
                <AppInput
                  placeholder={'سن'}
                  initialvalue={(request.age) + ''}
                  type={'number'}
                  onChange={reservation ? undefined : (text) => {
                    setRequest({ ...request, age: Number(text) });
                  }}
                />
              <AppInput
                placeholder={'علت مراجعه'}
                multiline={true}
                initialvalue={request.attendReason}
                onChange={reservation ? undefined : (text) => {
                  setRequest({ ...request, attendReason: text });
                }}
              />
              {
                reservation &&
                <AppInput
                  placeholder={'کد رهگیری'}
                  initialvalue={reservation.trackingCode}
                />
              }
              <AppDropdownMenu
                title={'جنسیت'}
                initialValue={request.gender}
                items={[{ value: 'male', text: 'مرد' }, { value: 'female', text: 'زن' }]}
                onClick={reservation ? undefined : (value) => {
                  setRequest({ ...request, gender: value });
                }}
              />
              <AppDropdownMenu
                title={'برای'}
                initialValue={request.for}
                items={[{ value: 'self', text: 'خود شخص' }, { value: 'other', text: 'شخص دیگر' }]}
                onClick={reservation ? undefined : (value) => {
                  setRequest({ ...request, for: value });
                }}
              />

              {
                reservation &&
                <AppDropdownMenu
                  title={'وضعیت'}
                  initialValue={reservation.state}
                  items={Object.values(ReservationState).map((state) => { return { value: state, text: Translations.reservations[state] }; })}
                  onClick={(value) => {
                    onStateChange(value);
                  }}
                />
              }
              {
                reservation && request.selection.length > 0 &&
                <AppInput
                  placeholder={'زمان'}
                  initialvalue={smartDate(request.selection[0].from).formatJalali() + ' - ' + smartDate(request.selection[0].to).formatJalali()}
                />
              }
              {
                !reservation &&
                <AttendanceView
                  doctorInfo={doctorInfo}
                  selection={request.selection}
                  onSelect={(selection) => {
                    setRequest({ ...request, selection });
                    selection[0] && console.log(smartDate(selection[0].from).formatJalali() + ' - ' + smartDate(selection[0].to).formatJalali());
                  }}
                />
              }
              {
                !reservation &&
                <div>
                  <AppButton text={'ساخت'} onClick={() => {
                    const res: Partial<ReservationRequest> = {
                      type: 'request',
                      extras: {
                        age: request.age,
                        name: request.name,
                        mobile: request.mobile,
                        attendReason: request.attendReason,
                        gender: request.gender,
                        for: request.for,
                        nationalCode: request.nationalCode
                      },
                      selection: request.selection
                    };
                    console.log(res);
                    onCreate(res);
                  }}/>
                  <AppButton text={'Cancel'} onClick={onClose}/>
                </div>
              }
            </AppScrollable>
        </Dialog>
  );
}

export default React.memo(ReservationCreateDialog);
