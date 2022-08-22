// import dependencies
import {t} from 'i18next';
import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';

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
import {useNavigation} from '@react-navigation/native';

// import components
import NavigationBar from '../../components/NavigationBar';

// api
import {toast} from '../../store/actions/toast';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const FullScreenInput = (props, ref) => {
  const {
    maxLength = 1600,
    minLength = 30,
    title,
    saveGoTo,
    value,
    containerStyle,
    onSavePressed,
    onPressBack = () => {},
  } = props;
  const navigation = useNavigation();

  const [inputText, setInputText] = useState(value || '');
  const textInput = useRef(null);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  useImperativeHandle(ref, () => ({
    setText: newText => {
      setInputText(newText);
    },
    focus: () => {
      textInput.current.focus();
    },
  }));

  const save = useCallback(() => {
    Toast.hide();
    if (inputText.length > maxLength) {
      props.toast(t('description_max_exceeded', {chars: maxLength}));
    } else if (inputText.length < minLength) {
      props.toast(t('description_min_required', {chars: minLength}));
    } else {
      Keyboard.dismiss();

      if (onSavePressed) {
        onSavePressed(inputText);
      }
      if (saveGoTo) {
        navigateTo(saveGoTo, {
          description: inputText,
        });
      }
    }
  }, [inputText]);

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <NavigationBar
        title={title}
        onPressBack={() => {
          Keyboard.dismiss();
          onPressBack(inputText);
        }}
        buttonNextText={t('save').toUpperCase()}
        onPressNext={save}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={{alignSelf: 'flex-end'}}>
          <Text
            style={[
              {alignSelf: 'flex-end', color: Colors.success},
              inputText.length > maxLength || inputText.length < minLength
                ? {color: Colors.error}
                : null,
            ]}>
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
            // autoFocus={true}
            style={styles.input}
            keyboardType={'default'}
            returnKeyType="done"
            returnKeyLabel="finished"
            enablesReturnKeyAutomatically={true}
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
    paddingTop: Layout.MEDIUM_PADDING,
  },
  input: {
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    textAlignVertical: 'top',
    height: '100%',
    width: '100%',
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

export default memo(
  connect(null, mapDispatchToProps, null, {forwardRef: true})(
    forwardRef(FullScreenInput),
  ),
);
