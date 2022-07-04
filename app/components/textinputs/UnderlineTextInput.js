// import dependencies
import React, {useState} from 'react';
import {I18nManager, StyleSheet, TextInput, View, Text} from 'react-native';

// import colors
import Colors from '../../theme/colors';
import {currencyPunctuation} from '../../utils/currency';

// UnderlineTextInput Config
const isRTL = I18nManager.isRTL;
const INPUT_HEIGHT = 44;
const INPUT_WIDTH = '100%';

// UnderlineTextInput Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    // paddingVertical: 4,
    // paddingHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    width: INPUT_WIDTH,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 0,
    height: INPUT_HEIGHT,
    fontSize: 16,
    color: Colors.primaryText,
    textAlign: isRTL ? 'right' : 'left',
  },
  underlineContainer: {
    marginTop: -4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  underline: {
    color: Colors.onSurface,
  },
  limitCount: {
    color: Colors.onSurface,
  },
  overline: {
    marginTop: 30,
    fontWeight: 'bold',
  },
  decoBeforeInput: {
    marginRight: 5,
    fontWeight: 'bold',
  },
  decoAfterInput: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

// UnderlineTextInput
const UnderlineTextInput = ({
  onRef = () => {},
  onChangeText = () => {},
  onFocus = () => {},
  onSubmitEditing,
  returnKeyType, //'done' | 'go' | 'next' | 'search' | 'send',
  blurOnSubmit,
  onKeyPress,
  keyboardType, // 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad',
  autoCapitalize = 'none', //'none' | 'sentences' | 'words' | 'characters',
  maxLength = 60,
  placeholder,
  placeholderTextColor,
  value,
  inputTextColor,
  secureTextEntry,
  borderColor,
  focusedBorderColor = Colors.primaryColor,
  inputContainerStyle,
  inputStyle,
  underline,
  underlineColor,
  showMaxLength,
  overline,
  overlineStyle,
  overlineColor,
  decoBeforeInput,
  decoBeforeInputStyle,
  decoAfterInput,
  decoAfterInputStyle,
  mandatory,
  inputType, // currency, ??
  wrapperStyle,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const doFocus = attr => {
    setInputFocused(true);
    onFocus(attr);
  };

  const unFocus = () => {
    setInputFocused(false);
  };

  const changedText = text => {
    if (inputType == 'currency') {
      onChangeText(currencyPunctuation(text));
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={wrapperStyle}>
      {overline && (
        <Text
          style={[
            styles.overline,
            overlineStyle,
            overlineColor && {color: overlineColor},
          ]}>
          {overline}&nbsp;{mandatory}
        </Text>
      )}
      <View
        style={[
          styles.container,
          borderColor && {borderColor},
          inputFocused && {borderColor: focusedBorderColor},
          inputContainerStyle && inputContainerStyle,
        ]}>
        <Text style={[styles.decoBeforeInput, decoBeforeInputStyle]}>
          {decoBeforeInput}
        </Text>
        <TextInput
          ref={r => onRef(r)}
          onChangeText={changedText}
          onFocus={doFocus}
          onBlur={unFocus}
          inputFocused={inputFocused}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          onKeyPress={onKeyPress}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={inputType == 'currency' ? currencyPunctuation(value) : value}
          secureTextEntry={secureTextEntry}
          style={[
            styles.textInput,
            inputTextColor && {color: inputTextColor},
            inputStyle,
          ]}
        />
        <Text style={[styles.decoAfterInput, decoAfterInputStyle]}>
          {decoAfterInput}
        </Text>
      </View>

      <View
        style={[
          styles.underlineContainer,
          !underline && {justifyContent: 'flex-end'},
        ]}>
        {underline && (
          <Text
            style={[
              styles.underline,
              underlineColor && {color: underlineColor},
            ]}>
            {underline}
          </Text>
        )}
        {showMaxLength && (
          <Text style={styles.limitCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

export default UnderlineTextInput;
