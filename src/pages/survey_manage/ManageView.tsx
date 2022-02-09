import React, { useEffect, useState } from 'react';
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
import { Visit, VisitStatus } from 'api';
import AppButton from '../../components/base/app_button/AppButton';
import { Modal } from '@material-ui/core';
import VisitsApi from '../../network/VisitsApi';
import NavigationHelper from '../../helpers/NavigationHelper';
import { store } from '../../index';

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
  editableItem?: Visit
}
export default function ManageView (props: Props) {
  const { editableItem } = props;
  const classes = useStyles();
  const [visit, setVisit] = useState(editableItem as Visit);

  return (
    <div style={{ width: '50vw', height: '100vh' }}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={0}>
          <Card>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between' }} color="primary">
              <div>
                <h4 className={classes.cardTitleWhite}>Survey</h4>
                <p className={classes.cardCategoryWhite}>Survey details</p>
              </div>
            </CardHeader>
            <CardBody>
              <GridContainer>

                <Row
                  value={visit._id}
                  placeholder="ID"/>

                <Row
                  value={visit.rating.doctor_detailed_consequences}
                  placeholder="توضیح در مورد عواقب دارو ها"/>
                <Row
                  value={visit.rating.doctor_details_clearity}
                  placeholder="وضوح توضیحات دکتر"/>
                <Row
                  value={visit.rating.doctor_solutions}
                  placeholder="ارایه راه حل ها"/>
                <Row
                  value={visit.rating.environment_details}
                  placeholder="محیط"/>
                <Row
                  value={visit.rating.service_quality}
                  placeholder="کیفیت خدمات"/>

                <Row
                  value={visit.rating.video_call_satisfaction}
                  placeholder="تماس تصویری"/>

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
