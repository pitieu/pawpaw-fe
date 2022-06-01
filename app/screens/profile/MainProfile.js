// import dependencies
import React from 'react';
import {Text} from 'react-native-elements';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

import {withTranslation} from 'react-i18next';

// import components
import CollapsingHeaderTab from '../../components/tabs/CollapsingHeaderTab';
import HeaderComponent from './Header';

// api
import {auth} from '../../api/Auth';

// import colors
import Colors from '../../theme/colors';

// EditProfile Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

const Profile = () => {
  const navigation = useNavigation();

  useFocusEffect(() => {
    async function fetchData() {
      auth(navigation);
    }
  });

  const Header = (
    <HeaderComponent
      username="Cho"
      description="Let's get started 🚀"
      avatar={'https://picsum.photos/id/1027/300/300'}
      posts="100"
      followers="101"
      followings="102"
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.statusBarColor}
        barStyle="dark-content"
      />
      <CollapsingHeaderTab Header={Header} />
    </SafeAreaView>
  );
};

export default withTranslation()(Profile);
