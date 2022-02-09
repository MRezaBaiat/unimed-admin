import React, { useState } from 'react';
import AppInput from '../../components/base/app_input/AppInput';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import CardFooter from '../../components/base/app_card/CardFooter';
import { makeStyles } from '@material-ui/core/styles';
import { Notification } from 'api';
import CreateEditButton
  from '../../components/composite/privilege_managed_buttons/CreateEditButton';
import NotificationsApi from '../../network/NotificationsApi';
import { formatDateShamsi } from '../../helpers';

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
    onSuccess:(notification: Notification)=>void,
    editableItem?: Notification
}
function ManageView (props: Props) {
  const { onSuccess, editableItem } = props;
  const classes = useStyles();
  const [notification, setNotification] = useState(editableItem || { title: '', body: '', link: '' } as Notification);

  const send = () => {
    const n: any = {
      title: notification.title,
      body: notification.body,
      link: notification.link
    };
    NotificationsApi.postNotification(n)
      .then((res) => {
        // @ts-ignore
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Notification</h4>
              <p className={classes.cardCategoryWhite}>Complete notification</p>
            </CardHeader>

            <CardBody>
              <GridContainer>

                <Row
                  value={notification.title}
                  placeholder="تیتر"
                  type={'name'}
                  onChange={(text) => { setNotification({ ...notification, title: text }); }}
                />

                <Row
                  value={notification.body}
                  placeholder="متن"
                  type={'name'}
                  onChange={(text) => { setNotification({ ...notification, body: text }); }}
                />

                <Row
                  value={notification.link}
                  placeholder="لینک"
                  onChange={(text) => { setNotification({ ...notification, link: text }); }}
                />

                {
                  editableItem &&
                      <div>
                        <Row
                          value={notification.state}
                          placeholder="وضعیت"
                          type={'name'}/>

                        <Row
                          value={formatDateShamsi(notification.date)}
                          placeholder="تاریخ"
                          type={'name'}/>

                        <Row
                          value={notification.sender
                            // @ts-ignore
                            ? notification.sender.name : 'Unknown'}
                          placeholder="فرستنده"
                          type={'name'}/>

                        <Row
                          value={notification.successCount}
                          placeholder="تعداد ارسال"
                          type={'name'}/>

                      </div>
                }

              </GridContainer>
            </CardBody>
            <CardFooter>
              <CreateEditButton
                editableItem={editableItem}
                create={send}
                edit={send}
                texts={{ create: 'ارسال', save: 'ارسال مجدد' }}
                permission={privileges => privileges.notifications}
              />
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>

  );
}

const Row = ({ value, placeholder, type = 'text', onChange = undefined as any }) => {
  return (
    <GridItem md={50}>
      <AppInput
        placeholder={placeholder}
        initialvalue={value}
        disabled={!onChange}
        onChange={onChange}
        inputProps={{
          disabled: !onChange
        }}
        type={type}
      />
    </GridItem>
  );
};

export default React.memo(ManageView);
