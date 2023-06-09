// import React, {useState, useRef} from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   View,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {SCREEN_WIDTH, SCREEN_HEIGHT, STATUS_BAR_HEIGHT} from '../../constants';
// // import SearchResult from '../../components/SearchResult';
// import {navigate} from '../../navigation/RootNavigation';
// // import RecommendPostList from '../../components/Recommend/RecommendPostList';

// const TAB_BAR_HEIGHT = 56;

// export const IMAGE_CLASSES = [
//   {
//     name: 'Grooming',
//     icon: 'shopping',
//   },
//   {
//     name: 'Pet Sitting',
//     icon: 'camera',
//   },
//   {
//     name: 'Pet Hotel',
//     icon: 'artstation',
//   },
//   {
//     name: 'Pet Walking',
//     icon: 'lightbulb-on',
//   },
//   {
//     name: 'Veterinarian',
//     icon: 'food-fork-drink',
//   },
//   {
//     name: 'Pet Training',
//     icon: 'home-variant',
//   },
//   {
//     name: 'Pet Funeral',
//     icon: 'image',
//   },
// ];
// const index = () => {
//   const [query, setQuery] = useState('');
//   const [typing, setTyping] = useState(false);
//   const inputRef = useRef(null);
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.searchWrapper}>
//         {typing ? (
//           <TouchableOpacity
//             onPress={() => {
//               setTyping(false);
//               inputRef.current?.blur();
//             }}
//             style={styles.squareBtn}>
//             <Icon name="arrow-left" size={20} />
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.squareBtn}>
//             <Icon name="magnify" size={20} />
//           </View>
//         )}
//         <TextInput
//           ref={inputRef}
//           onFocus={setTyping.bind(null, true)}
//           placeholder="Search"
//           onChangeText={setQuery}
//           value={query}
//           autoCapitalize="none"
//           style={{
//             ...styles.searchInput,
//             width: SCREEN_WIDTH - (typing ? 44 : 88),
//           }}
//         />
//         {!typing && (
//           <TouchableOpacity style={styles.squareBtn}>
//             <Icon name="qrcode-scan" size={20} />
//           </TouchableOpacity>
//         )}
//         {typing && (
//           <View style={styles.searchResultWrapper}>
//             <Text>SEARCH_HERE</Text>
//             {/* <SearchResult query={query} /> */}
//           </View>
//         )}
//       </View>
//       <ScrollView
//         horizontal={true}
//         showsHorizontalScrollIndicator={false}
//         bounces={false}
//         contentContainerStyle={{
//           height: 40,
//           alignItems: 'center',
//         }}
//         style={styles.labelWrapper}>
//         {IMAGE_CLASSES.map((imgClass, index) => (
//           <TouchableOpacity
//             onPress={() =>
//               navigate('ImageClass', {
//                 className: imgClass.name,
//               })
//             }
//             key={index}
//             style={styles.labelItem}>
//             <Icon name={imgClass.icon} size={16} color="#666" />
//             <Text
//               style={{
//                 marginLeft: 5,
//                 fontWeight: '500',
//               }}>
//               {imgClass.name}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//       {/* <RecommendPostList
//         containerStyle={{
//           maxHeight:
//             SCREEN_HEIGHT - STATUS_BAR_HEIGHT - 44 - 40 - TAB_BAR_HEIGHT,
//           overflow: 'hidden',
//         }}
//       /> */}
//     </SafeAreaView>
//   );
// };

// export default index;

// const styles = StyleSheet.create({
//   container: {
//     height: '100%',
//     width: '100%',
//     backgroundColor: '#fff',
//   },
//   searchWrapper: {
//     zIndex: 1,
//     width: '100%',
//     height: 44,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   searchInput: {
//     height: '100%',

//     fontSize: 16,
//   },
//   labelWrapper: {
//     maxHeight: 40,
//   },
//   squareBtn: {
//     height: 44,
//     width: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   labelItem: {
//     flexDirection: 'row',
//     height: 28,
//     paddingHorizontal: 15,
//     backgroundColor: '#fff',
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   searchResultWrapper: {
//     height: SCREEN_HEIGHT - 44 - STATUS_BAR_HEIGHT - TAB_BAR_HEIGHT,
//     position: 'absolute',
//     top: 44,
//     left: 0,
//     width: '100%',
//   },
// });
