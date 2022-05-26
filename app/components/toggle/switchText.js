import React from 'react';
import SwitchSelector from 'react-native-switch-selector';
import I18n from '../../assets/i18n/i18n';

import {StyleSheet, View} from 'react-native';

import Colors from '../../theme/colors';

const options = [
  {
    label: 'EN',
    value: 'en',
  },
  {
    label: 'ID',
    value: 'id',
  },
];

const styles = StyleSheet.create({
  lang: {
    width: 100,
  },
});

class App extends React.Component {
  state = {
    language: 'en',
  };
  switchLanguage = prop => {
    const {language} = this.state;

    this.setState({
      language: prop == 'en' ? 'id' : 'en',
    });
    I18n.changeLanguage(prop);
    // console.log(i18n.changeLanguage(language));
    // console.log(language);
  };

  render() {
    return (
      <View style={styles.lang}>
        <SwitchSelector
          textColor={Colors.customonOnPrimaryColor}
          selectedColor={Colors.white}
          buttonColor={Colors.customonOnPrimaryColor}
          borderColor={Colors.customonOnPrimaryColor}
          borderRadius={5}
          hasPadding
          options={options}
          initial={I18n.language == 'en' ? 0 : 1}
          onPress={this.switchLanguage}
        />
      </View>
    );
  }
}
export default App;
