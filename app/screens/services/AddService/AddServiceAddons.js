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
} from 'react-native';
import {withTranslation} from 'react-i18next';
// import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';

// import components
import NavigationBar from '../../../components/NavigationBar';
import ListService from '../../../components/list/listService';
import Divider from '../../../components/divider/Divider';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';
import {ADD_ICON} from '../../../constants/icons';

const AddServiceAddons = props => {
  const {t, navigation, route} = props;
  const [addons, setAddons] = useState(route?.params?.addons);

  useEffect(() => {
    setAddons(() => route?.params?.addons);
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
          onPress={() =>
            navigateTo('AddServiceAddon', {
              ...item,
              addons,
            })
          }
        />
      </>
    );
  };

  const goBack = () => {
    navigation.navigate('AddPetService', {
      addons,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={t('add_service_addons_title')}
        onPressBack={goBack}
        onPressButtonRight={() =>
          navigateTo('AddServiceAddon', {
            new: true,
            addons,
          })
        }
        buttonRightIcon={'add'}
      />
      <FlatList
        // showsVerticalScrollIndicator={false}
        // bounces={false}
        data={addons}
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
});

export default memo(withTranslation()(AddServiceAddons));
