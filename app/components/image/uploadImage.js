import React, {
  useEffect,
  memo,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  View,
  Image,
  Button,
  Platform,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import {t} from 'i18next';

// components
import OutlinedButton from '../../components/buttons/OutlinedButton';
import {Subtitle1} from '../text/CustomText';

// api
import {toast} from '../../store/actions/toast';

// import utils
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import {removeDuplicateObjectFromArray} from '../../utils';
import {TRASH_OUTLINE_ICON, RIBBON_ICON} from '../../constants/icons';
import {IOS} from '../../constants/';

export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const {width, height} = Dimensions.get('window');

const {SlideInMenu} = renderers;

const PHOTOS_PER_ROW = 4;
const VIDEO_MAX_DURATION_SECONDS = 10 * 60; //10 minutes

// Layout related
const CONTAINER_PADDING = Layout.LARGE_PADDING;
const IMAGE_CONTAINER_MARGIN = 0;
const SPACE_PADDING = 5;
const PHOTO_WIDTH =
  (width -
    2 * IMAGE_CONTAINER_MARGIN -
    PHOTOS_PER_ROW * 3 * SPACE_PADDING -
    2 * CONTAINER_PADDING) /
  PHOTOS_PER_ROW;
const PHOTO_HEIGHT =
  (width -
    2 * IMAGE_CONTAINER_MARGIN -
    PHOTOS_PER_ROW * 3 * SPACE_PADDING -
    2 * CONTAINER_PADDING) /
  PHOTOS_PER_ROW; // use width to make a rectangle

// TODO find a way to allow images added in order.
// TODO FIXED but manually overwrote file. should wait for merge
// currently when you select images the order is defined based on
// how they are in the library.
// issue: https://github.com/react-native-image-picker/react-native-image-picker/pull/1970

export const createFormData = (photos, body = {}) => {
  const data = new FormData();

  photos.forEach(photo => {
    data.append('photos[]', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

const UploadImage = (props, ref) => {
  const {uploadType, addPhoto, photoLimit = 6, titleColor} = props;
  const [photos, setPhotos] = useState([]);

  useImperativeHandle(ref, () => ({
    updatePhotos,
  }));

  useEffect(() => {
    if (props.onChange) {
      props.onChange(photos);
    }
  }, [photos]);

  const hasPrimaryImage = useCallback(() => {
    return photos.some(item => item.default);
  }, [photos]);

  const deletePhoto = useCallback(fileName => {
    setPhotos(photos => {
      if (photos.length) {
        let _photos = photos.filter(photo => {
          return photo.fileName !== fileName;
        });
        if (!hasPrimaryImage(_photos) && _photos.length) {
          _photos[0].default = true;
        }
        return _photos;
      }
      return photos;
    });
  }, []);

  const setPrimaryImage = useCallback(fileName => {
    setPhotos(photos => {
      let arrPos = -1;
      let _photos = photos.map((photo, index) => {
        photo.default = photo.fileName == fileName ? true : false;
        arrPos = photo.fileName == fileName ? index : arrPos;

        return photo;
      });
      if (arrPos > -1) {
        const moveFirst = _photos.splice(arrPos, 1);
        _photos.unshift(moveFirst[0]);
      }
      return _photos;
    });
  }, []);

  const handleChoosePhoto = useCallback(async () => {
    console.log('uploadType', uploadType);
    if (uploadType == 'camera') {
      addPhoto();
    } else {
      // For more options
      // https://github.com/react-native-image-picker/react-native-image-picker
      response = await launchImageLibrary({
        noData: true,
        selectionLimit: photoLimit,
        durationLimit: VIDEO_MAX_DURATION_SECONDS,
        quality: 1, // 0 to 1
        videoQuality: 'high', // low or high
        mediaType: 'mixed', // allows photos and videos to be uploaded
      });

      if (response) {
        let _photos = response?.assets;
        if (_photos) {
          // console.log(_photos);
          updatePhotos(_photos);
        }
      }
    }
  }, [photos]);

  const updatePhotos = _photos => {
    console.log('updatePhotos', _photos);

    if (
      _photos[0]?.uri &&
      _photos[0]?.fileSize &&
      _photos[0]?.height &&
      _photos[0]?.width
    ) {
      setPhotos(photos => {
        if (!photos?.length) {
          _photos[0].default = true;
        }
        let res = removeDuplicateObjectFromArray(
          [...photos, ..._photos],
          'fileName',
        );
        if (uploadType == 'camera') {
          res = _photos.map(_p => {
            const p = photos.find(p => _p.fileSize === p.fileSize);
            return p || _p;
          });

          if (!res.some(item => item.default)) {
            res[0].default = true;
          }
        }

        if (res.length > photoLimit) {
          props.toast(t('error_upload_limit', {photo_limit: photoLimit}));
          return photos;
        } else {
          return removeDuplicateObjectFromArray(res, 'fileName');
        }
      });
    }
  };

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const defaultItem = useCallback(({item}) => {
    return (
      <OutlinedButton
        onPress={handleChoosePhoto}
        iconName="camera-outline"
        buttonStyle={styles.btnOutline}
        title={t('add_assets')}
      />
    );
  }, []);

  const imageItem = useCallback(
    ({item}) => {
      if (!item.uri && photos.length < photoLimit) {
        return (
          <TouchableOpacity
            key={item.uri}
            style={[styles.addBtnContainer, styles.imageContainer]}
            onPress={handleChoosePhoto}>
            <Icon
              name={'add-circle-outline'}
              size={26}
              color={Colors.focusColor}
            />
          </TouchableOpacity>
        );
      }

      if (item.uri) {
        return (
          <View style={styles.imageContainer}>
            <Menu renderer={SlideInMenu} style={styles.menu}>
              <MenuTrigger>
                <View
                  style={[
                    styles.imageGroup,
                    item.default ? styles.imageGroupDefault : {},
                  ]}>
                  <Image source={{uri: item.uri}} style={styles.image} />
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={styles.menuOptions}>
                <MenuOption
                  value={item.fileName}
                  onSelect={setPrimaryImage}
                  style={styles.menuOption}>
                  <Icon
                    style={styles.menuOptionIcon}
                    name={RIBBON_ICON}
                    size={IOS ? 26 : 24}
                    color={Colors.primaryText}
                  />
                  <Text style={styles.menuItemText}>
                    {t('set_primary_image').toUpperCase()}
                  </Text>
                </MenuOption>
                <MenuOption
                  value={item.fileName}
                  onSelect={deletePhoto}
                  style={[styles.menuOption, {paddingBottom: 45}]}>
                  <Icon
                    style={styles.menuOptionIcon}
                    name={TRASH_OUTLINE_ICON}
                    size={IOS ? 26 : 24}
                    color={Colors.primaryText}
                  />
                  <Text style={styles.menuItemText}>
                    {t('delete').toUpperCase()}
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        );
      }

      return <></>;
    },
    [photos],
  );

  // TODO add an option to hide subtitleContainer from parent
  return (
    <View ref={ref} style={styles.container}>
      <View style={styles.subtitleContainer}>
        <Subtitle1
          style={{
            fontWeight: '500',
            color: titleColor || Colors.secondaryText,
          }}>
          {t('upload_image')}
        </Subtitle1>
        <Subtitle1
          style={{
            fontWeight: '500',
            color: titleColor || Colors.secondaryText,
          }}>
          &nbsp;({photos.length}/{photoLimit})
        </Subtitle1>
      </View>

      <AnimatedFlatList
        style={styles.flatList}
        data={[...photos, {}]}
        numColumns={PHOTOS_PER_ROW}
        renderItem={photos.length ? imageItem : defaultItem}
        keyExtractor={keyExtractor}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: CONTAINER_PADDING,
    backgroundColor: '#F5F5F5',
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginHorizontal: Layout.LARGE_MARGIN,
    marginBottom: Layout.SMALL_MARGIN,
  },
  menu: {},
  menuOptions: {},
  menuOption: {
    padding: Layout.LARGE_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionIcon: {
    marginRight: Layout.SMALL_PADDING,
  },
  menuItemText: {
    fontWeight: '500',
  },

  addBtnContainer: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACE_PADDING,
  },

  imageGroupDefault: {
    backgroundColor: Colors.focusColor,
  },
  imageGroup: {
    backgroundColor: 'transparent',
    padding: SPACE_PADDING,
    borderRadius: 5,
  },
  imageContainer: {
    // margin: IMAGE_CONTAINER_MARGIN,
  },
  image: {
    borderWidth: 5,
    borderColor: 'transparent',
    borderRadius: 5,
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
  },

  btnOutline: {
    flex: 1,
    // margin: Layout.SMALL_MARGIN,
  },
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toast,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps, null, {forwardRef: true})(
  forwardRef(UploadImage),
);
