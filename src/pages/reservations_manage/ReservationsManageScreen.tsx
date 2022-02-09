import React, { useEffect, useState } from 'react';
import ReservationsList from '../../components/composite/doctor_reservations_list/DoctorReservationsList';
import NavigationHelper from '../../helpers/NavigationHelper';
import AppScrollable from '../../components/base/app_scrollable/AppScrollable';

interface Props {
  doctorId: string,
  reservationId: string
}
function ReservationsManageScreen (props: Props) {
  // @ts-ignore
  const doctorId = NavigationHelper.getParam(props, 'doctorId');
  const reservationId = NavigationHelper.getParam(props, 'reservationId');

  return (
        <AppScrollable style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ReservationsList doctorId={doctorId} reservationId={reservationId} onSelect={() => {}}/>
        </AppScrollable>
  );
}

export default React.memo(ReservationsManageScreen);
