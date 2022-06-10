import CameraRoll from '@react-native-community/cameraroll';
import ImageEditor from '@react-native-community/image-editor';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FlatList,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../constants';

import Colors from '../../../theme/colors';
import {CHEVRON_BACK_ICON} from '../../../constants/icons';

const LIMIT_PHOTOS = 4;
const COLUMNS = 5;

const GalleryChooser = ({navigation, route}) => {
  const [showGroupSelection, setShowGroupSelection] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [multiple, setMultiple] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedPhotoSpecs, setSelectedPhotosSpecs] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [groups, setGroups] = useState([]);
  const [enableGesture, setEnableGesture] = useState(true);
  const _photoOffsetX = React.useMemo(() => new Animated.Value(0), []);
  const _photoOffsetY = React.useMemo(() => new Animated.Value(0), []);
  const _photoRatio = React.useMemo(() => new Animated.Value(1), []);
  const [page, setPage] = useState(1);
  const _maskOpacity = React.useMemo(() => new Animated.Value(0), []);

  const ref = useRef({
    enableGesture: true,
    fullSize: false,
    maskTimeout: setTimeout(() => {}, 0),
    showMask: false,
    preventScaleOffset: true,
    currentPhoto: {preX: 0, preY: 0, preRatio: 1},
  });
  const [uploading, setUploading] = useState(false);
  const _loadingDeg = new Animated.Value(0);
  const _animateLoading = () => {
    Animated.timing(_loadingDeg, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      if (uploading) {
        _loadingDeg.setValue(0);
        _animateLoading();
      }
    });
  };
  const goBack = () => {};

  useEffect(() => {
    CameraRoll.getPhotos({assetType: 'Photos', first: 1000}).then(result => {
      const photos = result.edges;
      const groups = Array.from(
        new Set(photos.map(photo => photo.node.group_name)),
      );
      setGroups(groups);
      if (groups.length > 0) setSelectedGroupIndex(0);
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (selectedGroupIndex > -1) {
      CameraRoll.getPhotos({
        assetType: 'Photos',
        first: 8 * page,
        groupName: groups[selectedGroupIndex],
      }).then(result => {
        const photos = result.edges;
        setPhotos(photos);
        if (photos.length > 0 && selectedIndex < 0) setSelectedIndex(0);
      });
    }
    return () => {};
  }, [selectedGroupIndex, page]);

  useEffect(() => {
    if (selectedIndex > -1) {
      const position = selectedPhotos.indexOf(selectedIndex);
      if (position > -1 && selectedPhotoSpecs[position] && multiple) {
        ref.current.currentPhoto = {
          ...selectedPhotoSpecs[position].currentPhoto,
        };
        ref.current.preventScaleOffset =
          selectedPhotoSpecs[position].preventScaleOffset;
        ref.current.enableGesture = selectedPhotoSpecs[position].enableGesture;
        setEnableGesture(ref.current.enableGesture);
        if (ref.current.preventScaleOffset) {
          Animated.parallel([
            Animated.spring(_photoRatio, {
              toValue: ref.current.currentPhoto.preRatio,
              useNativeDriver: false,
            }),
            Animated.spring(_photoOffsetX, {
              toValue: ref.current.currentPhoto.preX,
              useNativeDriver: false,
            }),
            Animated.spring(_photoOffsetY, {
              toValue: ref.current.currentPhoto.preY,
              useNativeDriver: false,
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.spring(_photoOffsetX, {
              toValue:
                ref.current.currentPhoto.preX *
                ref.current.currentPhoto.preRatio,
              useNativeDriver: false,
            }),
            Animated.spring(_photoOffsetY, {
              toValue:
                ref.current.currentPhoto.preY *
                ref.current.currentPhoto.preRatio,
              useNativeDriver: false,
            }),
          ]).start();
        }
      } else {
        setEnableGesture(true);
        ref.current.preventScaleOffset = true;
        ref.current.currentPhoto = {
          preX: 0,
          preY: 0,
          preRatio:
            SCREEN_WIDTH /
            (photos[selectedIndex].node.image.height <
            photos[selectedIndex].node.image.width
              ? photos[selectedIndex].node.image.height
              : photos[selectedIndex].node.image.width),
        };
        ref.current.currentPhoto.preX =
          -(
            photos[selectedIndex].node.image.width *
              ref.current.currentPhoto.preRatio -
            SCREEN_WIDTH
          ) / 2;
        ref.current.currentPhoto.preY =
          -(
            photos[selectedIndex].node.image.height *
              ref.current.currentPhoto.preRatio -
            SCREEN_WIDTH
          ) / 2;
        _photoRatio.setValue(ref.current.currentPhoto.preRatio);
        _photoOffsetX.setValue(ref.current.currentPhoto.preX);
        _photoOffsetY.setValue(ref.current.currentPhoto.preY);
      }
    }
    return () => {};
  }, [selectedIndex]);

  const _onPanGestureEvent = ({nativeEvent: {translationX, translationY}}) => {
    clearTimeout(ref.current.maskTimeout);
    ref.current.maskTimeout = setTimeout(() => {
      Animated.timing(_maskOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => (ref.current.showMask = false));
    }, 1000);
    if (!ref.current.showMask) {
      _maskOpacity.setValue(1);
      ref.current.showMask = true;
    }
    if (showGroupSelection) setShowGroupSelection(false);
    if (ref.current.preventScaleOffset) {
      _photoOffsetX.setValue(translationX + ref.current.currentPhoto.preX);
      _photoOffsetY.setValue(translationY + ref.current.currentPhoto.preY);
    } else {
      _photoOffsetX.setValue(
        (translationX + ref.current.currentPhoto.preX) *
          ref.current.currentPhoto.preRatio,
      );
      _photoOffsetY.setValue(
        (translationY + ref.current.currentPhoto.preY) *
          ref.current.currentPhoto.preRatio,
      );
    }
  };

  const _onPanStateChange = ({
    nativeEvent: {translationX, translationY, state},
  }) => {
    if (state === State.END) {
      ref.current.currentPhoto.preX += translationX;
      ref.current.currentPhoto.preY += translationY;
      if (ref.current.currentPhoto.preX > 0) {
        Animated.spring(_photoOffsetX, {
          useNativeDriver: false,
          toValue: 0,
        }).start(() => (ref.current.currentPhoto.preX = 0));
      }
      if (ref.current.currentPhoto.preY > 0) {
        Animated.spring(_photoOffsetY, {
          useNativeDriver: false,
          toValue: 0,
        }).start(() => (ref.current.currentPhoto.preY = 0));
      }
      if (
        photos[selectedIndex].node.image.height *
          ref.current.currentPhoto.preRatio +
          (ref.current.preventScaleOffset
            ? ref.current.currentPhoto.preY
            : ref.current.currentPhoto.preRatio *
              ref.current.currentPhoto.preY) -
          SCREEN_WIDTH <
        0
      ) {
        Animated.spring(_photoOffsetY, {
          useNativeDriver: false,
          toValue: -(
            photos[selectedIndex].node.image.height *
              ref.current.currentPhoto.preRatio -
            SCREEN_WIDTH
          ),
        }).start(() => {
          ref.current.currentPhoto.preY = -(
            photos[selectedIndex].node.image.height *
              ref.current.currentPhoto.preRatio -
            SCREEN_WIDTH
          );
          ref.current.preventScaleOffset = true;
        });
      }
      if (
        photos[selectedIndex].node.image.width *
          ref.current.currentPhoto.preRatio +
          (ref.current.preventScaleOffset
            ? ref.current.currentPhoto.preX
            : ref.current.currentPhoto.preRatio *
              ref.current.currentPhoto.preX) -
          SCREEN_WIDTH <
        0
      ) {
        Animated.spring(_photoOffsetX, {
          useNativeDriver: false,
          toValue: -(
            photos[selectedIndex].node.image.width *
              ref.current.currentPhoto.preRatio -
            SCREEN_WIDTH
          ),
        }).start(() => {
          ref.current.currentPhoto.preX = -(
            photos[selectedIndex].node.image.width *
              ref.current.currentPhoto.preRatio -
            SCREEN_WIDTH
          );
          ref.current.preventScaleOffset = true;
        });
      }
    }
  };

  const _onPinchGestureEvent = ({nativeEvent: {scale, state}}) => {
    clearTimeout(ref.current.maskTimeout);
    ref.current.maskTimeout = setTimeout(() => {
      Animated.timing(_maskOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => (ref.current.showMask = false));
    }, 1000);
    if (!ref.current.showMask) {
      _maskOpacity.setValue(1);
      ref.current.showMask = true;
    }
    if (showGroupSelection) setShowGroupSelection(false);
    if (ref.current.preventScaleOffset) {
      _photoOffsetX.setValue(ref.current.currentPhoto.preX * scale);
      _photoOffsetY.setValue(ref.current.currentPhoto.preY * scale);
    } else {
      _photoOffsetX.setValue(
        ref.current.currentPhoto.preX *
          (scale * ref.current.currentPhoto.preRatio),
      );
      _photoOffsetY.setValue(
        ref.current.currentPhoto.preY *
          (scale * ref.current.currentPhoto.preRatio),
      );
    }
    _photoRatio.setValue(scale * ref.current.currentPhoto.preRatio);
  };

  const _onPinchStateChange = ({nativeEvent: {scale, state}}) => {
    if (state === State.END) {
      if (ref.current.preventScaleOffset) {
        ref.current.currentPhoto.preX /= ref.current.currentPhoto.preRatio;
        ref.current.currentPhoto.preY /= ref.current.currentPhoto.preRatio;
      }
      ref.current.preventScaleOffset = false;

      ref.current.currentPhoto.preRatio *= scale;
      const defaultRatio =
        SCREEN_WIDTH /
        (photos[selectedIndex].node.image.height <
        photos[selectedIndex].node.image.width
          ? photos[selectedIndex].node.image.height
          : photos[selectedIndex].node.image.width);
      if (ref.current.currentPhoto.preRatio < defaultRatio) {
        Animated.spring(_photoRatio, {
          toValue: defaultRatio,
          useNativeDriver: false,
        }).start(() => {
          ref.current.currentPhoto.preRatio = defaultRatio;
        });
      }
    }
  };

  const _onDone = async () => {
    setUploading(true);

    if (selectedPhotos.length < 1 && multiple) {
      setUploading(false);
      return Alert.alert('Error!', 'You need to choose at least 1 picture');
    }
    const photoList = multiple ? [...selectedPhotos] : [selectedIndex];
    const specs = multiple ? [...selectedPhotoSpecs] : [];
    if (specs.length < photoList.length) {
      specs.push({
        currentPhoto: {...ref.current.currentPhoto},
        enableGesture,
        preventScaleOffset: ref.current.preventScaleOffset,
        fullSize: ref.current.fullSize,
      });
    } else if (specs.length === photoList.length) {
      specs[photoList.indexOf(selectedIndex)] = {
        currentPhoto: {...ref.current.currentPhoto},
        enableGesture,
        preventScaleOffset: ref.current.preventScaleOffset,
        fullSize: ref.current.fullSize,
      };
    }
    const tasks = photoList.map(async (index, rIndex) => {
      const spec = specs[photoList.indexOf(index)];
      const {width, height} = photos[index].node.image;
      const cropData = {
        offset: {
          x: spec.fullSize
            ? 0
            : Math.abs(
                spec.preventScaleOffset
                  ? spec.currentPhoto.preX / spec.currentPhoto.preRatio
                  : spec.currentPhoto.preX,
              ),
          y: spec.fullSize
            ? 0
            : Math.abs(
                spec.preventScaleOffset
                  ? spec.currentPhoto.preY / spec.currentPhoto.preRatio
                  : spec.currentPhoto.preY,
              ),
        },
        size: {
          width:
            spec.fullSize && height > width
              ? width
              : SCREEN_WIDTH / spec.currentPhoto.preRatio,
          height:
            spec.fullSize && height < width
              ? height
              : SCREEN_WIDTH / spec.currentPhoto.preRatio,
        },
      };
      const img = photos[index].node;
      const extension = img.image.filename
        .split('.')
        .pop()
        ?.toLocaleLowerCase();
      const uri = await ImageEditor.cropImage(img.image.uri, cropData);
      return {
        uri,
        fullSize: spec.fullSize,
        tags: [],
        extension: extension,
        width:
          spec.fullSize && height > width
            ? width
            : SCREEN_WIDTH / spec.currentPhoto.preRatio,
        height:
          spec.fullSize && height < width
            ? height
            : SCREEN_WIDTH / spec.currentPhoto.preRatio,
      };
    });
    Promise.all(tasks).then(result => {
      //   setProcessedImages([...result]);
      setUploading(false);
    });
  };

  const _onLoadmore = () => {
    setPage(page + 1);
  };

  const _onSelectImage = index => {
    if (!multiple) setSelectedIndex(index);
    else {
      const position = selectedPhotos.indexOf(index);
      if (index !== selectedIndex && position > -1) {
        const temp2 = [...selectedPhotoSpecs];
        temp2[selectedPhotos.indexOf(selectedIndex)] = {
          enableGesture,
          currentPhoto: {...ref.current.currentPhoto},
          preventScaleOffset: ref.current.preventScaleOffset,
          fullSize: ref.current.fullSize,
        };
        setSelectedPhotosSpecs(temp2);
        return setSelectedIndex(index);
      }
      if (position > -1) {
        const temp = [...selectedPhotos];
        temp.splice(position, 1);
        if (temp.length <= LIMIT_PHOTOS) {
          setSelectedPhotos(temp);
          const temp2 = [...selectedPhotoSpecs];
          temp2.splice(position, 1);
          setSelectedPhotosSpecs(temp2);
          setSelectedIndex(temp[temp.length - 1]);
        }
      } else {
        const temp = [...selectedPhotos];
        temp.push(index);
        if (temp.length <= LIMIT_PHOTOS) {
          setSelectedPhotos(temp);
          const temp2 = [...selectedPhotoSpecs];
          temp2[temp.indexOf(selectedIndex)] = {
            enableGesture,
            currentPhoto: {...ref.current.currentPhoto},
            preventScaleOffset: ref.current.preventScaleOffset,
            fullSize: ref.current.fullSize,
          };
          setSelectedPhotosSpecs(temp2);
          setSelectedIndex(index);
        }
      }
    }
  };

  const _onToggleMultiple = () => {
    if (selectedPhotos.indexOf(selectedIndex) === -1 && !multiple) {
      const temp = [...selectedPhotos];
      temp.push(selectedIndex);
      setSelectedPhotos(temp);
    }
    setMultiple(!multiple);
  };

  const _onToggleFullSize = () => {
    if (
      photos[selectedIndex].node.image.height ==
      photos[selectedIndex].node.image.width
    )
      return;

    let switcher = false;
    if (!ref.current.fullSize) {
      switcher =
        photos[selectedIndex].node.image.height >
        photos[selectedIndex].node.image.width;
      ref.current.fullSize = true;
      setEnableGesture(false);
    } else {
      switcher =
        photos[selectedIndex].node.image.height <
        photos[selectedIndex].node.image.width;
      ref.current.fullSize = false;
      setEnableGesture(true);
    }
    ref.current.preventScaleOffset = true;
    ref.current.currentPhoto = {
      preX: 0,
      preY: 0,
      preRatio:
        SCREEN_WIDTH /
        (switcher
          ? photos[selectedIndex].node.image.height
          : photos[selectedIndex].node.image.width),
    };
    ref.current.currentPhoto.preX =
      -(
        photos[selectedIndex].node.image.width *
          ref.current.currentPhoto.preRatio -
        SCREEN_WIDTH
      ) / 2;

    ref.current.currentPhoto.preY =
      -(
        photos[selectedIndex].node.image.height *
          ref.current.currentPhoto.preRatio -
        SCREEN_WIDTH
      ) / 2;

    _photoRatio.setValue(ref.current.currentPhoto.preRatio);
    _photoOffsetX.setValue(ref.current.currentPhoto.preX);
    _photoOffsetY.setValue(ref.current.currentPhoto.preY);
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {uploading && (
        <View
          style={{
            zIndex: 999,
            position: 'absolute',
            left: 0,
            top: 0,
            height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <View style={styles.uploadingContainer}>
            <Animated.Image
              onLayout={_animateLoading}
              style={{
                height: 36,
                width: 36,
                marginRight: 10,
                transform: [
                  {
                    rotate: _loadingDeg.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
              source={require('../../../assets/icons/waiting.png')}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
              }}>
              {'Processing Photos...'}
            </Text>
          </View>
        </View>
      )}

      <View
        style={{
          ...styles.navigationBar,
          borderBottomColor: '#ddd',
          borderBottomWidth: 0,
        }}>
        <TouchableOpacity onPress={onPressBack} style={styles.centerBtn}>
          <Icon name={CHEVRON_BACK_ICON} size={26} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={setShowGroupSelection.bind(null, true)}
          style={{
            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.groupText}>
            {selectedGroupIndex > -1 ? groups[selectedGroupIndex] : '--'}
          </Text>
          <Icon name="chevron-down" size={26} />
        </TouchableOpacity>
        {/* GROUP/ALBUM OPTIONS */}
        {showGroupSelection && (
          <ScrollView
            bounces={false}
            contentContainerStyle={{
              alignItems: 'flex-end',
            }}
            style={styles.groupOptionsWrapper}>
            {showGroupSelection &&
              groups.map((group, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedGroupIndex(index);
                    setShowGroupSelection(false);
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: index === selectedGroupIndex ? '#000' : '#999',
                    }}>
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
        {/* DONE BUTTON */}
        <TouchableOpacity
          onPress={_onDone}
          style={{
            ...styles.centerBtn,
            width: 60,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: Colors.focusColor,
            }}>
            {'Next'}
          </Text>
        </TouchableOpacity>
      </View>

      <>
        <View
          style={{
            height: SCREEN_WIDTH,
            width: SCREEN_WIDTH,
            overflow: 'hidden',
          }}>
          {selectedIndex > -1 && (
            <View>
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: _photoOffsetX,
                    },
                    {
                      translateY: _photoOffsetY,
                    },
                  ],
                  width: Animated.multiply(
                    photos[selectedIndex].node.image.width,
                    _photoRatio,
                  ),
                  height: Animated.multiply(
                    photos[selectedIndex].node.image.height,
                    _photoRatio,
                  ),
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  source={{uri: photos[selectedIndex].node.image.uri || ''}}
                />
              </Animated.View>
            </View>
          )}
          <PinchGestureHandler
            enabled={enableGesture}
            onHandlerStateChange={_onPinchStateChange}
            onGestureEvent={_onPinchGestureEvent}>
            <PanGestureHandler
              enabled={enableGesture}
              onHandlerStateChange={_onPanStateChange}
              onGestureEvent={_onPanGestureEvent}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  zIndex: 1,
                  left: 0,
                  top: 0,
                }}>
                <View style={styles.postToolWrapper}>
                  <TouchableOpacity
                    onPress={_onToggleFullSize}
                    style={styles.btnPostTool}>
                    <Icon name="resize" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={_onToggleMultiple}
                    style={{
                      ...styles.btnPostTool,
                      backgroundColor: multiple
                        ? Colors.focusColor
                        : 'rgba(0,0,0,0.5)',
                    }}>
                    <Icon name="layers-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </PanGestureHandler>
          </PinchGestureHandler>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={photos}
          onEndReached={_onLoadmore}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={_onSelectImage.bind(null, index)}
              activeOpacity={0.8}
              style={{
                padding: 1,
                width: SCREEN_WIDTH / COLUMNS,
                height: SCREEN_WIDTH / COLUMNS,
              }}>
              {multiple && (
                <View
                  style={{
                    position: 'absolute',
                    right: 7.5,
                    top: 7.5,
                    height: 24,
                    width: 24,
                    borderRadius: 24,
                    borderColor: '#fff',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                    backgroundColor:
                      selectedPhotos.indexOf(index) > -1
                        ? Colors.focusColor
                        : 'rgba(0,0,0,0.3)',
                  }}>
                  {selectedPhotos.indexOf(index) > -1 && (
                    <Text style={styles.selectPhotoCountText}>
                      {selectedPhotos.indexOf(index) + 1}
                    </Text>
                  )}
                </View>
              )}
              <Image
                style={{
                  opacity: index === selectedIndex && !multiple ? 0.8 : 1,
                  width: '100%',
                  height: '100%',
                  borderWidth: index == selectedIndex ? 3 : 0,
                  borderColor:
                    index == selectedIndex ? Colors.focusColor : 'transparent',
                }}
                source={{
                  uri: item.node.image.uri,
                  // priority: FastImage.priority.high
                }}
              />
            </TouchableOpacity>
          )}
          numColumns={COLUMNS}
          keyExtractor={(item, key) => `${key}`}
        />
      </>
    </SafeAreaView>
  );
};

export default GalleryChooser;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  navigationBar: {
    zIndex: 1,
    backgroundColor: '#fff',
    height: 44,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerBtn: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupOptionsWrapper: {
    zIndex: 10,
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#fff',
    width: 150,
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 0.5,
  },
  uploadingContainer: {
    zIndex: 1,
    width: '80%',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  postToolWrapper: {
    zIndex: 10,
    position: 'absolute',
    bottom: 15,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnPostTool: {
    height: 40,
    width: 40,
    borderRadius: 44,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  groupText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectPhotoCountText: {
    color: Colors.onFocusColor,
  },
});
