import React, {memo, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

export const {width, height} = Dimensions.get('window');

const ConnectionItem = ({style, connection}) => {
  const {photo, name} = connection;

  const photoUri =
    photo != '' ? {uri: photo} : require('../../assets/img/profile_2.jpeg');
  const mergedStyle = useMemo(() => [styles.container, style], [style]);

  const navigation = useNavigation();

  const navigateTo = screen => () => {
    let page = '';
    if (dataType == 'marketplace') {
      page = 'Product details';
    }
    if (dataType == 'pet_services') {
      page = 'Pet service details';
    }
    if (dataType == 'pet_services') {
      page = 'Social Feed';
    }

    navigation.navigate(page, {
      id: id,
    });
  };
  return (
    <TouchableOpacity onPress={navigateTo()} style={mergedStyle}>
      <Image style={styles.image} source={photoUri} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 1,
    flexDirection: 'row',
    flex: 1,
    paddingRight: 5,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: (width - 6) / 3, //subtract 6 to get a 2px gap
    width: (width - 6) / 3, //subtract 6 to get a 2px gap
    marginRight: 10,
  },
});

export default memo(ConnectionItem);
