// // import dependencies
// import React, {memo, useState} from 'react';
// import {SafeAreaView, StyleSheet, View, Text, TextInput} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {t} from 'i18next';

// // import components
// import Icon from '../../components/icon/Icon';
// import NavigationBar from '../../components/NavigationBar';

// // import colors
// import Colors from '../../theme/colors';
// import Layout from '../../theme/layout';

// const AddressList = ({onChangeText}) => {
//   const navigation = useNavigation();

//   const [city, setCity] = useState(null);
//   const [search, setSearch] = useState(null);

//   const navigateTo = (screen, options) => {
//     navigation.navigate(screen, options);
//   };

//   const changeText = _search => {
//     setSearch(_search);
//     onChangeText(_search);
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <NavigationBar title={t('select_city_title')} />
//       <TextInput
//         onSubmitEditing={focusOn(postalCodeComponent)}
//         value={search}
//         placeholder={t('input_address_name_placeholder')}
//         onChangeText={changeText}
//         returnKeyType={'next'}
//         style={styles.inputField}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   address: {},
// });

// export default memo(AddressList);
