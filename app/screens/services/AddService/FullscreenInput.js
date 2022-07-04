// import dependencies
import {t} from 'i18next';
import React, {memo, useState, useRef, Fragment} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
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
        // buttonNextText={`${inputText.length}/${maxLength}`}
        buttonNextText={t('save').toUpperCase()}
        onPressNext={save}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={{alignSelf: 'flex-end'}}>
          <Text style={{alignSelf: 'flex-end'}}>
            {inputText.length}/{maxLength}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => textInput.focus()}
          style={styles.input}>
          <TextInput
            ref={textInput}
            multiline={true}
            onChangeText={setInputText}
            value={inputText}
            numberOfLines={99}
            autoFocus={true}
            style={styles.input}
            keyboardType={'default'}
            returnKeyType="done"
            returnKeyLabel="finished"
            enablesReturnKeyAutomatically={true}
            // onSubmitEditing={Keyboard.dismiss}
          />
        </TouchableOpacity>
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
    height: '100%',
    width: '100%',
    // backgroundColor: 'green',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    paddingBottom: 0,
    backgroundColor: '#fff',
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
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
