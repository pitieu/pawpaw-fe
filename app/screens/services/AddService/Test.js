import {useIsFocused} from '@react-navigation/native';
import React, {useRef, useState, useMemo, useEffect} from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  STATUS_BAR_HEIGHT,
} from '../../../constants';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
// import NavigationBar from '../../components/NavigationBar';

import ImageGridMenuSelector from '../../../components/image/ImageGridMenuSelector';

import {LogBox} from 'react-native';
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  "exported from 'deprecated-react-native-prop-types'.",
]);

const HEADER_HEIGHT = 390;

const StoryTaker = ({route, navigation, openGallery = true}) => {
  const {sendToDirect, username} = route?.params || {
    sendToDirect: 'abc',
    username: 'cho',
  };
  const focused = useIsFocused();
  const [showGallery, setShowGallery] = useState(false);
  const [front, setFront] = useState(true);
  const [flash, setFlash] = useState(false);
  const [photo, setPhoto] = useState();

  const _cameraRef = useRef(null);

  const _galleryOffsetY = useMemo(
    () => new Animated.Value(openGallery ? -SCREEN_HEIGHT + HEADER_HEIGHT : 0),
    [],
  );
  const _loadingDeg = useMemo(() => new Animated.Value(0), []);

  const ref = useRef({
    preGalleryOffsetY: 0,
    showGroups: false,
  });

  useEffect(() => {
    if (openGallery) _onShowGallery();
  }, []);

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
    navigation.navigate('StoryProcessor', {
      images,
      sendToDirect,
      username,
    });
  };

  const _onGestureEvent = ({nativeEvent: {translationY}}) => {
    if (
      ref.current.preGalleryOffsetY + translationY <
        -SCREEN_HEIGHT + HEADER_HEIGHT ||
      ref.current.preGalleryOffsetY + translationY > 0
    )
      return;
    _galleryOffsetY.setValue(ref.current.preGalleryOffsetY + translationY);
  };

  const _onStateChange = ({nativeEvent: {translationY, state}}) => {
    if (state === State.END) {
      if (
        ref.current.preGalleryOffsetY + translationY <
        (-SCREEN_HEIGHT + HEADER_HEIGHT) / 2
      ) {
        Animated.timing(_galleryOffsetY, {
          duration: 200,
          toValue: -SCREEN_HEIGHT + HEADER_HEIGHT,
          useNativeDriver: true,
        }).start(() => {
          if (!showGallery) setShowGallery(true);
        });
        ref.current.preGalleryOffsetY = -SCREEN_HEIGHT + HEADER_HEIGHT;
      } else {
        Animated.timing(_galleryOffsetY, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          if (showGallery) setShowGallery(false);
        });
        ref.current.preGalleryOffsetY = 0;
      }
    }
  };

  const _onShowGallery = () => {
    Animated.timing(_galleryOffsetY, {
      duration: 200,
      toValue: -SCREEN_HEIGHT + HEADER_HEIGHT,
      useNativeDriver: true,
    }).start(() => {
      if (!showGallery) setShowGallery(true);
    });
    ref.current.preGalleryOffsetY = -SCREEN_HEIGHT + HEADER_HEIGHT;
  };

  const onPhotosUpdate = photos => {
    if (photos.length) {
      const node = [...photos][0]?.node.image.uri;
      setPhoto(node);
    }
  };

  const _onAnimatedLoading = () => {
    Animated.timing(_loadingDeg, {
      toValue: 5,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const onGalleryPressBack = () => {
    navigation.goBack();
  };

  const onGalleryPressNext = () => {
    navigation.goBack();
  };

  return (
    <>
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
            <TouchableOpacity
              onPress={() => navigation.navigate('ServiceCategorySelection')}
              style={styles.btnTopOptions}>
              <Icon name="tune" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={setFlash.bind(null, !flash)}
              style={styles.btnTopOptions}>
              <Icon
                name={flash ? 'flash' : 'flash-off'}
                size={30}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => navigation.navigate('ServiceCategorySelection')}
              onPress={() => navigation.goBack()}
              style={styles.btnTopOptions}>
              <Text
                style={{
                  fontSize: 30,
                  color: '#fff',
                }}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={{
              ...styles.bottomOptions,
              transform: [
                {
                  translateY: _galleryOffsetY,
                },
              ],
              zIndex: showGallery ? 0 : 2,
              opacity: _galleryOffsetY.interpolate({
                inputRange: [-SCREEN_HEIGHT + HEADER_HEIGHT, 0],
                outputRange: [0, 1],
              }),
            }}>
            {/* SMALL BOTTOM LEFT ICON */}
            <TouchableOpacity
              onPress={_onShowGallery}
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
                  source={require('../../../assets/icons/waiting.png')}
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
              <Icon name="camera-retake" size={40} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <ImageGridMenuSelector
            onPhotosUpdate={onPhotosUpdate}
            galleryOffsetY={_galleryOffsetY}
            showGallery={showGallery}
            setShowGallery={setShowGallery}
            onGalleryPressNext={onGalleryPressNext}
            onGalleryPressBack={onGalleryPressBack}
          />
        </View>
      </PanGestureHandler>
    </>
  );
};
export default StoryTaker;

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
