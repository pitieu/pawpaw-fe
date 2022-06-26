// import dependencies
import React, {useState, memo, useEffect, Fragment} from 'react';
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
import Button from '../../../components/buttons/Button';

// api
import {toast} from '../../../store/actions/toast';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const MIN_NAME_CHARS = 6;

const AddServiceDetails = props => {
  const {navigation, route} = props;

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(route.params.name || '');
  const [nameComponent, setNameComponent] = useState();
  // error vars
  const [nameError, setNameError] = useState(false);
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
  const checkName = currName => {
    setName(currName);
    if (!currName?.length || currName?.length < MIN_NAME_CHARS) {
      setNameError(t('error_name', {chars: MIN_NAME_CHARS}));
      return true;
    } else {
      setNameError(false);
    }
    return false;
  };

  const save = () => {
    Toast.hide();

    if (name.length < MIN_NAME_CHARS) {
      checkName(name);
      // props.toast(t('name_min_required', {chars: MIN_NAME_CHARS}));
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
        // buttonNextText={t('save')}
        // onPressNext={save}
      />
      <Fragment>
        <KeyboardAwareScrollView enableOnAndroid>
          <View style={styles.wrapper}>
            <UnderlineTextInput
              onRef={r => {
                setNameComponent(r);
              }}
              overline={t('service_name')}
              overlineColor={nameError ? Colors.error : null}
              placeholder={t('service_name_placeholder')}
              value={name}
              onChangeText={checkName}
              onSubmitEditing={save}
              returnKeyType="done"
              mandatory={'*'}
              underline={nameError}
              underlineColor={nameError ? Colors.error : null}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.bottomButtonsContainer}>
          <Button
            color={Colors.primaryColor}
            disabled={isLoading}
            onPress={save}
            title={
              isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                t('save').toUpperCase()
              )
            }
            titleColor={Colors.onPrimaryColor}
          />
        </View>
      </Fragment>
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
export default memo(connect(null, mapDispatchToProps)(AddServiceDetails));
