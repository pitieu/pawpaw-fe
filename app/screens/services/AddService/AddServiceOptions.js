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

const AddServiceOptions = props => {
  const isFocused = useIsFocused();

  const {t, navigation, route} = props;

  const [selectedId, setSelectedId] = useState(null);
  const [services, setServices] = useState(
    route.params.services || [
      {
        id: 1,
        name: 'Small',
        description: 'Dogs up to 10kg',
        price: '80000',
        priceType: 'weight',
        weightStart: '0',
        weightEnd: '10',
      },
      {
        id: 2,
        name: 'Medium',
        description: 'Dogs from 11kg to 20kg',
        price: '100000',
        priceType: 'weight',
        weightStart: '11',
        weightEnd: '20',
      },
      {
        id: 3,
        name: 'Big',
        description: 'Dogs from 21kg and above',
        price: '120000',
        priceType: 'weight',
        weightStart: '21',
        weightEnd: '999',
      },
    ],
  );

  useEffect(() => {
    async function refresh() {
      let services = await AsyncStorage.getItem('@services');
      if (services !== null && services !== '') {
        services = JSON.parse(services);
        setServices(services);
        await AsyncStorage.setItem('@services', '');
      }
    }
    refresh();
  }, [isFocused]);

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
          extraData={item.description}
          actionIcon="chevron-forward"
          onPress={() => navigateTo('AddServiceOption', {...item, services})}
        />
      </>
    );
  };

  const goBack = () => {
    AsyncStorage.setItem('@services', JSON.stringify(services));
    navigation.goBack();
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
});

export default memo(withTranslation()(AddServiceOptions));
