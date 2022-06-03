// import dependencies
import React, {useState, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Platform,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Subtitle1,
  Subtitle2,
  Subtitle3,
} from '../../../components/text/CustomText';

// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const IOS = Platform.OS === 'ios';
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

const AddPetService = props => {
  const {t} = props;

  const [name, setName] = useState('');
  const [nameFocused, setNameFocused] = useState(true);
  const [nameComponent, setNameComponent] = useState();
  const [description, setDescription] = useState('');
  const [descriptionFocused, setDescriptionFocused] = useState(true);
  const [descriptionComponent, setDescriptionComponent] = useState();

  const nameFocus = () => {
    setNameFocused(true);
  };
  focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.statusBarColor} />
      <KeyboardAwareScrollView enableOnAndroid>
        <View style={styles.editForm}>
          <Subtitle2 style={styles.overline}>{t('service_name')}</Subtitle2>
          <UnderlineTextInput
            onRef={r => {
              setNameComponent(r);
            }}
            placeholder={t('service_name_placeholder')}
            value={name}
            onChangeText={setName}
            onFocus={nameFocus}
            inputFocused={nameFocused}
            onSubmitEditing={focusOn(descriptionComponent)}
            returnKeyType="next"
            focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            inputContainerStyle={styles.inputContainerStyle}
          />

          <Subtitle2 style={styles.overline}>
            {t('service_description')}
          </Subtitle2>
          <UnderlineTextInput
            onRef={r => {
              setNameComponent(r);
            }}
            placeholder={t('service_description_placeholder')}
            value={name}
            onChangeText={setName}
            onFocus={nameFocus}
            inputFocused={nameFocused}
            onSubmitEditing={focusOn(descriptionComponent)}
            returnKeyType="next"
            focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            inputContainerStyle={styles.inputContainerStyle}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  editForm: {
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default memo(withTranslation()(AddPetService));
