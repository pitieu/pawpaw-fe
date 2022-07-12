// import dependencies
import React, {Fragment, memo, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView, StyleSheet, View, Text, Alert} from 'react-native';
import {ButtonGroup} from '@rneui/themed';
import {withTranslation} from 'react-i18next';
// import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
import {onlyOneComma} from '../../../utils';

const MIN_PRICE = 10000;
const MIN_NAME_CHARS = 3;

const timeList = [
  {label: '15 minutes', value: '15'},
  {label: '30 minutes', value: '30'},
  {label: '1 hour', value: '60'},
  {label: '2 hours', value: '120'},
  {label: '8 hours', value: '480'},
  {label: '1 day', value: '1440'},
  {label: '1 week', value: '10080'},
  {label: '1 month', value: '40320'},
];

const AddServiceOptions = props => {
  // Todo add alert when error
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
  const [price, setPrice] = useState(route?.params?.price?.toString() || '');
  const [time, setTime] = useState(route?.params?.time?.toString() || '');
  const [weightStart, setWeightStart] = useState(
    route?.params?.weightStart?.toString() ||
      route?.params?.weight?.start?.toString().replaceAll(/\./g, ',') ||
      '',
  );
  const [weightEnd, setWeightEnd] = useState(
    route?.params?.weightEnd?.toString() ||
      route?.params?.weight?.end?.toString().replaceAll(/\./g, ',') ||
      '',
  );
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  // error vars
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [weightStartError, setWeightStartError] = useState(false);
  const [weightEndError, setWeightEndError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  useEffect(() => {
    let indexes = [];
    if (route?.params?.weightSelected) indexes.push(0);
    if (route?.params?.timeSelected) indexes.push(1);
    setSelectedIndexes(indexes);
  }, []);

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
      service => service._id !== route.params._id,
    );
    Alert.alert(t('confirm_delete'), t('deleting_service_alert'), [
      {text: t('cancel').toUpperCase(), onPress: () => {}, style: 'cancel'},
      {
        text: t('delete').toUpperCase(),
        onPress: () => {
          if (!route?.params?.services?.length) {
            navigation.pop();
          }
          navigation.navigate('AddServiceOptions', {
            services,
          });
        },
        style: 'destructive',
      },
    ]);
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

  const checkWeightStart = currWeight => {
    currWeight = onlyOneComma(currWeight, 1);

    setWeightStart(currWeight);
    const _weightStart = parseFloat(currWeight);
    const _weightEnd = parseFloat(weightEnd);
    if (
      (!currWeight.length || _weightStart >= _weightEnd) &&
      selectedIndexes.indexOf(0) > -1
    ) {
      if (!currWeight.length) {
        setWeightStartError(t('error_weight_start_min', {weight: _weightEnd}));
      } else {
        setWeightStartError(t('error_weight_start', {weight: _weightEnd}));
      }
      return true;
    } else {
      setWeightStartError(false);
    }
    return false;
  };

  const checkWeightEnd = currWeight => {
    currWeight = onlyOneComma(currWeight, 1);
    setWeightEnd(currWeight);

    const _weightStart = parseFloat(weightStart);
    const _weightEnd = parseFloat(currWeight);
    if (!currWeight.length && selectedIndexes.indexOf(0) > -1) {
      setWeightEndError(t('error_weight_end_min'));
      return true;
    } else if (_weightStart >= _weightEnd && selectedIndexes.indexOf(0) > -1) {
      setWeightStartError(t('error_weight_start', {weight: _weightEnd}));
      return true;
    } else {
      setWeightEndError(false);
      setWeightStartError(false);
    }
    return false;
  };

  const checkTime = currTime => {
    setTime(currTime);
    if (!currTime && selectedIndexes.indexOf(1) > -1) {
      setTimeError(true);
      return true;
    } else {
      setTimeError(false);
    }
    return false;
  };

  const validateFields = () => {
    const _name = checkName(name);
    const _price = checkPrice(price);
    const _weightStart = checkWeightStart(weightStart);
    const _weightEnd = checkWeightEnd(weightEnd);
    const _time = checkTime(time);
    return _name || _price || _weightStart || _weightEnd || _time;
  };

  const addServiceOption = () => {
    console.log('route?.params?._id', route?.params?._id);
    let found = false;
    // Toast.hide();

    if (validateFields()) return;

    let services = [];
    if (route?.params?.services?.length) {
      services = route?.params?.services?.map(service => {
        if (service._id === route?.params?._id) {
          service.name = name;
          service.description = description;
          service.price = price.replaceAll(/\./g, '');
          service.weightStart = weightStart;
          service.weightEnd = weightEnd;
          service.weightSelected = selectedIndexes.indexOf(0) > -1;
          service.time = time;
          service.timeSelected = selectedIndexes.indexOf(1) > -1;
          found = true;
        }
        return service;
      });
    }

    if (!found) {
      services.push({
        _id: new Date().getTime(),
        name,
        description,
        price: price.replaceAll(/\./g, ''),
        time,
        weightStart,
        weightEnd,
        weightSelected: selectedIndexes.indexOf(0) > -1,
        timeSelected: selectedIndexes.indexOf(1) > -1,
      });
    }
    console.log(services);

    if (!route?.params?.services?.length) {
      navigation.pop();
    }
    navigation.navigate('AddServiceOptions', {
      services,
    });
  };

  const goBack = () => {
    if (route?.params?.services?.length) {
      navigation.navigate('AddServiceOptions', {
        services: route?.params?.services,
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          title={t('add_service_options_title')}
          onPressBack={goBack}
          buttonNextText={route?.params?._id ? t('Delete') : null}
          onPressNext={
            route?.params?._id
              ? () => deleteServiceOption(route?.params?._id)
              : null
          }
        />

        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.container}>
            <UnderlineTextInput
              overline={t('service_option_name')}
              overlineColor={nameError ? Colors.error : null}
              placeholder={t('service_option_name_placeholder')}
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
              overlineColor={priceError ? Colors.error : null}
              placeholder={t('service_price_placeholder')}
              value={price}
              inputType="currency"
              onChangeText={checkPrice}
              keyboardType={'number-pad'}
              decoBeforeInput={'Rp.'}
              // underline={t('service_price_tips')}
              underline={priceError}
              underlineColor={priceError ? Colors.error : null}
              mandatory={'*'}
              returnKeyType="done"
            />
          </View>
          <View
            style={{
              borderTopColor: Colors.lightGray,
              borderTopWidth: 1,
              paddingHorizontal: Layout.LARGE_PADDING,
              paddingBottom: Layout.LARGE_PADDING,
              marginTop: Layout.LARGE_MARGIN,
            }}>
            <ButtonGroup
              containerStyle={{
                marginLeft: 0,
                marginRight: 0,
                marginTop: 20,
              }}
              selectedButtonStyle={{
                backgroundColor: Colors.primaryColor,
                color: Colors.onPrimaryColor,
              }}
              onPress={value => {
                setSelectedIndexes(value);
              }}
              selectMultiple
              selectedIndexes={selectedIndexes}
              buttons={[t('option_by_weight'), t('option_by_time')]}
            />
            {selectedIndexes.indexOf(0) > -1 && (
              <View style={{marginTop: 0, flexDirection: 'row'}}>
                <UnderlineTextInput
                  wrapperStyle={{flex: 1}}
                  onRef={r => {
                    setWeightStartComponent(r);
                  }}
                  placeholder={'0'}
                  value={weightStart}
                  onChangeText={checkWeightStart}
                  keyboardType={'numeric'}
                  decoAfterInput={'kg.'}
                  returnKeyType="done"
                />
                <Text style={{alignSelf: 'flex-end', margin: 15}}>To</Text>
                <UnderlineTextInput
                  wrapperStyle={{flex: 1}}
                  onRef={r => {
                    setWeightEndComponent(r);
                  }}
                  placeholder={'10'}
                  value={weightEnd}
                  onChangeText={checkWeightEnd}
                  keyboardType={'numeric'}
                  decoAfterInput={'kg.'}
                  returnKeyType="done"
                />
              </View>
            )}
            {selectedIndexes.indexOf(0) > -1 && (
              <View style={styles.underlineContainer}>
                <Text
                  style={[
                    styles.underline,
                    weightStartError || weightEndError
                      ? {color: Colors.error}
                      : {},
                  ]}>
                  {weightStartError
                    ? weightStartError
                    : weightEndError
                    ? weightEndError
                    : t('price_by_weight_info')}
                </Text>
              </View>
            )}
            {selectedIndexes.indexOf(1) > -1 && (
              <View style={{marginTop: 0, flexDirection: 'row'}}>
                <Dropdown
                  style={[
                    styles.timeDropdown,

                    timeError ? {borderColor: Colors.error} : {},
                  ]}
                  data={timeList}
                  maxHeight={200}
                  labelField="label"
                  valueField="value"
                  placeholder={t('service_select_timeframe')}
                  value={time}
                  onChange={item => {
                    checkTime(item.value);
                  }}
                />
              </View>
            )}
            {selectedIndexes.indexOf(1) > -1 && (
              <View style={styles.underlineContainer}>
                <Text
                  style={[
                    styles.underline,
                    timeError ? {color: Colors.error} : {},
                  ]}>
                  {timeError ? t('error_time') : t('price_by_time_info')}
                </Text>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
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
  timeDropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginTop: 30,
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
