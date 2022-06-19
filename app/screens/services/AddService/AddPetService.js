// import dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useState,
  memo,
  useMemo,
  Fragment,
  useRef,
  useEffect,
} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Animated} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {t} from 'i18next';

// components
import UploadImage from '../../../components/image/uploadImage';
import ListItem from '../../../components/list/listItem';
import Divider from '../../../components/divider/Divider';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import CameraTaker from '../../../components/camera/cameraGallerySelector';
import NavigationBar from '../../../components/NavigationBar';

// import utility
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../constants';
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const AddPetService = props => {
  const isFocused = useIsFocused();

  const {navigation, route} = props;
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
  const [deliveryLocation, setDeliveryLocation] = useState(
    route.params.deliveryLocation,
  );
  const [deliveryFee, setDeliveryFee] = useState(route.params.deliveryFee);

  useEffect(() => {
    console.log('set route', route.params);

    // service details
    setName(() => route.params.name);
    setPrice(() => route.params.price);
    setDescription(() => route.params.description);
    //service delivery
    setDeliveryLocation(() => route.params.deliveryLocation);
    setDeliveryFee(() => route.params.deliveryFee);
  }, [route]);

  useEffect(() => {
    async function refresh() {
      let services = await AsyncStorage.getItem('@services');
      if (services !== null && services !== '') {
        services = JSON.parse(services);
        setServices(services);
        await AsyncStorage.setItem('@services', '');
      }
      let addons = await AsyncStorage.getItem('@addons');
      if (addons !== null && addons !== '') {
        addons = JSON.parse(addons);
        setAddons(addons);
        await AsyncStorage.setItem('@addons', '');
      }
    }
    refresh();
  }, [isFocused]);

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

  return (
    <>
      <Fragment>
        <SafeAreaView style={{height: SCREEN_HEIGHT, backgroundColor: '#fff'}}>
          <NavigationBar
            title={t('service_add_pet_service')} //"Sell Pet Service"
            // onPressBack={navigation.goBack}
            // buttonNextText={'Next'}
          />
          <View style={styles.container}>
            <View>
              <UploadImage
                ref={uploadImageComponent}
                onChange={setPhotos}
                uploadType="camera"
                addPhoto={toggleCamera}
                photosList={photos}
              />
              <Divider type="inset" />
              <ListItem
                actionIcon={name ? 'checkmark' : 'chevron-forward'}
                actionIconColor={name ? 'green' : 'black'}
                // icon="add"
                // disabled={!photos.length}
                onPress={() =>
                  navigateTo('AddServiceDetails', {
                    name: name,
                    price: price,
                    services: services,
                    addons: addons,
                    service: route.params.service,
                  })
                }
                title={t('service_details')}
                // extraData={t('service_details_subtitle')}
              />
              {name && <Text style={styles.textDisplay}>{name}</Text>}
              <Divider type="inset" />
              <ListItem
                actionIcon={description ? 'checkmark' : 'chevron-forward'}
                actionIconColor={description ? 'green' : 'black'}
                // icon="add"
                // disabled={!photos.length}
                onPress={() =>
                  navigateTo('FullscreenInput', {description: description})
                }
                title={t('service_description')}
                extraData={
                  description ? null : t('service_description_subtitle')
                }
              />
              {description && (
                <Text
                  style={styles.textDisplay}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {description}
                </Text>
              )}
              <Divider type="inset" />
              <ListItem
                actionIcon={
                  services?.length > 0 ? 'checkmark' : 'chevron-forward'
                }
                actionIconColor={services?.length > 0 ? 'green' : 'black'}
                title={`${t('service_options')} ${
                  services?.length ? '(' + services?.length + ')' : ''
                }`}
                extraData={
                  services?.length ? null : t('service_options_subtitle')
                }
                onPress={() =>
                  navigateTo('AddServiceOptions', {
                    service: route.params.service,
                    services: services,
                  })
                }
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

              <ListItem
                actionIcon="chevron-forward"
                title={t('service_addons')}
                extraData={t('service_addons_subtitle')}
                onPress={() =>
                  navigateTo('AddServiceAddons', {
                    service: route.params.service,
                    addons: addons,
                    // setAddons: data => setAddons(data),
                  })
                }
              />
              <Divider type="inset" />
              <ListItem
                onPress={() =>
                  navigateTo('AddServiceDelivery', {
                    deliveryLocation: deliveryLocation,
                    deliveryFee: deliveryFee,
                  })
                }
                actionIcon="chevron-forward"
                title={t('service_delivery')}
                extraData={t('service_delivery_subtitle')}
              />
              <Divider type="inset" />
            </View>
          </View>
          <View style={styles.bottomButtonsContainer}>
            <OutlinedButton
              disabled={true}
              color={Colors.onPrimaryColor}
              titleColor={Colors.primaryColor}
              title={t('save_draft').toUpperCase()}
              buttonStyle={[styles.outlinedButton, styles.firstOutlinedButton]}
            />
            <OutlinedButton
              color={Colors.primaryColor}
              titleColor={Colors.white}
              disabled={true}
              title={t('sell').toUpperCase()}
              buttonStyle={styles.outlinedButton}
            />
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
    paddingBottom: 30,
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
});

export default memo(AddPetService);
