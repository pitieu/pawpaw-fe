// import dependencies
import React, {memo, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import components
import Icon from '../../../components/icon/Icon';
import {Subtitle1, Subtitle2} from '../../../components/text/CustomText';
import NavigationBar from '../../../components/NavigationBar';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const FullscreenInput = props => {
  const {t, navigation, maxLength = 1600, route} = props;
  const [inputText, setInputText] = useState(route.params.description || '');
  const textInput = useRef();

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title="Add Service Details"
        // onPressBack={navigation.goBack}
        buttonNextText={'Next'}
        onPressNext={() =>
          navigateTo('AddPetService', {
            description: inputText,
          })
        }
      />
      <View style={styles.wrapper}>
        <Text style={{alignSelf: 'flex-end'}}>
          {inputText.length}/{maxLength}
        </Text>
        <TextInput
          ref={textInput}
          multiline={true}
          onChangeText={setInputText}
          value={inputText}
          numberOfLines={99}
          autoFocus={true}
          style={styles.input}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  wrapper: {
    flex: 1,
    padding: Layout.LARGE_PADDING,
  },
  input: {
    flex: 1,
    // backgroundColor: 'red',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    textAlignVertical: 'top',
    // fontSize: 20,
  },
});

export default memo(FullscreenInput);
