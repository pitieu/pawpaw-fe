// import dependencies
import React, {Fragment, memo, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ButtonGroup} from '@rneui/themed';
import {withTranslation} from 'react-i18next';
// import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import components
import NavigationBar from '../../../components/NavigationBar';
import ListService from '../../../components/list/listService';
import Divider from '../../../components/divider/Divider';
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';
import Button from '../../../components/buttons/Button';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';
import {ADD_ICON} from '../../../constants/icons';

const MIN_PRICE = 1000;
const MIN_NAME_CHARS = 3;

const AddServiceOptions = props => {
  // Todo add alert when error
  // Todo add selectable option

  const {t, navigation, route} = props;

  const [isLoading, setIsLoading] = useState(false);

  const [priceComponent, setPriceComponent] = useState();
  const [descriptionComponent, setDescriptionComponent] = useState();

  const [name, setName] = useState(route?.params?.name || '');
  const [description, setDescription] = useState(
    route?.params?.description || '',
  );
  const [price, setPrice] = useState(route?.params?.price?.toString() || '');

  // error vars
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };
  const deleteAddon = () => {
    let addons = route?.params?.addons?.filter(
      addon => addon._id !== route.params._id,
    );
    Alert.alert(t('confirm_delete'), t('deleting_addon_alert'), [
      {text: t('cancel').toUpperCase(), onPress: () => {}, style: 'cancel'},
      {
        text: t('delete').toUpperCase(),
        onPress: () => {
          if (!route?.params?.addons?.length) {
            navigation.pop();
          }
          navigation.navigate('AddServiceAddons', {
            addons,
          });
        },
        style: 'destructive',
      },
    ]);
  };

  const checkName = currName => {
    setName(currName);
    if (!currName?.length || currName?.length < MIN_NAME_CHARS) {
      setNameError(t('error_name', {chars: MIN_NAME_CHARS}));
      return true;
    } else {
      setNameError(false);
    }
    return false;
  };

  const checkPrice = currPrice => {
    setPrice(currPrice);
    const _price = parseInt(currPrice.replaceAll(/\./g, ''));
    if (!_price || _price < MIN_PRICE) {
      setPriceError(t('error_price_min', {price: MIN_PRICE}));
      return true;
    } else {
      setPriceError(false);
    }
    return false;
  };

  const validateFields = () => {
    const _name = checkName(name);
    const _price = checkPrice(price);

    return _name || _price;
  };

  const addAddon = () => {
    let found = false;

    if (validateFields()) return;

    let addons = [];
    if (route?.params?.addons?.length) {
      addons = route?.params?.addons?.map(addon => {
        if (addon._id === route?.params?._id) {
          addon.name = name;
          addon.description = description;
          addon.price = price.replaceAll(/\./g, '');
          found = true;
        }
        return addon;
      });
    }
    if (!found) {
      // todo add addon with API and get returned id
      addons.push({
        _id: new Date().getTime(),
        name,
        description,
        price: price.replaceAll(/\./g, ''),
      });
    }
    if (!route?.params?.addons?.length) {
      navigation.pop();
    }
    navigation.navigate('AddServiceAddons', {
      addons,
    });
  };

  const goBack = () => {
    if (route?.params?.addons?.length) {
      navigation.navigate('AddServiceAddons');
    } else {
      navigation.goBack();
    }
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          title={t('add_service_addon_title')}
          onPressBack={goBack}
          buttonNextText={route?.params?._id ? t('Delete') : null}
          onPressNext={
            route?.params?._id ? () => deleteAddon(route?.params?._id) : null
          }
        />
        <View style={styles.container}>
          <UnderlineTextInput
            overline={t('service_addon_name')}
            overlineColor={nameError ? Colors.error : null}
            placeholder={t('service_addon_name_placeholder')}
            value={name}
            onChangeText={checkName}
            onSubmitEditing={focusOn(descriptionComponent)}
            returnKeyType="next"
            mandatory={'*'}
            underline={nameError}
            underlineColor={nameError ? Colors.error : null}
          />
          <UnderlineTextInput
            onRef={r => {
              setDescriptionComponent(r);
            }}
            overline={t('service_addon_description')}
            placeholder={t('service_addon_description_placeholder')}
            value={description}
            onChangeText={setDescription}
            onSubmitEditing={focusOn(priceComponent)}
            returnKeyType="next"
          />
          <UnderlineTextInput
            onRef={r => {
              setPriceComponent(r);
            }}
            overline={t('service_addon_price')}
            overlineColor={priceError ? Colors.error : null}
            placeholder={t('service_addon_price_placeholder')}
            value={price}
            inputType="currency"
            onChangeText={checkPrice}
            keyboardType={'number-pad'}
            decoBeforeInput={'Rp.'}
            underline={priceError}
            underlineColor={priceError ? Colors.error : null}
            // underline={t('service_price_tips')}
            // returnKeyType="done"
            mandatory={'*'}
            returnKeyType="done"
          />
        </View>
      </SafeAreaView>
      <View style={styles.bottomButtonsContainer}>
        <Button
          color={Colors.primaryColor}
          disabled={isLoading}
          onPress={addAddon}
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
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
  },
  underlineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  underline: {
    color: Colors.onSurface,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
  },
});

export default memo(withTranslation()(AddServiceOptions));
