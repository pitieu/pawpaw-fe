// import dependencies
import React, {useState, memo, useEffect} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';
import NavigationBar from '../../../components/NavigationBar';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const IOS = Platform.OS === 'ios';
// const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

const AddServiceDetails = props => {
  const {t, navigation, route} = props;

  const [name, setName] = useState(route.params.name);
  const [nameComponent, setNameComponent] = useState();
  const [price, setPrice] = useState(route.params.price);
  const [priceComponent, setPriceComponent] = useState();

  useEffect(() => {
    if (nameComponent) nameComponent.focus();
  }, [nameComponent]);

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
        title={t('add_service_details_title')}
        // onPressBack={navigation.goBack}
        buttonNextText={t('btnNext')}
        onPressNext={() =>
          navigateTo('AddPetService', {
            name: name,
            price: price,
          })
        }
      />
      <KeyboardAwareScrollView enableOnAndroid>
        <View style={styles.editForm}>
          <UnderlineTextInput
            onRef={r => {
              setNameComponent(r);
            }}
            overline={t('service_name')}
            placeholder={t('service_name_placeholder')}
            value={name}
            // underline="Tips: Service Name + Region"
            onChangeText={setName}
            onSubmitEditing={focusOn(priceComponent)}
            returnKeyType="next"
            mandatory={'*'}
            // focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            // inputContainerStyle={styles.inputContainerStyle}
            // showMaxLength={true}
            // maxLength={70}
            // decoBeforeInput={'Rp.'}
            // decoBeforeInputStyle={{}}
            // decoAfterInput={'Hello'}
            // decoAfterInputStyle={{color: 'red'}}
          />
          <UnderlineTextInput
            onRef={r => {
              setPriceComponent(r);
            }}
            overline={t('service_price')}
            placeholder={t('service_price_placeholder')}
            value={price}
            // underline="Tips: Service Name + Region"
            inputType="currency"
            onChangeText={setPrice}
            keyboardType={'numeric'}
            decoBeforeInput={'Rp.'}
            onSubmitEditing={() =>
              navigateTo('AddPetService', {
                name: name,
                price: price,
              })
            }
            returnKeyType="done"
            mandatory={'*'}
            // focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            // inputContainerStyle={styles.inputContainerStyle}
            // showMaxLength={true}
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
});

export default memo(withTranslation()(AddServiceDetails));
