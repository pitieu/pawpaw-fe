import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState, useMemo, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CameraRoll from '@react-native-community/cameraroll';
// import ImageEditor, {ImageCropData} from '@react-native-community/image-editor';
// import {
//   FlatList,
//   PanGestureHandler,
//   PanGestureHandlerGestureEvent,
//   PinchGestureHandler,
//   PinchGestureHandlerGestureEvent,
//   State,
//   TextInput,
// } from 'react-native-gesture-handler';

// components
import {SCREEN_HEIGHT, STATUS_BAR_HEIGHT} from '../../constants';
import NavigationBar from '../../components/NavigationBar';
import ImageGridSelect from '../../components/image/ImageGridSelect';

import Colors from '../../theme/colors';

const HEADER_HEIGHT = 390;
const LIMIT_PHOTOS = 5;

const ImageGridMenuSelector = ({
  galleryOffsetY,
  showGallery,
  setShowGallery,
  onPhotosUpdate,
  onGalleryPressBack,
  onGalleryPressNext,
}) => {
  const ref = useRef({
    preGalleryOffsetY: 0,
    showGroups: false,
  });
  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(-1);
  const [multiple, setMultiple] = useState(false);
  const groupsOffsetX = useMemo(() => new Animated.Value(0), []);
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);

  const focused = useIsFocused();

  useEffect(() => {
    onPhotosUpdate(photos);
  }, [photos]);

  useEffect(() => {
    if (focused) {
      CameraRoll.getPhotos({
        assetType: 'Photos',
        first: 1000,
      }).then(result => {
        //   console.log(result.edges);
        const photos = result.edges;
        const groupList = Array.from(
          new Set(photos.map(photo => photo.node.group_name)),
        );
        // get by album
        // const photos = result;
        // const groupList = Array.from(new Set(photos.map(photo => photo.title)));
        setGroups(groupList);
        if (groupList.length > 0) setSelectedGroupIndex(0);
      });
    }
    return () => {};
  }, [focused]);

  useEffect(() => {
    if (selectedGroupIndex > -1) {
      CameraRoll.getPhotos({
        assetType: 'Photos',
        first: 9 * page,
        groupName: groups[selectedGroupIndex],
      }).then(result => {
        const photos = result.edges;
        setPhotos(photos);
        if (photos.length > 0 && selectedIndex < 0) setSelectedIndex(0);
      });
    }
  }, [selectedGroupIndex, page]);

  const onLoadMore = () => {
    setPage(page + 1);
  };

  const _onGalleryPressBack = () => {
    // onHideGallery();
    onGalleryPressBack();
  };

  const _onGalleryPressNext = () => {
    onHideGallery();
    onGalleryPressNext();
  };

  const onDoneMultiSelect = () => {
    const images = [...selectedPhotos].map(photoIndex => ({
      width: photos[photoIndex].node.image.width,
      height: photos[photoIndex].node.image.height,
      uri: photos[photoIndex].node.image.uri,
      base64: '',
      extension:
        photos[photoIndex].node.image.filename.split('.').pop() || 'jpg',
    }));
    navigate('StoryProcessor', {
      images,
      sendToDirect,
      username,
    });
  };

  const onSelectImage = index => {
    if (multiple) {
      const position = selectedPhotos.indexOf(index);
      if (position > -1) {
        if (selectedPhotoIndex == index) {
          const temp = [...selectedPhotos];
          temp.splice(position, 1);

          if (temp.length <= LIMIT_PHOTOS) {
            setSelectedPhotos(() => {
              setSelectedPhotoIndex(temp[temp.length - 1]);
              return temp;
            });
          }
        } else {
          setSelectedPhotoIndex(index);
        }
      } else {
        const temp = [...selectedPhotos];
        temp.push(index);
        if (temp.length <= LIMIT_PHOTOS) {
          setSelectedPhotos(temp);
          setSelectedPhotoIndex(index);
        }
      }
    } else {
      const images = [];
      images.push({
        width: photos[index].node.image.width,
        height: photos[index].node.image.height,
        uri: photos[index].node.image.uri,
        base64: '',
        extension: photos[index].node.image.filename.split('.').pop() || 'jpg',
      });
      setSelectedPhotoIndex(0);

      // navigate('StoryProcessor', {
      //   images,
      //   sendToDirect,
      //   username,
      // });
    }
  };

  const onShowGroups = () => {
    if (ref.current.showGroups) {
      Animated.timing(groupsOffsetX, {
        duration: 150,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(groupsOffsetX, {
        toValue: 150,
        useNativeDriver: true,
      }).start();
    }
    ref.current.showGroups = !ref.current.showGroups;
  };

  const onSelectGroup = index => {
    setSelectedGroupIndex(index);
    Animated.timing(groupsOffsetX, {
      duration: 150,
      toValue: 0,
      useNativeDriver: true,
    }).start();
    ref.current.showGroups = !ref.current.showGroups;
  };

  const onHideGallery = () => {
    Animated.timing(galleryOffsetY, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      if (showGallery) setShowGallery(false);
    });
    ref.current.preGalleryOffsetY = 0;
  };

  const titleCustom = (
    <TouchableOpacity
      onPress={onShowGroups}
      activeOpacity={0.8}
      style={{
        ...styles.btnGalleryOptionContainer,
      }}>
      <Text style={styles.btnGalleryOption}>{groups[selectedGroupIndex]}</Text>
      <Icon name="chevron-down" size={24} color={Colors.primaryText} />
    </TouchableOpacity>
  );
  return (
    <>
      <Animated.View
        style={{
          ...styles.galleryInfo,
          transform: [
            {
              translateY: galleryOffsetY,
            },
          ],
          zIndex: 1,
          opacity: galleryOffsetY.interpolate({
            inputRange: [-SCREEN_HEIGHT + HEADER_HEIGHT, 0],
            outputRange: [1, 0],
          }),
        }}>
        <NavigationBar
          navigationStyle={{paddingHorizontal: 10}}
          title="Your Gallery"
          onPressBack={_onGalleryPressBack}
          onPressNext={_onGalleryPressNext}
          buttonText={'Next'}
          titleCustom={titleCustom}
        />

        <View style={{width: '100%'}}>
          <View
            style={{
              width: '100%',
              height: 300,
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: '100%',
                height: 300,
                // height: '100%',
                // aspectRatio: 1,
                // resizeMode: 'stretch',
              }}
              source={{
                uri: 'https://images.dog.ceo/breeds/redbone/n02090379_433.jpg',
                // uri: selectedPhotoIndex
                //   ? photos[selectedPhotoIndex].node.image.uri
                //   : photos[0].node.image.uri,
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={setMultiple.bind(null, !multiple)}
            style={{
              ...styles.btnGalleryMultipleOption,
              borderColor: multiple
                ? Colors.focusColor
                : 'rgba(255,255,255,0.7)',
              backgroundColor: multiple ? Colors.focusColor : 'rgba(0,0,0,0.2)',
              right: 18,
              bottom: 18,
              position: 'absolute',
            }}>
            <Icon name="layers-outline" size={30} color={Colors.onFocusColor} />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={{
            position: 'absolute',
            top: STATUS_BAR_HEIGHT + 44,
            left: -150,
            width: 150,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ddd',
            borderLeftWidth: 0,
            transform: [
              {
                translateX: groupsOffsetX,
              },
            ],
          }}>
          <FlatList
            keyExtractor={keyExtractor}
            data={groups}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={onSelectGroup.bind(null, index)}
                style={styles.btnGroup}>
                <Text
                  style={{
                    fontWeight: index === selectedGroupIndex ? '600' : '500',
                    color: index === selectedGroupIndex ? '#000' : '#666',
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </Animated.View>
      <ImageGridSelect
        photos={photos}
        selectedPhotos={selectedPhotos}
        selectedPhotoIndex={selectedPhotoIndex}
        multiple={multiple}
        galleryOffsetY={galleryOffsetY}
        onLoadMore={onLoadMore}
        onDoneMultiSelect={onDoneMultiSelect}
        onSelectImage={onSelectImage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  galleryInfo: {
    // paddingHorizontal: 10,
    height: HEADER_HEIGHT,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  imagePreviewContainer: {
    height: HEADER_HEIGHT - STATUS_BAR_HEIGHT - 40,
  },
  btnGalleryOptionContainer: {
    height: 44,
    flexDirection: 'row',
    // backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGalleryOption: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  btnGalleryMultipleOption: {
    height: 44,
    width: 44,
    // flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGroup: {
    height: 44,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
});

export default ImageGridMenuSelector;
