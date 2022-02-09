import React, { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import AppInput from '../../components/base/app_input/AppInput';
import CardAvatar from '../../components/base/app_card/CardAvatar';
import { formatDateShamsi } from '../../helpers/index';
import AppButton from '../../components/base/app_button/AppButton';
import { Modal } from '@material-ui/core';
import NavigationHelper from '../../helpers/NavigationHelper';
import { ServiceRequest } from 'api';
import CardFooter from '../../components/base/app_card/CardFooter';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import AppTextView from '../../components/base/app_text/AppTextView';
import ServiceRequestsApi from '../../network/ServiceRequestsApi';
import CreateEditButton from '../../components/composite/privilege_managed_buttons/CreateEditButton';
import DeleteButton from '../../components/composite/privilege_managed_buttons/DeleteButton';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0'
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none'
  }
};

// @ts-ignore
const useStyles = makeStyles(styles);

interface Props {
  editableItem?: ServiceRequest
}
export default function ManageView (props: Props) {
  const { editableItem } = props;
  const classes = useStyles();
  const [request, setRequest] = useState(editableItem as ServiceRequest);

  const edit = () => {
    const c = {
      ...request,
      service: undefined,
      trackingCode: undefined,
      request_date: undefined,
      requester: undefined,
      app: undefined
    };
    ServiceRequestsApi.updateServiceRequest(c).then(() => {
      NavigationHelper.goBack();
    });
  };

  const deleteRequest = () => {
    ServiceRequestsApi.deleteServiceRequest(request._id).then(() => {
      NavigationHelper.goBack();
    });
  };

  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Service Request</h4>
                <p className={classes.cardCategoryWhite}>Details of the request</p>
              </div>
            </CardHeader>
            <CardBody>
              <GridContainer>

                <AppTextView
                  text={': وضعیت'}
                  style={{ alignSelf: 'center' }}
                />
                <AppDropdownMenu
                  initialValue={request.status}
                  onClick={(value) => {
                    setRequest({
                      ...request,
                      status: value
                    });
                  }}
                  items={[{ text: 'در انتظار پرداخت', value: 'WAITING_PAYMENT' }, { text: 'در دست اقدام', value: 'PROCESSING' }, { text: 'پایان یافته', value: 'ENDED' }, { text: 'کنسل شده', value: 'CANCELLED' }, { text: 'در حال بررسی', value: 'CHECKING' }]}
                />

                <Row
                  value={request.service
                    // @ts-ignore
                    ? request.service.title : 'Unknown'}
                  placeholder="نوع سرویس"/>

                <Row
                  value={request.mobile}
                  placeholder="موبایل"/>

                <Row
                  value={formatDateShamsi(request.request_date)}
                  placeholder="تاریخ درخواست"/>

                <Row
                  value={request.details}
                  placeholder="جزئیات"/>

                <Row
                  value={request._id}
                  placeholder="ID"/>

                <Row
                  value={request.age}
                  placeholder="سن"/>

                <Row
                  value={request.gender}
                  placeholder="جنسیت"/>

                <Row
                  value={request.app}
                  placeholder="App"/>

                <Row
                  value={request.price}
                  placeholder="هزینه"
                  onChange={(text) => {
                    setRequest({
                      ...request,
                      price: Number(text)
                    });
                  }}
                />
                <CreateEditButton
                  editableItem={true}
                  create={() => {}}
                  edit={edit}
                  permission={privileges => privileges.serviceRequests}
                />
                <DeleteButton
                  deleteFnc={deleteRequest}
                  permission={privileges => privileges.serviceRequests}
                />

              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const Row = ({ value, placeholder, multiline = false, onChange = undefined as any }) => {
  return (
    <GridItem md={50}>
      <AppInput
        onChange={onChange}
        placeholder={placeholder}
        initialvalue={value || ''}
        disabled={!onChange}
        inputProps={{
          multiline: multiline,
          rows: 5
        }}
      />
    </GridItem>
  );
};
