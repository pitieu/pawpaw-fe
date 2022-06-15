// import dependencies
import React, {
  useState,
  memo,
  useMemo,
  Fragment,
  useRef,
  useEffect,
} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Animated} from 'react-native';

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
  //service delivery
  const [deliveryLocation, setDeliveryLocation] = useState(
    route.params.deliveryLocation,
  );
  const [deliveryFee, setDeliveryFee] = useState(route.params.deliveryFee);

  useEffect(() => {
    // console.log('set route', route.params);

    // service details
    setName(() => route.params.name);
    setPrice(() => route.params.price);
    setDescription(() => route.params.description);
    //service delivery
    setDeliveryLocation(() => route.params.deliveryLocation);
    setDeliveryFee(() => route.params.deliveryFee);
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
                actionIcon="chevron-forward"
                actionIconColor="green"
                // icon="add"
                // disabled={!photos.length}
                onPress={() =>
                  navigateTo('AddServiceDetails', {
                    name: name,
                    price: price,
                  })
                }
                title={t('service_details')}
                extraData={t('service_details_subtitle')}
              />
              <Text>Name {name}</Text>
              <Text>Price {price}</Text>
              <Divider type="inset" />
              <ListItem
                actionIcon="chevron-forward"
                actionIconColor="green"
                // icon="add"
                // disabled={!photos.length}
                onPress={() =>
                  navigateTo('FullscreenInput', {description: description})
                }
                title={t('service_description')}
                extraData={t('service_description_subtitle')}
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
              <ListItem
                actionIcon="chevron-forward"
                title={t('service_options')}
                extraData={t('service_options_subtitle')}
              />
              <Divider type="inset" />
              <ListItem
                actionIcon="chevron-forward"
                title={t('service_addons')}
                extraData={t('service_addons_subtitle')}
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
