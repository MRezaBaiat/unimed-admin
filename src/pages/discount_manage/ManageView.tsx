import React, { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import AppInput from '../../components/base/app_input/AppInput';
import CardFooter from '../../components/base/app_card/CardFooter';
import AppButton from '../../components/base/app_button/AppButton';
import { DiscountCoupon } from 'api';
import DiscountsApi from '../../network/DiscountsApi';
import SettingView from '../../components/composite/settings_view/SettingsView';
import NavigationHelper from '../../helpers/NavigationHelper';
import UsersApi from '../../network/UsersApi';
import CreateEditButton from '../../components/composite/privilege_managed_buttons/CreateEditButton';
import { SmartDate } from 'javascript-dev-kit';

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
    editableItem?: DiscountCoupon,
    onSuccess:(discount: DiscountCoupon)=>void,
}
export default function ManageView (props: Props) {
  const { onSuccess, editableItem } = props;
  const classes = useStyles();

  const date = new Date();
  const dayInMillisec = 1 * 24 * 60 * 60 * 1000;
  const [coupon, setCoupon] = useState(editableItem || { title: '', amount: 0, code: '', per_user_limit: 1, total_usage_limit: 100, start_date: date.getTime(), end_date: date.getTime() + dayInMillisec } as DiscountCoupon);

  const create = () => {
    DiscountsApi.createDiscount(coupon)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const edit = () => {
    const c = { ...coupon };
    // @ts-ignore
    delete c.start_date;
    // @ts-ignore
    DiscountsApi.updateDiscount(c)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const days = (coupon.end_date - coupon.start_date) / dayInMillisec;
  console.log(coupon);

  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>Complete your profile</p>
              </div>
              {
                editableItem &&
                <div>
                  <Settings discountId={editableItem._id}/>
                </div>
              }
            </CardHeader>

            <CardBody>
              <GridContainer>

                <Row
                  value={coupon.title}
                  placeholder="عنوان"
                  type={'name'}
                  onChange={(text) => setCoupon({ ...coupon, title: text })}/>

                <Row
                  value={coupon.code}
                  placeholder="کد"
                  onChange={(text) => setCoupon({ ...coupon, code: text })}/>

                <Row
                  value={String(coupon.amount)}
                  placeholder="مقدار"
                  type={'number'}
                  onChange={(text) => setCoupon({ ...coupon, amount: Number(text) })}/>

                <Row
                  value={String(coupon.per_user_limit)}
                  placeholder="محدودیت هر کاربر"
                  type={'number'}
                  onChange={(text) => setCoupon({ ...coupon, per_user_limit: Number(text) })}/>

                <Row
                  value={String(coupon.total_usage_limit)}
                  placeholder="محدودیت کلی"
                  type={'number'}
                  onChange={(text) => setCoupon({ ...coupon, total_usage_limit: Number(text) })}/>

                <Row
                  value={String(days)}
                  placeholder="تعداد روزها"
                  type={'number'}
                  onChange={(text) => { setCoupon({ ...coupon, end_date: coupon.start_date + (Number(text) * dayInMillisec) }); }}/>

                <Row
                  value={new SmartDate(coupon.start_date).formatJalali()}
                  placeholder="تاریخ شروع"
                  type={'text'}/>

                <Row
                  value={new SmartDate(coupon.end_date).formatJalali()}
                  placeholder="تاریخ پایان"
                  type={'text'}/>

              </GridContainer>
            </CardBody>
            <CardFooter>
              <CreateEditButton
                editableItem={editableItem}
                create={create}
                edit={edit}
                permission={privileges => privileges.discounts}
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
        type={type}
      />
    </GridItem>
  );
};

const Settings = ({ discountId }) => {
  return (
    <SettingView
      items={[
        {
          text: 'Delete Discount!',
          onClick: () => {
            if (window.confirm('Are you sure you want to delete this discount?')) {
              DiscountsApi.deleteDiscount(discountId);
              NavigationHelper.navigateTo('/');
            }
          }
        }
      ]}
    />
  );
};
