// import dependencies
import React, {useState} from 'react';
import {View} from 'react-native';

import UnderlineTextInput from './UnderlineTextInput';
import Icon from 'react-native-vector-icons/dist/Ionicons';

// components
import TouchableItem from '../TouchableItem';

// import colors
import Colors from '../../theme/colors';
import {REMOVE_CIRCLE_ICON, ADD_CIRCLE_ICON} from '../../constants/icons';

const NumberButtonsInput = props => {
  const {onChangeText, containerStyle} = props;
  const [amount, setAmount] = useState('0');

  const onPressReduce = () => {
    if (parseInt(amount) > 0)
      setAmount(amount => {
        amount = parseInt(amount);
        amount--;
        onChangeText(amount);
        return String(amount);
      });
  };
  const onPressIncrease = () => {
    setAmount(amount => {
      amount = parseInt(amount);
      amount++;
      onChangeText(amount);
      return String(amount);
    });
  };

  const onInputChange = _amount => {
    setAmount(_amount);
    onChangeText(_amount);
  };

  return (
    <View
      style={[
        containerStyle,
        {
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <TouchableItem
        style={{
          alignContent: 'center',
          paddingLeft: 2,
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
        onPress={onPressReduce}
        disabled={parseInt(amount) <= 0}>
        <Icon
          name={REMOVE_CIRCLE_ICON}
          size={28}
          color={parseInt(amount) <= 0 ? Colors.gray : Colors.focusColor}
        />
      </TouchableItem>
      <View
        style={{
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderBottomColor:
            parseInt(amount) <= 0 ? Colors.gray : Colors.focusColor,
          borderTopColor: Colors.focusColor,
        }}>
        <UnderlineTextInput
          {...props}
          wrapperStyle={{width: 40}}
          inputContainerStyle={{
            borderBottomWidth: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 3,
          }}
          onChangeText={onInputChange}
          value={amount}
          returnKeyType="done"
          keyboardType={'number-pad'}
          inputStyle={{
            borderBottomWidth: 0,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 5,
            paddingBottom: 3,
            height: 24,
          }}
        />
      </View>
      <TouchableItem
        style={{
          // backgroundColor: Colors.focusColor,
          alignContent: 'center',
          paddingLeft: 2,
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
        }}
        onPress={onPressIncrease}>
        <Icon name={ADD_CIRCLE_ICON} size={28} color={Colors.focusColor} />
      </TouchableItem>
    </View>
  );
};

export default NumberButtonsInput;
