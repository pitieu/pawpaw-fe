// import dependencies
import React, {useState, memo} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ButtonGroup, CheckBox} from '@rneui/themed';
// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';
import NavigationBar from '../../../components/NavigationBar';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const IOS = Platform.OS === 'ios';
// const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

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
    <SafeAreaView style={styles.container}>
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
        <View style={styles.editForm}>
          <Text style={styles.overline}>
            {t('service_delivery_location')}&nbsp;*
          </Text>
          <CheckBox
            center
            title="At the store"
            wrapperStyle={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            iconRight={true}
            right={true}
            checked={deliveryLocationStore}
            onPress={() => setDeliveryLocationStore(!deliveryLocationStore)}
          />
          <ButtonGroup
            buttons={[
              t('service_delivery_location_option1'),
              t('service_delivery_location_option2'),
            ]}
            selectedIndex={selectedIndex}
            onPress={value => {
              setSelectedIndex(value);
            }}
          />
          <Text>{t('service_delivery_location_tips')}</Text>
          <UnderlineTextInput
            onRef={r => {
              setDeliveryFeeComponent(r);
            }}
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
            // decoAfterInput={'Hello'}
            // decoAfterInputStyle={{color: 'red'}}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  editForm: {
    padding: Layout.LARGE_MARGIN,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overline: {
    marginTop: 30,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default memo(withTranslation()(AddServiceDelivery));
