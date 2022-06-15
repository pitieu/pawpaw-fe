import {useIsFocused} from '@react-navigation/native';
import React, {memo, useRef, useState, useMemo, useEffect} from 'react';
import {LogBox} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

import {SCREEN_HEIGHT, SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../constants';

import GalleryChooser from '../../components/image/GalleryChooser';
import {
  FLASH_OFF_ICON,
  FLASH_ICON,
  SETTINGS_ICON,
  CAMERA_RETAKE_ICON,
  CHEVRON_BACK_ICON,
} from '../../constants/icons';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  "exported from 'deprecated-react-native-prop-types'.",
]);

const WAITING_IMAGE = require('../../assets/icons/waiting.png');

const CameraTaker = props => {
  const {
    cameraTakerStyle,
    route,
    openGallery = false,
    onPhotoUpdate = () => {},
    onPressNext,
    onPressClose,
    onPressBack,
    photos,
    hide = false,
  } = props;
  const navigation = useNavigation();

  const {sendToDirect, username} = route?.params || {};
  const focused = useIsFocused();
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [front, setFront] = useState(true);
  const [flash, setFlash] = useState(false);
  const [photo, setPhoto] = useState();

  const _cameraRef = useRef(null);

  const _galleryOffsetY = useMemo(
    () => new Animated.Value(openGallery ? -SCREEN_HEIGHT : 0),
    [],
  );
  const _loadingDeg = useMemo(() => new Animated.Value(0), []);

  const ref = useRef({
    preGalleryOffsetY: SCREEN_HEIGHT,
    showGroups: false,
  });

  useEffect(() => {
    if (openGallery) {
      showGallery();
    } else {
      hideGallery();
    }
  }, []);

  useEffect(() => {
    if (openGallery) showGallery();
  }, [photo]);

  const goBack = () => {
    if (onPressClose) onPressClose();
    if (onPressBack) onPressBack();
    else navigation.goBack();
  };

  const _onTakePhoto = async () => {
    const photo = await _cameraRef.current?.takePictureAsync({
      width: 100,
      quality: 1,
    });
    const images = [];
    images.push({
      width: photo?.width,
      height: photo?.height,
      uri: photo?.uri,
      base64: photo?.base64 || '',
      extension: (photo?.uri || '').split('.').pop() || 'jpg',
    });
    onPressNext(images);
    // navigation.navigate('StoryProcessor', {
    //   images,
    //   sendToDirect,
    //   username,
    // });
  };

  const _onGestureEvent = ({nativeEvent: {translationY}}) => {
    if (
      ref.current.preGalleryOffsetY + translationY < -SCREEN_HEIGHT ||
      ref.current.preGalleryOffsetY + translationY > 0
    )
      return;
    _galleryOffsetY.setValue(ref.current.preGalleryOffsetY + translationY);
  };

  const _onStateChange = ({nativeEvent: {translationY, state}}) => {
    if (state === State.END) {
      if (ref.current.preGalleryOffsetY + translationY < -SCREEN_HEIGHT / 2) {
        Animated.timing(_galleryOffsetY, {
          duration: 200,
          toValue: -SCREEN_HEIGHT,
          useNativeDriver: true,
        }).start(() => {
          if (!isGalleryVisible) setIsGalleryVisible(true);
        });
        ref.current.preGalleryOffsetY = -SCREEN_HEIGHT;
      } else {
        Animated.timing(_galleryOffsetY, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          if (isGalleryVisible) setIsGalleryVisible(false);
        });
        ref.current.preGalleryOffsetY = 0;
      }
    }
  };

  const showGallery = () => {
    Animated.timing(_galleryOffsetY, {
      duration: 200,
      toValue: -SCREEN_HEIGHT,
      useNativeDriver: true,
    }).start(() => {
      if (!isGalleryVisible) setIsGalleryVisible(true);
    });
    ref.current.preGalleryOffsetY = -SCREEN_HEIGHT;
  };

  const hideGallery = () => {
    Animated.timing(_galleryOffsetY, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      if (isGalleryVisible) setIsGalleryVisible(false);
    });
    ref.current.preGalleryOffsetY = 0;
  };

  const _onAnimatedLoading = () => {
    Animated.timing(_loadingDeg, {
      toValue: 5,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const onPhotosChange = _photos => {
    if (_photos && _photos[0]) {
      setPhoto(_photos[0].node.image.uri);
      onPhotoUpdate(_photos);
    }
  };
  const onPressSettings = () => {
    // Todo Add settings??
  };

  return (
    <Animated.View style={cameraTakerStyle}>
      <PanGestureHandler
        onGestureEvent={_onGestureEvent}
        onHandlerStateChange={_onStateChange}>
        <View style={styles.container}>
          {focused && (
            <RNCamera
              ratio="16:9"
              pictureSize="3840x2160"
              captureAudio={false}
              ref={_cameraRef}
              style={styles.cameraContainer}
              type={front ? 'front' : 'back'}
              flashMode={flash ? 'on' : 'off'}
            />
          )}

          <View style={styles.topOptions}>
            {onPressBack && (
              <TouchableOpacity onPress={goBack} style={styles.btnBack}>
                <Icon name={CHEVRON_BACK_ICON} size={26} color="#fff" />
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity
              onPress={onPressSettings}
              style={styles.btnTopOptions}>
              <Icon name={SETTINGS_ICON} size={30} color="#fff" />
            </TouchableOpacity> */}
            {/* <View /> */}
            <TouchableOpacity
              onPress={setFlash.bind(null, !flash)}
              style={styles.btnTopOptions}>
              <Icon
                name={flash ? FLASH_ICON : FLASH_OFF_ICON}
                size={30}
                color="#fff"
              />
            </TouchableOpacity>
            {!onPressBack && (
              <TouchableOpacity onPress={goBack} style={styles.btnTopOptions}>
                <Text
                  style={{
                    fontSize: 30,
                    color: '#fff',
                  }}>
                  ✕
                </Text>
              </TouchableOpacity>
            )}
            {onPressBack && <View style={styles.btnTopOptions} />}
          </View>
          <Animated.View
            style={{
              ...styles.bottomOptions,
              transform: [
                {
                  translateY: _galleryOffsetY,
                },
              ],
              zIndex: isGalleryVisible ? 0 : 2,
              opacity: _galleryOffsetY.interpolate({
                inputRange: [-SCREEN_HEIGHT, 0],
                outputRange: [0, 1],
              }),
            }}>
            {/* SMALL BOTTOM LEFT ICON */}
            <TouchableOpacity
              onPress={showGallery}
              activeOpacity={0.8}
              style={styles.btnLastPhoto}>
              {photo && (
                <Image
                  style={styles.lastPhoto}
                  source={{
                    uri: photo,
                  }}
                />
              )}
              {!photo && (
                <Animated.Image
                  onLayout={_onAnimatedLoading}
                  style={{
                    height: 24,
                    width: 24,
                    margin: 3,
                    transform: [
                      {
                        rotate: _loadingDeg.interpolate({
                          inputRange: [0, 5],
                          outputRange: ['0deg', '180deg'],
                        }),
                      },
                    ],
                  }}
                  source={WAITING_IMAGE}
                />
              )}
            </TouchableOpacity>
            {/* Button take Photo in the middle */}
            <TouchableOpacity
              onPress={_onTakePhoto}
              activeOpacity={0.7}
              style={styles.btnTakePhoto}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 70,
                  backgroundColor: '#fff',
                  borderColor: '#000',
                  borderWidth: 4,
                }}
              />
              {sendToDirect && username && (
                <View style={styles.sendTo}>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    Message{' '}
                    <Text
                      style={{
                        fontWeight: 'bold',
                      }}>
                      {username}
                    </Text>
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={setFront.bind(null, !front)}>
              <Icon name={CAMERA_RETAKE_ICON} size={40} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <GalleryChooser
            onPhotosChange={onPhotosChange}
            onPressCamera={hideGallery}
            onPressNext={onPressNext}
            onPressBack={onPressBack}
            isGalleryVisible={isGalleryVisible}
            selectedPhotos={props.selectedPhotos}
            galleryStyle={{
              transform: [
                {
                  translateY: _galleryOffsetY,
                },
              ],
              height: SCREEN_HEIGHT,
              top: SCREEN_HEIGHT,
              zIndex: 3,
              opacity: _galleryOffsetY.interpolate({
                inputRange: [-SCREEN_HEIGHT, 0],
                outputRange: [1, 0],
              }),
            }}
          />
        </View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default memo(CameraTaker);

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: '#000',
  },
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  takeOptionsWrapper: {
    top: 0,
    left: 0,
    zIndex: 999,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  topOptions: {
    top: STATUS_BAR_HEIGHT,
    left: 0,
    height: 60,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  btnTopOptions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOptions: {
    height: 80,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btnLastPhoto: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 2,
  },
  lastPhoto: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  btnTakePhoto: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: '#fff',
    transform: [
      {
        translateY: -90,
      },
    ],
  },
  sendTo: {
    position: 'absolute',
    bottom: 90,
    width: 200,
    left: (70 - 200) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
