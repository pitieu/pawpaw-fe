import React, {useRef, memo, useCallback} from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
} from 'react-native';

import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants';
import Colors from '../../theme/colors';

const uploadImageGrid = ({
  columns = 4,
  selectedPhotos,
  selectedPhotoIndex,
  photos,
  multiple,
  galleryOffsetY,
  onLoadMore,
  onSelectImage,
}) => {
  const imageWrapper = {
    width: (SCREEN_WIDTH - 5) / columns,
    height: (SCREEN_WIDTH - 5) / columns,
  };
  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <Animated.View
      style={{
        ...styles.imageGalleryWrapper,
        transform: [
          {
            translateY: galleryOffsetY,
          },
        ],
      }}>
      <FlatList
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        style={styles.galleryList}
        data={photos}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={onSelectImage.bind(null, index)}
            activeOpacity={0.8}
            style={{
              ...styles.imageWrapper,
              ...imageWrapper,
              marginHorizontal: (index - 1) % 2 === 0 ? 2.5 : 0,
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
                  borderColor:
                    selectedPhotos.indexOf(index) > -1 ? 'transparent' : '#fff',
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
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    {selectedPhotos.indexOf(index) + 1}
                  </Text>
                )}
              </View>
            )}
            <Image
              source={{
                uri: item.node.image.uri,
              }}
              style={{
                width: '100%',
                height: '100%',
                // opacity: 0.7,
                borderWidth: index == selectedPhotoIndex ? 3 : 0,
                borderColor:
                  index == selectedPhotoIndex
                    ? Colors.focusColor
                    : 'transparent',
              }}
            />
          </TouchableOpacity>
        )}
        numColumns={columns}
        onEndReachedThreshold={0.5}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageGalleryWrapper: {
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT,
    position: 'absolute',
    width: '100%',
    top: SCREEN_HEIGHT,
    left: 0,
  },
  galleryList: {
    marginVertical: 1,
    maxHeight: SCREEN_HEIGHT - 170 - 2.5,
  },
  imageWrapper: {
    marginVertical: 1,
  },
  selectedImageWrapper: {
    paddingHorizontal: 5,
    bottom: 170,
    left: 0,
    position: 'absolute',
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 10,
  },
  previewMultiImage: {
    height: 54,
    width: 32,
    resizeMode: 'cover',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default memo(uploadImageGrid);
