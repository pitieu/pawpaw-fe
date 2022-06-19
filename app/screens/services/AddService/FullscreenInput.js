// import dependencies
import {t} from 'i18next';
import React, {memo, useState, useRef} from 'react';

import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// import components
import NavigationBar from '../../../components/NavigationBar';

// api
import {toast} from '../../../store/actions/toast';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const FullscreenInput = props => {
  const {navigation, maxLength = 1600, route} = props;
  const [inputText, setInputText] = useState(route.params.description || '');
  const textInput = useRef();

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };
  const save = () => {
    Toast.hide();
    const chars = 30;
    if (inputText.length < chars) {
      props.toast(t('description_min_required', {chars: chars}));
    } else {
      navigateTo('AddPetService', {
        description: inputText,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={t('service_description_title')}
        buttonNextText={t('save')}
        onPressNext={save}
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
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    textAlignVertical: 'top',
  },
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toast,
    },
    dispatch,
  );
export default memo(connect(null, mapDispatchToProps)(FullscreenInput));
