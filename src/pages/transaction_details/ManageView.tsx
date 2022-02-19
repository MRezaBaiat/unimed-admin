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
import CardAvatar from '../../components/base/app_card/CardAvatar';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import Settings from '@material-ui/icons/Settings';
import NavigationHelper from '../../helpers/NavigationHelper';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Transaction } from 'api';
import AppTextView from '../../components/base/app_text/AppTextView';
import { defaultEmpty } from '../../assets/images';
import { smartDate } from 'javascript-dev-kit';

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
  editableItem?: Transaction
}
export default function ManageView (props: Props) {
  const { editableItem } = props;
  const classes = useStyles();
  const [transaction, setTransaction] = useState(editableItem as Transaction);
  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Transaction</h4>
                <p className={classes.cardCategoryWhite}>Complete your profile</p>
              </div>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <CardAvatar profile style={{ marginTop: '2rem' }}>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={defaultEmpty} alt="..." />
                  </a>
                </CardAvatar>

                <Row
                  value={transaction._id}
                  placeholder="ID"/>

                <Row
                  value={transaction.amount}
                  placeholder="مقدار"/>

                <Row
                  value={transaction.discount}
                  placeholder="تخفیف"/>

                <Row
                  value={transaction.type}
                  placeholder="نوع"/>

                <Row
                  value={transaction.issuer.name}
                  placeholder="انجام دهنده"/>

                <Row
                  value={transaction.target.name}
                  placeholder="مقصد"/>

                <Row
                  value={transaction.trackingCode}
                  placeholder="کد رهگیری"/>

                <Row
                  value={transaction.visitId}
                  placeholder="کد ویزیت"/>
                {
                  transaction.healthCenter &&
                  <Row
                    value={
                      // @ts-ignore
                      transaction.healthCenter.name}
                    placeholder="نام مرکز درمانی"/>
                }
                {
                  transaction.doctorCut &&
                  <Row
                    value={transaction.doctorCut}
                    placeholder="سهم دکتر"/>
                }
                {
                  transaction.healthCenterCut &&
                  <Row
                    value={transaction.healthCenterCut}
                    placeholder="سهم مرکز درمانی"/>
                }
                <Row
                  value={smartDate(transaction.createdAt).formatJalali()}
                  placeholder="تاریخ"/>

                <Row
                  value={transaction.hint}
                  placeholder="توضیح"
                  multiline={true}
                />

              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const Row = ({ value, placeholder, multiline = false }) => {
  return (
    <GridItem md={50}>
      <AppInput
        placeholder={placeholder}
        initialvalue={value || ''}
        disabled={true}
        inputProps={{
          multiline: multiline,
          rows: 5
        }}
      />
    </GridItem>
  );
};
