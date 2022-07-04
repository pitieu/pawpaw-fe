// import dependencies
import React, {memo, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {withTranslation} from 'react-i18next';

// import components
import NavigationBar from '../../../components/NavigationBar';
import ListService from '../../../components/list/listService';
import Divider from '../../../components/divider/Divider';
import {Subtitle1} from '../../../components/text/CustomText';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const AddServiceOptions = props => {
  const {t, navigation, route} = props;

  const [services, setServices] = useState(route?.params?.services);

  useEffect(() => {
    setServices(() => route?.params?.services);
  }, [route]);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const renderItem = ({item}) => {
    return (
      <>
        <Divider type="inset" />
        <ListService
          title={item.name}
          price={item.price}
          extraData={item.description || ' '}
          actionIcon="chevron-forward"
          onPress={() => navigateTo('AddServiceOption', {...item, services})}
        />
      </>
    );
  };

  const goBack = () => {
    navigation.navigate('AddPetService', {
      services,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={t('add_service_options_title')}
        onPressBack={goBack}
        onPressButtonRight={() =>
          navigateTo('AddServiceOption', {new: true, services})
        }
        buttonRightIcon={'add'}
      />
      <FlatList
        // showsVerticalScrollIndicator={false}
        // bounces={false}
        data={services}
        // onEndReached={_onLoadmore}
        renderItem={renderItem}
        numColumns={1}
        keyExtractor={(_, key) => `${key}`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  variantContainer: {
    padding: Layout.LARGE_PADDING,
    borderColor: '#F0F0F0',
    borderBottomWidth: 3,
    // borderTopWidth: 1,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    marginRight: 10,
  },
  chipUnselected: {
    backgroundColor: '#FFF',
  },
  chipText: {
    color: '#FFF',
  },
  chipTextUnselected: {
    color: Colors.primaryColor,
  },
});

export default memo(withTranslation()(AddServiceOptions));
