// import dependencies
import React, {useState, memo} from 'react';
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
// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';
import NavigationBar from '../../../components/NavigationBar';
import Divider from '../../../components/divider/Divider';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const BG_CHECKBOX = '#F8F8F8';

const AddServiceDelivery = props => {
  const {t, navigation, route} = props;

  const [deliveryLocation, setDeliveryLocation] = useState(
    route.params.deliveryLocation,
  );
  const [deliveryFee, setDeliveryFee] = useState(route.params.deliveryFee);
  const [deliveryFeeComponent, setDeliveryFeeComponent] = useState();
  const [deliveryLocationStore, setDeliveryLocationStore] = useState(
    route.params.deliveryLocationStore,
  );
  const [deliveryLocationHome, setDeliveryLocationHome] = useState(
    route.params.deliveryLocationHome,
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        {/* <StatusBar backgroundColor={Colors.statusBarColor} /> */}
        <NavigationBar
          title={t('add_service_delivery_title')}
          // onPressBack={navigation.goBack}
          buttonNextText={t('btnNext')}
          onPressNext={() =>
            navigateTo('AddPetService', {
              deliveryFee: deliveryFee,
            })
          }
        />
        <KeyboardAwareScrollView enableOnAndroid>
          <Text style={styles.overline}>
            {t('service_delivery_location')}&nbsp;
          </Text>
          <Text style={{paddingHorizontal: 20, paddingBottom: 20}}>
            Select location where this service can be performed.
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
              title="At your store"
              containerStyle={styles.checkBoxContainer}
              wrapperStyle={styles.checkBoxWrapper}
              textStyle={styles.checkBoxText}
              checkedColor={Colors.focusColor}
              iconType="ionicon"
              checkedIcon="checkbox"
              uncheckedIcon="square-outline"
              iconRight={true}
              right={true}
              checked={deliveryLocationStore}
              onPress={() => setDeliveryLocationStore(!deliveryLocationStore)}
            />
          </View>
          <Divider
            type="inset"
            color={
              deliveryLocationHome && deliveryLocationStore ? '#FFF' : '#eeeeee'
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
              title="At customer's home"
              containerStyle={styles.checkBoxContainer}
              wrapperStyle={styles.checkBoxWrapper}
              textStyle={styles.checkBoxText}
              iconType="ionicon"
              checkedIcon="checkbox"
              uncheckedIcon="square-outline"
              checkedColor={Colors.focusColor}
              iconRight={true}
              right={true}
              checked={deliveryLocationHome}
              onPress={() => setDeliveryLocationHome(!deliveryLocationHome)}
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
                // onSubmitEditing={focusOn(priceComponent)}
                inputType="currency"
                keyboardType={'numeric'}
                returnKeyType="next"
                // mandatory={'*'}
                // focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                // inputContainerStyle={styles.inputContainerStyle}
                // showMaxLength={true}
                // maxLength={70}
                decoBeforeInput={'Rp.'}
                // decoBeforeInputStyle={{}}
                decoAfterInput={'per km'}
                // decoAfterInputStyle={{color: 'red'}}
              />
            )}
          </View>
          <Divider type="inset" />
        </KeyboardAwareScrollView>
      </View>
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
});

export default memo(withTranslation()(AddServiceDelivery));
