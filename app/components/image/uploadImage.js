import React, {useEffect, memo, useState, useCallback} from 'react';
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

// components
import OutlinedButton from '../../components/buttons/OutlinedButton';
import {Subtitle1, Subtitle2} from '../text/CustomText';

// api
import {toast} from '../../store/actions/toast';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import {t} from 'i18next';

export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const {width, height} = Dimensions.get('window');

const {SlideInMenu} = renderers;

const PHOTOS_PER_ROW = 3;
const VIDEO_MAX_DURATION_SECONDS = 10 * 60; //10 minutes
const PHOTO_LIMITS = 6;

// Layout related
const CONTAINER_PADDING = Layout.SMALL_PADDING;
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

const IOS = Platform.OS === 'ios';
// ICONS
const TRASH_ICON = IOS ? 'ios-trash-outline' : 'md-trash-outline';
const PRIMARY_ICON = IOS ? 'ios-ribbon' : 'md-ribbon';

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
function removeDuplicateObjectFromArray(array, key) {
  var check = new Set();
  return array.filter(obj => {
    return !check.has(obj[key]) && check.add(obj[key]);
  });
}

const UploadImage = props => {
  //   const {t} = props;
  const [photos, setPhotos] = useState([]);

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
    // For more options
    // https://github.com/react-native-image-picker/react-native-image-picker
    response = await launchImageLibrary({
      noData: true,
      selectionLimit: PHOTO_LIMITS,
      durationLimit: VIDEO_MAX_DURATION_SECONDS,
      quality: 1, // 0 to 1
      videoQuality: 'high', // low or high
      mediaType: 'mixed', // allows photos and videos to be uploaded
    });

    if (response) {
      let _photos = response?.assets;
      if (_photos) {
        setPhotos(photos => {
          if (!photos?.length) {
            _photos[0].default = true;
          }
          const res = removeDuplicateObjectFromArray(
            [...photos, ..._photos],
            'fileSize',
          );
          if (res.length > PHOTO_LIMITS) {
            props.toast(t('error_upload_limit', {number: PHOTO_LIMITS}));
            return photos;
          } else {
            console.log(res.map(item => item.fileSize));
            return res;
          }
        });
      }
    }
  }, [photos]);

  const handleUploadPhoto = () => {
    fetch(`${SERVER_URL}/api/upload`, {
      headers: {
        Accept: 'application/x-www-form-urlencoded',
        // Authorization: `Bearer ${this.props.user.token}`,
      },
      method: 'POST',
      body: createFormData(photos, {userId: '123'}),
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
      });
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
      if (!item.uri && photos.length < PHOTO_LIMITS) {
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
                    name={PRIMARY_ICON}
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
                  style={styles.menuOption}>
                  <Icon
                    style={styles.menuOptionIcon}
                    name={TRASH_ICON}
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

  return (
    <View style={styles.container}>
      <View style={styles.subtitleContainer}>
        <Subtitle2>{t('upload_image')}</Subtitle2>
        <Subtitle2>
          &nbsp;({photos.length}/{PHOTO_LIMITS})
        </Subtitle2>
      </View>
      <AnimatedFlatList
        style={styles.container}
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
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  menu: {},
  menuOptions: {},
  menuOption: {
    padding: 20,
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
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACE_PADDING,
  },
  container: {
    padding: CONTAINER_PADDING,
    // backgroundColor: 'green',
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
    width: '100%',
  },
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toast,
    },
    dispatch,
  );

export default memo(connect(null, mapDispatchToProps)(UploadImage));
