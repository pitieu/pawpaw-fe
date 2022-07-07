// import dependencies
import React, {Fragment, useState, memo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CheckBox} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {t} from 'i18next';

// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';
import NavigationBar from '../../../components/NavigationBar';
import Divider from '../../../components/divider/Divider';
import Button from '../../../components/buttons/Button';

// api
import {toast} from '../../../store/actions/toast';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const BG_CHECKBOX = '#F8F8F8';

const AddServiceDelivery = props => {
  const {navigation, route} = props;
  const [isLoading, setIsLoading] = useState(false);

  const [deliveryLocation, setDeliveryLocation] = useState(
    route.params.deliveryLocation,
  );
  const [deliveryFee, setDeliveryFee] = useState(
    route.params.deliveryFee?.toString(),
  );
  const [deliveryFeeComponent, setDeliveryFeeComponent] = useState();
  const [deliveryLocationStore, setDeliveryLocationStore] = useState(
    route.params.deliveryLocationStore,
  );
  const [deliveryLocationHome, setDeliveryLocationHome] = useState(
    route.params.deliveryLocationHome,
  );

  const [locationError, setLocationError] = useState(false);

  focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };
  const save = () => {
    Toast.hide();

    if (!deliveryLocationStore && !deliveryLocationHome) {
      props.toast(t('error_location_required'));
      setLocationError(true);
    } else {
      setLocationError(false);
      navigateTo('AddPetService', {
        deliveryFee:
          deliveryFee && deliveryFee.length > 2 // requires at least 3 digits to have valid number with decimal
            ? deliveryFee.replaceAll(/\./g, '')
            : deliveryFee,
        deliveryLocationStore,
        deliveryLocationHome,
      });
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Fragment>
        <View style={styles.container}>
          {/* <StatusBar backgroundColor={Colors.statusBarColor} /> */}
          <NavigationBar
            title={t('add_service_delivery_title')}
            // onPressBack={navigation.goBack}
          />
          <KeyboardAwareScrollView enableOnAndroid>
            <Text style={styles.overline}>
              {t('service_delivery_location')}&nbsp;
            </Text>
            <Text style={{paddingHorizontal: 20, paddingBottom: 20}}>
              {t('service_delivery_location_info')}
            </Text>
            <Divider type="inset" />
            <View
              style={[
                styles.mainCheckboxWrapper,
                {
                  backgroundColor: deliveryLocationStore
                    ? BG_CHECKBOX
                    : 'transparent',
                },
              ]}>
              <CheckBox
                title={t('service_delivery_location_option1')}
                containerStyle={styles.checkBoxContainer}
                wrapperStyle={styles.checkBoxWrapper}
                textStyle={[
                  styles.checkBoxText,
                  locationError ? {color: Colors.error} : {},
                ]}
                checkedColor={Colors.focusColor}
                iconType="ionicon"
                checkedIcon="checkbox"
                uncheckedIcon="square-outline"
                iconRight={true}
                right={true}
                checked={deliveryLocationStore}
                onPress={() => {
                  setDeliveryLocationStore(() => {
                    setLocationError(
                      !(!deliveryLocationStore == true || deliveryLocationHome),
                    );
                    return !deliveryLocationStore;
                  });
                }}
              />
            </View>
            <Divider
              type="inset"
              color={
                deliveryLocationHome && deliveryLocationStore
                  ? '#FFF'
                  : '#eeeeee'
              }
            />

            <View
              style={[
                styles.mainCheckboxWrapper,
                {
                  backgroundColor: deliveryLocationHome
                    ? BG_CHECKBOX
                    : 'transparent',
                },
              ]}>
              <CheckBox
                title={t('service_delivery_location_option2')}
                containerStyle={styles.checkBoxContainer}
                wrapperStyle={styles.checkBoxWrapper}
                textStyle={[
                  styles.checkBoxText,
                  locationError ? {color: Colors.error} : {},
                ]}
                iconType="ionicon"
                checkedIcon="checkbox"
                uncheckedIcon="square-outline"
                checkedColor={Colors.focusColor}
                iconRight={true}
                right={true}
                checked={deliveryLocationHome}
                onPress={() => {
                  setDeliveryLocationHome(() => {
                    setLocationError(
                      !(deliveryLocationStore || !deliveryLocationHome == true),
                    );
                    return !deliveryLocationHome;
                  });
                }}
              />
              {deliveryLocationHome && <Divider type="inset" color={'#eee'} />}
              {deliveryLocationHome && (
                <UnderlineTextInput
                  onRef={r => {
                    setDeliveryFeeComponent(r);
                  }}
                  wrapperStyle={{paddingBottom: 10}}
                  overlineStyle={{marginTop: 20}}
                  overline={t('service_delivery_fee')}
                  placeholder={t('service_delivery_fee_placeholder')}
                  value={deliveryFee}
                  underline={t('service_delivery_fee_tips')}
                  onChangeText={setDeliveryFee}
                  inputType="currency"
                  keyboardType={'number-pad'}
                  returnKeyType="done"
                  decoBeforeInput={'Rp.'}
                  decoAfterInput={'per km'}
                />
              )}
            </View>
            <Divider type="inset" />
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <Button
            color={Colors.primaryColor}
            disabled={isLoading}
            onPress={save}
            title={
              isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                t('add_service_addon').toUpperCase()
              )
            }
            titleColor={Colors.onPrimaryColor}
          />
        </View>
      </Fragment>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overline: {
    marginTop: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    paddingHorizontal: Layout.LARGE_MARGIN,
  },
  checkBoxText: {
    margin: 0,
    marginLeft: 0,
    fontWeight: '500',
  },
  checkBoxWrapper: {
    padding: 0,
    margin: 0,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  checkBoxContainer: {
    padding: 0,
    paddingVertical: 10,
    // margin: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'transparent',
  },
  mainCheckboxWrapper: {
    paddingHorizontal: Layout.LARGE_MARGIN,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    paddingBottom: 0,
    backgroundColor: '#fff',
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toast,
    },
    dispatch,
  );

export default memo(connect(null, mapDispatchToProps)(AddServiceDelivery));
