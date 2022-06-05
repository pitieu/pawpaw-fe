// import dependencies
import React, {useState, memo} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Subtitle2} from '../../../components/text/CustomText';

// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const IOS = Platform.OS === 'ios';
// const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

const AddServiceDetails = props => {
  const {t} = props;

  const [name, setName] = useState('');
  const [nameComponent, setNameComponent] = useState();
  const [description, setDescription] = useState('');
  const [descriptionComponent, setDescriptionComponent] = useState();

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
          <UnderlineTextInput
            onRef={r => {
              setNameComponent(r);
            }}
            overline={t('service_name')}
            placeholder={t('service_name_placeholder')}
            value={name}
            // underline="Tips: Service Name + Region"
            onChangeText={setName}
            onSubmitEditing={focusOn(descriptionComponent)}
            returnKeyType="next"
            mandatory={'*'}
            // focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            // inputContainerStyle={styles.inputContainerStyle}
            // showMaxLength={true}
            // maxLength={70}
            // decoBeforeInput={'Rp.'}
            // decoBeforeInputStyle={{}}
            // decoAfterInput={'Hello'}
            // decoAfterInputStyle={{color: 'red'}}
          />
          <UnderlineTextInput
            onRef={r => {
              setNameComponent(r);
            }}
            overline={t('service_description')}
            placeholder={t('service_description_placeholder')}
            value={description}
            // underline="Tips: Service Name + Region"
            onChangeText={setDescription}
            onSubmitEditing={focusOn(descriptionComponent)}
            returnKeyType="next"
            mandatory={'*'}
            // focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            // inputContainerStyle={styles.inputContainerStyle}
            // showMaxLength={true}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  editForm: {
    padding: Layout.LARGE_MARGIN,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default memo(withTranslation()(AddServiceDetails));
