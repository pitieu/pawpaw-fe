// import React, {memo} from 'react';
// import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// // import FastImage from 'react-native-fast-image';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import {SCREEN_WIDTH} from '../../constants';
// import {navigate} from '../../navigation/RootNavigation';
// import {capitalizeFirstLetter} from '../../utils';

// const ITEM_SIZE = (SCREEN_WIDTH - 6) / 3;
// const RecommendItem = ({item, index, showClassMask}) => {
//   const _onViewPost = () => {
//     navigate('PostDetail', {
//       postId: item.uid,
//     });
//   };
//   const sourceIndex = item.labels?.indexOf(item.className) || 0;
//   return (
//     <TouchableOpacity
//       style={{
//         marginHorizontal: (index - 1) % 3 === 0 ? 3 : 0,
//         marginBottom: 3,
//         overflow: 'hidden',
//       }}
//       activeOpacity={0.8}
//       onPress={_onViewPost}>
//       {/* <FastImage
//         source={{
//           uri: item.source && item.source[sourceIndex].uri,
//         }}
//         style={{
//           width: ITEM_SIZE,
//           height: ITEM_SIZE,
//         }}
//       /> */}
//       {item.source && item.source.length > 1 && (
//         <View
//           style={{
//             position: 'absolute',
//             top: 10,
//             right: 10,
//           }}>
//           <Icon name="layers" size={24} color="#fff" />
//         </View>
//       )}
//       {/*
//       {!!showClassMask && (
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() =>
//             navigate('ImageClass', {
//               className: item.className,
//             })
//           }
//           style={{
//             position: 'absolute',
//             height: 44,
//             borderTopRightRadius: 9999,
//             backgroundColor: 'rgba(0,0,0,0.75)',
//             bottom: -21,
//             paddingRight: 15,
//             left: 0,
//             overflow: 'hidden',
//           }}>
//           <View
//             style={{
//               height: 22,
//               justifyContent: 'center',
//               alignItems: 'center',
//               paddingHorizontal: 15,
//               paddingVertical: 2,
//             }}>
//             <Text
//               style={{
//                 color: '#fff',
//                 fontWeight: '500',
//               }}>
//               {capitalizeFirstLetter(item.className)}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       )} */}
//     </TouchableOpacity>
//   );
// };

// export default memo(RecommendItem);

// const styles = StyleSheet.create({});
