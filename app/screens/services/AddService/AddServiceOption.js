// import dependencies
import React, {Fragment, memo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [timeComponent, setTimeComponent] = useState();
  const [weightStartComponent, setWeightStartComponent] = useState();
  const [weightEndComponent, setWeightEndComponent] = useState();

  const [name, setName] = useState(route?.params?.name || '');
  const [description, setDescription] = useState(
    route?.params?.description || '',
  );
  const [price, setPrice] = useState(route?.params?.price || '');
  const [time, setTime] = useState(route?.params?.time || '');
  const [weightStart, setWeightStart] = useState(
    route?.params?.weightStart || '',
  );
  const [weightEnd, setWeightEnd] = useState(route?.params?.weightEnd || '');

  const [selectedIndex, setSelectedIndex] = useState(
    route?.params?.priceType === 'weight'
      ? 1
      : route?.params?.priceType === 'time'
      ? 2
      : 0,
  );

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };
  const deleteServiceOption = () => {
    let services = route?.params?.services?.filter(
      service => service.id !== route.params.id,
    );
    Alert.alert(t('confirm_delete'), t('deleting_service_alert'), [
      {text: t('cancel').toUpperCase(), onPress: () => {}, style: 'cancel'},
      {
        text: t('delete').toUpperCase(),
        onPress: () => {
          AsyncStorage.setItem('@services', JSON.stringify(services));
          navigation.goBack();
        },
        style: 'destructive',
      },
    ]);
  };

  const addServiceOption = () => {
    let found = false;
    let services = route?.params?.services.map(addon => {
      if (addon.id === route?.params?.id) {
        addon.name = name;
        addon.description = description;
        addon.price = price.replaceAll(/\./g, '');
        addon.weightStart = weightStart;
        addon.weightEnd = weightEnd;
        addon.time = time;
        found = true;
      }
      return addon;
    });
    if (!found) {
      services.push({
        name,
        description,
        price: price.replaceAll(/\./g, ''),
        time,
        weightStart,
        weightEnd,
      });
    }

    AsyncStorage.setItem('@services', JSON.stringify(services));
    navigation.goBack();
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          title={t('add_service_options_title')}
          buttonNextText={route?.params?.id ? t('Delete') : null}
          onPressNext={
            route?.params?.id
              ? () => deleteServiceOption(route?.params?.id)
              : null
          }
        />
        <View style={styles.container}>
          <UnderlineTextInput
            overline={t('service_option_name')}
            placeholder={t('service_option_name_placeholder')}
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
            overline={t('service_description')}
            placeholder={t('service_description_placeholder')}
            value={description}
            onChangeText={setDescription}
            onSubmitEditing={focusOn(priceComponent)}
            returnKeyType="next"
          />
          <UnderlineTextInput
            onRef={r => {
              setPriceComponent(r);
            }}
            overline={t('service_price')}
            placeholder={t('service_price_placeholder')}
            value={price}
            inputType="currency"
            onChangeText={setPrice}
            keyboardType={'numeric'}
            decoBeforeInput={'Rp.'}
            // underline={t('service_price_tips')}
            // returnKeyType="done"
            mandatory={'*'}
          />
          <ButtonGroup
            onPress={setSelectedIndex}
            selectedIndex={selectedIndex}
            buttons={['None', 'Weight', 'Time']}
            containerStyle={{marginTop: 20}}
          />
          {selectedIndex == 1 && (
            <View style={{marginTop: 0, flexDirection: 'row'}}>
              <UnderlineTextInput
                wrapperStyle={{flex: 1}}
                onRef={r => {
                  setWeightStartComponent(r);
                }}
                // overline={' '}
                placeholder={'0'}
                value={weightStart}
                inputType="currency"
                onChangeText={setWeightStart}
                keyboardType={'numeric'}
                decoAfterInput={'kg.'}
                // underline={t('service_price_tips')}
                returnKeyType="next"
                // mandatory={'*'}
              />
              <Text style={{alignSelf: 'flex-end', margin: 15}}>To</Text>
              <UnderlineTextInput
                wrapperStyle={{flex: 1}}
                onRef={r => {
                  setWeightEndComponent(r);
                }}
                // overline={' '}
                placeholder={'10'}
                value={weightEnd}
                inputType="currency"
                onChangeText={setWeightEnd}
                keyboardType={'numeric'}
                decoAfterInput={'kg.'}
                onSubmitEditing={addServiceOption}
                // underline={t('service_price_tips')}
                returnKeyType="done"
              />
            </View>
          )}
          {selectedIndex == 1 && (
            <View style={styles.underlineContainer}>
              <Text style={styles.underline}>
                Price above will be defined for pets in this weight range.
              </Text>
            </View>
          )}
          {selectedIndex == 2 && (
            <View style={{marginTop: 0, flexDirection: 'row'}}>
              <UnderlineTextInput
                wrapperStyle={{flex: 1}}
                onRef={r => {
                  setTimeComponent(r);
                }}
                // overline={' '}
                placeholder={'30'}
                value={time}
                // inputType="currency"
                onChangeText={setTime}
                keyboardType={'numeric'}
                decoAfterInput={'min'}
                // underline={t('service_price_tips')}
                onSubmitEditing={addServiceOption}
                returnKeyType="done"
                // mandatory={'*'}
              />
            </View>
          )}
          {selectedIndex == 2 && (
            <View style={styles.underlineContainer}>
              <Text style={styles.underline}>
                Price will be charged for this duration.
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
      <View style={styles.bottomButtonsContainer}>
        <Button
          color={Colors.primaryColor}
          disabled={isLoading}
          onPress={addServiceOption}
          title={
            isLoading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              t('add_service_option').toUpperCase()
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
