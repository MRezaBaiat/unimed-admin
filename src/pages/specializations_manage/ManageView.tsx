import React, { useState } from 'react';
import AppInput from '../../components/base/app_input/AppInput';
import AppButton from '../../components/base/app_button/AppButton';
import AppDropdownMenu from '../../components/base/app_dropdown/AppDropdownMenu';
import GridContainer from '../../components/base/grid/GridContainer';
import GridItem from '../../components/base/grid/GridItem';
import Card from '../../components/base/app_card/Card';
import CardHeader from '../../components/base/app_card/CardHeader';
import CardBody from '../../components/base/app_card/CardBody';
import CardFooter from '../../components/base/app_card/CardFooter';
import { makeStyles } from '@material-ui/core/styles';
import { Specialization } from 'api';
import SpecializationsApi from '../../network/SpecializationsApi';
import CreateEditButton
  from '../../components/composite/privilege_managed_buttons/CreateEditButton';

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
    onSuccess:(specialization: Specialization)=>void,
    editableItem?: Specialization
}
function ManageView (props: Props) {
  const { onSuccess, editableItem } = props;
  const classes = useStyles();
  const [spec, setSpec] = useState(editableItem || { name: '' } as Specialization);

  const create = () => {
    SpecializationsApi.createSpecialization(spec)
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const edit = () => {
    SpecializationsApi.updateSpecialization(spec)
      .then((res) => {
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
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>

            <CardBody>
              <GridContainer>

                <Row
                  value={spec.name}
                  placeholder="نام"
                  type={'name'}
                  onChange={(text) => setSpec({ ...spec, name: text })}/>

              </GridContainer>
            </CardBody>
            <CardFooter>
              <CreateEditButton
                editableItem={editableItem}
                create={create}
                edit={edit}
                permission={privileges => privileges.specializations}
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
