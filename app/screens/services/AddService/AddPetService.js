// import dependencies
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
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {t} from 'i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// components
import UploadImage from '../../../components/image/uploadImage';
import ListItem from '../../../components/list/listItem';
import Divider from '../../../components/divider/Divider';
import CameraTaker from '../../../components/camera/cameraGallerySelector';
import NavigationBar from '../../../components/NavigationBar';
import TouchableItem from '../../../components/TouchableItem';

// api
import {addService} from '../../../store/actions/service';
import {toast} from '../../../store/actions/toast';

// import utility
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../constants';
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';
import {removeDuplicateObjectFromArray} from '../../../utils';

const AddPetService = props => {
  console.log('SCREEN_HEIGHT:', SCREEN_HEIGHT);
  const {navigation, route} = props;
  const [isLoading, setIsLoading] = useState(false);

  // camera and upload image
  const uploadImageComponent = useRef();
  const [id, setId] = useState(route.params.id || null);
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState(route.params?.photos || []);
  const offsetX = useMemo(() => new Animated.Value(SCREEN_WIDTH), []);
  // service details
  const [name, setName] = useState(route.params?.name);
  // description
  const [description, setDescription] = useState(route.params?.description);
  // products
  const [services, setServices] = useState(route.params?.services);
  // addons
  const [addons, setAddons] = useState(route.params?.addons);
  //service delivery
  const [deliveryLocationStore, setDeliveryLocationStore] = useState(
    route.params?.deliveryLocationStore || false,
  );
  const [deliveryLocationHome, setDeliveryLocationHome] = useState(
    route.params?.deliveryLocationHome || false,
  );
  const [deliveryFee, setDeliveryFee] = useState(route.params?.deliveryFee);

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
    setName(() => route.params?.name);
    setDescription(() => route.params?.description);
    //service delivery
    setDeliveryLocationStore(() => route.params?.deliveryLocationStore);
    setDeliveryLocationHome(() => route.params?.deliveryLocationHome);
    setDeliveryFee(() => route.params?.deliveryFee);
    if (route.params?.services) {
      setServices(() => route.params?.services);
    }
    if (route.params?.addons) {
      setAddons(() => route.params?.addons);
    }

    if (route.params?.photos) {
      setPhotos(_p => {
        let res = removeDuplicateObjectFromArray(
          [..._p, ...route.params?.photos],
          'fileName',
        );
        uploadImageComponent.current.updatePhotos(res);
        return res;
      });
    }
  }, [route]);

  const callPhoto = async _photos => {
    toggleCamera();
    // using seTimeout to allow camera UI to show so that updatePhotos can be called
    setTimeout(() => {
      setPhotos(_p => {
        uploadImageComponent.current.updatePhotos([..._p, ..._photos]);
        return [..._p, ..._photos];
      });
    }, 20);
  };

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const toggleCamera = () => {
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
      if (deliveryLocationStore || deliveryLocationHome) return 'checkmark';
      if (deliveryError) return 'close';
    }

    return 'chevron-forward';
  };

  const done = () => {
    Toast.hide();

    // Todo add some alert stating there are missing fields?
    // Todo add back button alert preventing him from going back without confirmation
    if (!photos?.length) {
      setUploadError(true);
    }
    if (!name?.length) {
      setNameError(true);
    }
    if (!services?.length) {
      setServicesError(true);
    }
    if (!deliveryLocationStore && !deliveryLocationHome) {
      setDeliveryError(true);
    }
    if (!photos?.length) {
      return props.toast(t('error_upload_image'));
    }
    if (!name?.length) {
      return props.toast(t('error_name'));
    }
    if (!services?.length) {
      return props.toast(t('error_services'));
    }
    if (!deliveryLocationStore && !deliveryLocationHome) {
      return props.toast(t('error_delivery'));
    }
    console.log('all ok');
    setIsLoading(true);

    // everything's ok
    props
      .addService({
        photos: photos,
        name: name,
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
                  service: route.params?.service,
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
                    services: services,
                    service: route.params?.service,
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
                    service: route.params?.service,
                    services: services,
                  });
                } else {
                  navigateTo('AddServiceOption', {
                    service: route.params?.service,
                    services: services,
                  });
                }
              }}
            />
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
                    service: route.params?.service,
                    addons: addons,
                  });
                } else {
                  navigateTo('AddServiceAddon', {
                    service: route.params?.service,
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
            <TouchableItem style={styles.btn} onPress={done}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.btnText}>
                  {id
                    ? t('update_service').toUpperCase()
                    : t('sell').toUpperCase()}
                </Text>
              )}
            </TouchableItem>
          </View>
        </SafeAreaView>
      </Fragment>
      {showCamera && (
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
      )}
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
      toast,
    },
    dispatch,
  );

export default memo(connect(null, mapDispatchToProps)(AddPetService));
