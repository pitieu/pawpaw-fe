// import dependencies
import React, {useState, memo, Fragment} from 'react';
import {
  Platform,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import {t} from 'i18next';

// components
import UploadImage from '../../../components/image/uploadImage';
import ListItem from '../../../components/list/listItem';
import Divider from '../../../components/divider/Divider';
import OutlinedButton from '../../../components/buttons/OutlinedButton';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const IOS = Platform.OS === 'ios';

const AddPetService = props => {
  const {navigation} = props;
  const [photos, setPhotos] = useState([]);

  const onChange = _photos => {
    setPhotos(_photos);
  };

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  return (
    <Fragment>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View>
            <UploadImage onChange={onChange} />
            <Divider type="inset" />
            <ListItem
              actionIcon="chevron-forward"
              actionIconColor="green"
              // icon="add"
              // disabled={!photos.length}
              onPress={() => navigateTo('AddServiceDetails')}
              title={t('service_details')}
              extraData={t('service_details_subtitle')}
            />
            <Divider type="inset" />
            <ListItem
              onPress={() =>
                navigateTo('Test', {
                  pH: 300,
                  pW: 300,
                  pX: 200,
                  pY: 200,
                  oH: 200,
                  oW: 200,
                  pScale: 100,
                  uri: 'https://www.statnews.com/wp-content/uploads/2019/05/GettyImages-484960237-645x645.jpg',
                  borderRadius: false,
                  unScaled: true,
                })
              }
              actionIcon="chevron-forward"
              title={t('service_delivery')}
              extraData={t('service_delivery_subtitle')}
            />
            <Divider type="inset" />
            <ListItem
              actionIcon="chevron-forward"
              title={t('service_options')}
              extraData={t('service_options_subtitle')}
            />
            <Divider type="inset" />
            <ListItem
              actionIcon="chevron-forward"
              title={t('service_addons')}
              extraData={t('service_addons_subtitle')}
            />
            <Divider type="inset" />
          </View>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <OutlinedButton
            disabled={true}
            color={Colors.onPrimaryColor}
            titleColor={Colors.primaryColor}
            title={t('save_draft').toUpperCase()}
            buttonStyle={[styles.outlinedButton, styles.firstOutlinedButton]}
          />
          <OutlinedButton
            color={Colors.primaryColor}
            titleColor={Colors.white}
            disabled={true}
            title={t('sell').toUpperCase()}
            buttonStyle={styles.outlinedButton}
          />
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white', //Colors.background,
  },
  firstOutlinedButton: {
    marginRight: Layout.SMALL_PADDING,
  },
  outlinedButton: {
    flex: 1,
  },
});

export default memo(AddPetService);
