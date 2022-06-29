// import dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useState,
  memo,
  useMemo,
  Fragment,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Animated,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {t} from 'i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import {ScrollView} from 'react-native-virtualized-view';
// components
import UploadImage from '../../../components/image/uploadImage';
import ListItem from '../../../components/list/listItem';
import Divider from '../../../components/divider/Divider';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import CameraTaker from '../../../components/camera/cameraGallerySelector';
import NavigationBar from '../../../components/NavigationBar';
import TouchableItem from '../../../components/TouchableItem';
import VirtualizedScrollView from '../../../components/scrollview/VirtualizedScrollView';

// api
import {addService} from '../../../store/actions/service';

// import utility
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../constants';
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const AddPetService = props => {
  const isFocused = useIsFocused();

  const {navigation, route} = props;
  const [isLoading, setIsLoading] = useState(false);

  // camera and upload image
  const uploadImageComponent = useRef();
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState([]);
  const offsetX = useMemo(() => new Animated.Value(SCREEN_WIDTH), []);
  // service details
  const [name, setName] = useState(route.params.name);
  const [price, setPrice] = useState(route.params.price);
  const [description, setDescription] = useState(route.params.description);
  const [services, setServices] = useState(route.params.services);
  const [addons, setAddons] = useState(route.params.addons);
  //service delivery
  const [deliveryLocationStore, setDeliveryLocationStore] = useState(
    route.params.deliveryLocationStore || false,
  );
  const [deliveryLocationHome, setDeliveryLocationHome] = useState(
    route.params.deliveryLocationHome || false,
  );
  const [deliveryFee, setDeliveryFee] = useState(route.params.deliveryFee);

  // Error vars
  const [uploadError, setUploadError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [servicesError, setServicesError] = useState(false);
  const [addonsError, setAddonsError] = useState(false);
  const [deliveryError, setDeliveryError] = useState(false);

  useEffect(() => {
    // console.log('set route', route.params);

    // service details
    setName(() => route.params.name);
    setPrice(() => route.params.price);
    setDescription(() => route.params.description);
    //service delivery
    setDeliveryLocationStore(() => route.params.deliveryLocationStore);
    setDeliveryLocationHome(() => route.params.deliveryLocationHome);
    setDeliveryFee(() => route.params.deliveryFee);
    if (route.params.services) {
      setServices(() => route.params.services);
    }
    if (route.params.addons) {
      setAddons(() => route.params.addons);
    }
  }, [route]);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const callPhoto = async _photos => {
    toggleCamera();
    // console.log(_photos);
    // using seTimeout to allow camera UI to show so that updatePhotos can be called
    setTimeout(() => {
      setPhotos(_photos);
      uploadImageComponent.current.updatePhotos(_photos);
    }, 20);
  };

  const toggleCamera = () => {
    console.log('toggleCamera');
    setShowCamera(showCamera => {
      const val = showCamera ? SCREEN_WIDTH : 0;
      Animated.timing(offsetX, {
        duration: 200,
        toValue: val,
        useNativeDriver: true,
      }).start();
      return !showCamera;
    });
  };

  const checkColor = useCallback(type => {
    if (type == 'upload') {
      if (photos?.length) return 'green';
      if (uploadError) return Colors.error;
    }
    if (type == 'service_name') {
      if (name) return 'green';
      if (nameError) return Colors.error;
    }
    if (type == 'description') {
      if (description) return 'green';
      if (descriptionError) return Colors.error;
    }
    if (type == 'services') {
      if (services?.length) return 'green';
      if (servicesError) return Colors.error;
    }
    if (type == 'addons') {
      if (addons?.length) return 'green';
      if (addonsError) return Colors.error;
    }
    if (type == 'delivery') {
      if (deliveryLocationStore || deliveryLocationHome) return 'green';
      if (deliveryError) return Colors.error;
    }
    return null;
  });

  const checkIcon = type => {
    if (type == 'upload') {
      if (photos?.length) return 'checkmark';
      if (uploadError) return 'close';
    }
    if (type == 'service_name') {
      if (name?.length) return 'checkmark';
      if (nameError) return 'close';
    }
    if (type == 'description') {
      if (description?.length) return 'checkmark';
      if (descriptionError) return 'close';
    }
    if (type == 'services') {
      if (services?.length) return 'checkmark';
      if (servicesError) return 'close';
    }
    if (type == 'addons') {
      if (addons?.length) return 'checkmark';
      if (addonsError) return 'close';
    }
    if (type == 'delivery') {
      console.log('delivery', deliveryLocationStore, deliveryLocationHome);
      if (deliveryLocationStore || deliveryLocationHome) return 'checkmark';
      if (deliveryError) return 'close';
    }

    return 'chevron-forward';
  };

  const done = () => {
    // Todo add some alert stating there are missing fields?
    // Todo add back button alert preventing him from going back without confirmation
    if (!photos?.length) {
      return setUploadError(true);
    }
    if (!name?.length) {
      return setNameError(true);
    }
    // if (!description?.length) {
    //   setDescriptionError(true);
    // }
    if (!services?.length) {
      return setServicesError(true);
    }
    // if (!addons?.length) {
    //   setAddonsError(true);
    // }
    if (!deliveryLocationStore && !deliveryLocationHome) {
      return setDeliveryError(true);
    }
    setIsLoading(true);

    // everything's ok
    props
      .addService({
        photos: photos,
        name: name,
        price: price,
        description: description,
        category: route?.params?.service, // category
        services: services,
        addons: addons,
        deliveryLocationStore: deliveryLocationStore,
        deliveryLocationHome: deliveryLocationHome,
        deliveryFee: deliveryFee,
      })
      .then(() => {
        setIsLoading(false);
        console.log('navigate away');
        // navigateTo('HomeNavigator');
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Fragment>
        <SafeAreaView style={{height: SCREEN_HEIGHT, backgroundColor: '#fff'}}>
          <NavigationBar
            title={t('service_add_pet_service')} //"Sell Pet Service"
            // onPressBack={navigation.goBack}
            // buttonNextText={'Next'}
          />
          {/******* UPLOAD IMAGES ********/}
          <UploadImage
            ref={uploadImageComponent}
            titleColor={checkColor('upload')}
            onChange={setPhotos}
            uploadType="camera"
            addPhoto={toggleCamera}
            photosList={photos}
          />
          <ScrollView style={styles.container}>
            <Divider type="inset" />
            {/******* SERVICE NAME ********/}

            <ListItem
              actionIcon={checkIcon('service_name')}
              actionIconColor={checkColor('service_name')}
              // icon="add"
              // disabled={!photos.length}
              onPress={() =>
                navigateTo('AddServiceDetails', {
                  name: name,
                  service: route.params.service,
                })
              }
              titleColor={checkColor('service_name')}
              title={t('service_details')}
              extraData={name ? null : t('service_details_subtitle')}
            />
            {name && (
              <TouchableItem
                onPress={() =>
                  navigateTo('AddServiceDetails', {
                    name: name,
                    price: price,
                    services: services,
                    addons: addons,
                    service: route.params.service,
                  })
                }>
                <Text style={styles.textDisplay}>{name}</Text>
              </TouchableItem>
            )}
            <Divider type="inset" />

            {/******* DESCRIPTION ********/}
            <ListItem
              actionIcon={checkIcon('description')}
              actionIconColor={checkColor('description')}
              onPress={() =>
                navigateTo('FullscreenInput', {description: description})
              }
              title={t('service_description')}
              titleColor={checkColor('description')}
              extraData={description ? null : t('service_description_subtitle')}
            />
            {description && description?.length && (
              <TouchableItem
                onPress={() =>
                  navigateTo('FullscreenInput', {description: description})
                }>
                <Text
                  style={styles.textDisplay}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {description}
                </Text>
              </TouchableItem>
            )}
            <Divider type="inset" />
            {/******* SERVICE OPTIONS ********/}
            <ListItem
              actionIcon={checkIcon('services')}
              actionIconColor={checkColor('services')}
              titleColor={checkColor('services')}
              title={`${t('service_options')} ${
                services?.length ? '(' + services?.length + ')' : ''
              }`}
              extraData={t('service_options_subtitle')}
              onPress={() => {
                if (services?.length) {
                  navigateTo('AddServiceOptions', {
                    service: route.params.service,
                    services: services,
                  });
                } else {
                  navigateTo('AddServiceOption', {
                    service: route.params.service,
                    services: services,
                  });
                }
              }}
            />
            {/* <View style={styles.textDisplay}>
                {services && services.length && (
                  <Text>
                    {services[0].name} {services[0].price}
                  </Text>
                )}
                {services && services.length > 1 && (
                  <Text>{services[1].name}</Text>
                )}
                {services && services.length > 2 && (
                  <Text>{services[2].name}</Text>
                )}
              </View> */}
            <Divider type="inset" />
            {/******* SERVICE ADDONS ********/}
            <ListItem
              actionIcon={checkIcon('addons')}
              actionIconColor={checkColor('addons')}
              title={`${t('service_addons')} ${
                addons?.length ? '(' + addons?.length + ')' : ''
              }`}
              titleColor={checkColor('addons')}
              extraData={t('service_addons_subtitle')}
              onPress={() => {
                if (addons?.length) {
                  navigateTo('AddServiceAddons', {
                    service: route.params.service,
                    addons: addons,
                  });
                } else {
                  navigateTo('AddServiceAddon', {
                    service: route.params.service,
                    addons: addons,
                  });
                }
              }}
            />
            <Divider type="inset" />
            {/******* Delivery Settings ********/}
            <ListItem
              onPress={() =>
                navigateTo('AddServiceDelivery', {
                  deliveryLocationStore,
                  deliveryLocationHome,
                  deliveryFee,
                })
              }
              actionIconColor={checkColor('delivery')}
              actionIcon={checkIcon('delivery')}
              titleColor={checkColor('delivery')}
              title={t('service_delivery')}
              extraData={
                deliveryLocationStore || deliveryLocationHome
                  ? null
                  : t('service_delivery_subtitle')
              }
            />
            {(deliveryLocationStore || deliveryLocationHome) && (
              <TouchableItem
                onPress={() =>
                  navigateTo('AddServiceDelivery', {
                    deliveryLocationStore,
                    deliveryLocationHome,
                    deliveryFee,
                  })
                }>
                {deliveryLocationStore && (
                  <Text style={styles.textDisplay}>
                    {t('service_delivery_location_option1')}
                  </Text>
                )}
                {deliveryLocationHome && (
                  <Text style={styles.textDisplay}>
                    {t('service_delivery_location_option2')}
                  </Text>
                )}
              </TouchableItem>
            )}

            <Divider type="inset" />
          </ScrollView>
          <View style={styles.bottomButtonsContainer}>
            {/* <OutlinedButton
              disabled={true}
              color={Colors.onPrimaryColor}
              titleColor={Colors.primaryColor}
              title={t('save_draft').toUpperCase()}
              buttonStyle={[styles.outlinedButton, styles.firstOutlinedButton]}
            /> */}
            <TouchableItem style={styles.btn} onPress={done}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.btnText}>{t('sell').toUpperCase()}</Text>
              )}
            </TouchableItem>
          </View>
        </SafeAreaView>
      </Fragment>
      <CameraTaker
        cameraTakerStyle={{
          transform: [
            {
              translateX: offsetX,
            },
          ],
          position: 'absolute',
          top: 0,
        }}
        openGallery={true}
        onPressNext={callPhoto}
        onPressBack={toggleCamera}
        selectedPhotos={photos}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textDisplay: {
    paddingLeft: 20,
    paddingRight: 50,
    paddingBottom: 15,
    marginTop: -15,
    color: Colors.primaryColor,
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
  container: {
    flex: 1,
    backgroundColor: 'white', //Colors.background,
  },
  firstOutlinedButton: {
    marginRight: Layout.SMALL_PADDING,
  },
  outlinedButton: {
    flex: 1,
  },
  btn: {
    backgroundColor: Colors.primaryColor,
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: Colors.onPrimaryColor,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addService,
    },
    dispatch,
  );

export default memo(connect(null, mapDispatchToProps)(AddPetService));
