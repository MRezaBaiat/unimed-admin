import React, { useEffect, useState } from 'react';
import GridContainer from '../../base/grid/GridContainer';
import Card from '../../base/app_card/Card';
import CardHeader from '../../base/app_card/CardHeader';
import CardBody from '../../base/app_card/CardBody';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../../assets/jss/material-dashboard-react/components/listStyles';
import AppTextView from '../../base/app_text/AppTextView';
import ReservationCreateDialog
  from '../../../dialogs/reservations_create_dialog/ReservationCreateDialog';
import AppButton from '../../base/app_button/AppButton';
import ReservationsApi from '../../../network/ReservationsApi';
import { numbersToEnglish, safeAssignStyles } from '../../../helpers/Utils';
import { smartDate } from 'javascript-dev-kit';
import moment from 'moment-jalali';
import AppDatePicker from '../../base/app_date_picker/AppDatePicker';
import AppScrollable from '../../base/app_scrollable/AppScrollable';
import CardAvatar from '../../base/app_card/CardAvatar';
import { ReservationState, Reservation, ReservationRequest, User, WorkTimes } from 'api';
import AppImageView from '../../base/app_image/AppImageView';
import ReservationCalendar from './ReservationCalendar';
import { defaultEmpty } from '../../../assets/images';

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props{
    reservationId: string,
    doctorId: string,
    onSelect?:(reservation: Reservation)=>void
}
function DoctorReservationsList (props: Props) {
  const { onSelect, doctorId, reservationId } = props;
  const classes = useStyles();
  const [info, setInfo] = useState(undefined as User['details']['reservationInfo'] & {reserved: Reservation[]} | undefined);
  const [selected, setSelected] = useState(undefined as {reservation: Reservation} | undefined);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [date, setDate] = useState(smartDate().toBeginningOfDay());
  const [activeReserve, setActiveReserve] = useState(undefined as Reservation | undefined);
  const [upcomingReserves, setUpcomingReserves] = useState([] as Reservation[]);
  const [pastReserves, setPastReserves] = useState([] as Reservation[]);

  useEffect(() => {
    const from = smartDate(date).toBeginningOfDay();
    const to = smartDate(date).add(1, 'month').toEndOfDay();
    ReservationsApi.getInfo(doctorId, from.getTime(), to.getTime()).then((res) => {
      setInfo(res.data);
      console.log('dddd', res.data);
      const now = smartDate().getTime();
      const reserves = [...res.data.reserved];
      const activeReserve = reserves.find(r => r.due.date.from <= now && now <= r.due.date.to && r.state === ReservationState.CONFIRMED);
      setActiveReserve(activeReserve);
      if (reservationId) {
        const reservation = res.data.reserved.find(r => r._id === reservationId);
        if (reservation) {
          setSelected({ reservation });
          setDialogVisible(true);
        }
      }
    }).catch(console.log);
  }, [date]);

  return (
    <div style={{ width: '90vw', height: '100vh' }}>
        <GridContainer>
                <Card>
                    <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
                        <div>
                            <h4 className={classes.cardTitleWhite}>لیست رزروها</h4>
                            <p className={classes.cardCategoryWhite}>
                                مدیریت رزروهای پزشک
                            </p>
                        </div>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                           <AppButton
                            text={'ایجاد رزرو'}
                            onClick={() => {
                              setDialogVisible(true);
                            }}
                           />

                           <div style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                               {/* {
                                 info?.reserved[0] && <ActiveReserveView reserve={info?.reserved[0]}/>
                               } */}
                               {
                                 info?.reserved && <ReservationCalendar reservations={info.reserved} onSelected={(reservation) => {
                                   setSelected({ reservation });
                                   setDialogVisible(true);
                                 }}/>
                               }
                           </div>
                            {
                                dialogVisible && info && <ReservationCreateDialog
                                  doctorInfo={info}
                                  reservation={selected && selected.reservation}
                                  onCreate={(request) => {
                                    ReservationsApi.request(doctorId, request).then(() => {
                                      setSelected(undefined);
                                      setDialogVisible(false);
                                      window.location.reload();
                                    });
                                  }}
                                  onStateChange={(state) => {
                                    if (!selected || !selected.reservation) {
                                      return;
                                    }
                                    ReservationsApi.setState(selected.reservation._id, state).then(() => {
                                      window.location.reload();
                                    }).catch((e) => {
                                      console.log(e);
                                      window.location.reload();
                                    });
                                  }}
                                  onClose={() => {
                                    setDialogVisible(false);
                                    setSelected(undefined);
                                  }} />
                            }
                      </GridContainer>
                    </CardBody>
                </Card>
        </GridContainer>
    </div>
  );
}

interface ActiveReserveViewProps{
    reserve: Reservation
}
const ActiveReserveView = (props: ActiveReserveViewProps) => {
  const { reserve } = props;

  return (
        <Card style={safeAssignStyles(styles, { marginTop: 50, width: '50%', alignSelf: 'center', minWidth: 150, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' })}>
            {
                reserve.issuer.type === 'user' &&
                <CardAvatar profile style={{ borderColor: 'white', borderStyle: 'solid' }}>
                  <AppImageView style={{ width: 200, height: 200, backgroundColor: 'white' }} src={reserve.issuer.user.imageUrl || defaultEmpty} />
                </CardAvatar>
            }
            <div style={{ minWidth: 200, minHeight: 150, alignItems: 'center', justifyContent: 'center' }}>
                <AppTextView text={reserve.info.name}/>
                <AppTextView text={`ساله${reserve.info.age}`}/>
                <AppTextView text={`کد رهگیری ${reserve.trackingCode}`}/>
                <AppTextView text={`وضعیت ${reserve.state}`}/>
                <AppTextView text={`کد ملی ${reserve.info.nationalCode}`}/>
                <AppTextView text={reserve.info.attendReason}/>
            </div>
        </Card>
  );
};

export default React.memo(DoctorReservationsList);
