// import dependencies
import React, {useState, memo, useEffect} from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import {withTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {t} from 'i18next';

// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';
import NavigationBar from '../../../components/NavigationBar';

// api
import {toast} from '../../../store/actions/toast';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const AddServiceDetails = props => {
  const {navigation, route} = props;

  const [name, setName] = useState(route.params.name || '');
  const [nameComponent, setNameComponent] = useState();

  useEffect(() => {
    if (nameComponent) nameComponent.focus();
  }, [nameComponent]);

  focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const save = () => {
    Toast.hide();
    const chars = 6;
    if (name.length < chars) {
      props.toast(t('name_min_required', {chars: chars}));
    } else {
      navigateTo('AddPetService', {
        name: name,
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={t('add_service_details_title')}
        onPressBack={goBack}
        buttonNextText={t('save')}
        onPressNext={save}
      />
      <KeyboardAwareScrollView enableOnAndroid>
        <View style={styles.wrapper}>
          <UnderlineTextInput
            onRef={r => {
              setNameComponent(r);
            }}
            overline={t('service_name')}
            placeholder={t('service_name_placeholder')}
            value={name}
            onChangeText={setName}
            onSubmitEditing={save}
            returnKeyType="done"
            mandatory={'*'}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  wrapper: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toast,
    },
    dispatch,
  );
export default memo(connect(null, mapDispatchToProps)(AddServiceDetails));
