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

const AddServiceOptions = props => {
  const {t, navigation, route} = props;

  const [isLoading, setIsLoading] = useState(false);

  const [priceComponent, setPriceComponent] = useState();
  const [descriptionComponent, setDescriptionComponent] = useState();

  const [name, setName] = useState(route?.params?.name || '');
  const [description, setDescription] = useState(
    route?.params?.description || '',
  );
  const [price, setPrice] = useState(route?.params?.price || '');

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
      addon => addon.id !== route.params.id,
    );
    Alert.alert(t('confirm_delete'), t('deleting_addon_alert'), [
      {text: t('cancel').toUpperCase(), onPress: () => {}, style: 'cancel'},
      {
        text: t('delete').toUpperCase(),
        onPress: () => {
          AsyncStorage.setItem('@addons', JSON.stringify(addons));
          navigation.goBack();
        },
        style: 'destructive',
      },
    ]);
  };

  const addAddon = () => {
    let found = false;
    let addons = route?.params?.addons.map(addon => {
      if (addon.id === route?.params?.id) {
        addon.name = name;
        addon.description = description;
        addon.price = price.replaceAll(/\./g, '');
        found = true;
      }
      return addon;
    });
    if (!found) {
      addons.push({
        name,
        description,
        price: price.replaceAll(/\./g, ''),
      });
    }

    AsyncStorage.setItem('@addons', JSON.stringify(addons));
    navigation.goBack();
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          title={t('add_service_addon_title')}
          buttonNextText={route?.params?.id ? t('Delete') : null}
          onPressNext={
            route?.params?.id ? () => deleteAddon(route?.params?.id) : null
          }
        />
        <View style={styles.container}>
          <UnderlineTextInput
            overline={t('service_addon_name')}
            placeholder={t('service_addon_name_placeholder')}
            value={name}
            onChangeText={setName}
            onSubmitEditing={focusOn(descriptionComponent)}
            returnKeyType="next"
            mandatory={'*'}
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
            placeholder={t('service_addon_price_placeholder')}
            value={price}
            inputType="currency"
            onChangeText={setPrice}
            keyboardType={'numeric'}
            decoBeforeInput={'Rp.'}
            // underline={t('service_price_tips')}
            // returnKeyType="done"
            mandatory={'*'}
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
