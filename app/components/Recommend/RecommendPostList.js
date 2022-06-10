// import React, {useState, useEffect, useMemo} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   StyleProp,
//   ViewProps,
//   ViewStyle,
//   FlatList,
//   Animated,
// } from 'react-native';
// import RecommendItem from './RecommendItem';
// import {store} from '../../store';
// import {Post} from '../../reducers/postReducer';

// const RecommendPostList = ({containerStyle, ...rest}) => {
//   const [loading, setLoading] = useState(true);
//   const [reloading, setReloading] = useState(false);
//   const [enjoyLabels, setEnjoyLabels] = useState([]);
//   const [diffMonth, setDiffMonth] = useState(6);
//   const [reactedPosts, setReactedPosts] = useState([]);
//   const [recommendPosts, setRecommendPosts] = useState([]);
//   const [limit, setLimit] = useState(21);
//   const _loadingAnim = useMemo(() => new Animated.Value(0), []);
//   useEffect(() => {
//     getRecommendLabels(diffMonth).then(({labels, reactedPostUids}) => {
//       setEnjoyLabels(labels);
//       setReactedPosts(reactedPostUids);
//     });
//   }, [diffMonth]);
//   const fetchRecommendPosts = () => {
//     return new Promise(async (resolve, reject) => {
//       //   const myUsername = `${store.getState().user.user.userInfo?.username}`;
//       //   const currentBlockedList =
//       //     store.getState().user.setting?.privacy?.blockedAccounts
//       //       ?.blockedAccounts || [];
//       //   const userRef = firestore().collection('users');
//       //   const blockMe = await userRef
//       //     .where(
//       //       'privacySetting.blockedAccounts.blockedAccounts',
//       //       'array-contains',
//       //       myUsername,
//       //     )
//       //     .get();
//       //   const blockedMeList = blockMe.docs.map(x => x.data().username);
//       //   const postRef = firestore().collection('posts');
//       //   const tasks = enjoyLabels.map(async label => {
//       //     const post = await postRef
//       //       .orderBy('create_at', 'desc')
//       //       .where('labels', 'array-contains', label)
//       //       .get();
//       //     return post.docs.map(x => ({
//       //       ...x.data(),
//       //       className: label,
//       //     }));
//       //   });
//       //   Promise.all(tasks).then(nestedPostList => {
//       //     const collection = [];
//       //     nestedPostList.map(posts => posts.map(post => collection.push(post)));
//       //     const finalRecomendList = collection.filter(
//       //       x =>
//       //         currentBlockedList.indexOf(`${x.userId}`) < 0 &&
//       //         blockedMeList.indexOf(`${x.userId}`) < 0 &&
//       //         x.userId !== myUsername,
//       //     );
//       //     resolve(finalRecomendList);
//       //   });
//       const finalRecomendList = [
//         {
//           source: 'https://images.dog.ceo/breeds/redbone/n02090379_433.jpg',
//           className: 'label1',
//         },
//       ];
//       resolve(finalRecomendList);
//     });
//   };
//   useEffect(() => {
//     //Fetch recommend posts
//     if (enjoyLabels.length > 0) {
//       fetchRecommendPosts().then(recommends => {
//         setRecommendPosts(recommends);
//         setLoading(false);
//       });
//     }
//   }, [enjoyLabels, limit]);
//   const _onAnimation = () => {
//     _loadingAnim.setValue(0);
//     Animated.loop(
//       Animated.timing(_loadingAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//         duration: 1000,
//       }),
//       {iterations: 10},
//     ).start();
//   };
//   const _onRefresh = async () => {
//     setReloading(true);
//     const recommends = await fetchRecommendPosts();
//     setRecommendPosts([...recommends]);
//     setReloading(false);
//   };
//   const _onScrollToEnd = () => {
//     setLimit(limit + 12);
//   };
//   return (
//     <View style={[styles.container, containerStyle]}>
//       {!loading && (
//         <FlatList
//           style={{
//             height: '100%',
//           }}
//           refreshing={reloading}
//           onRefresh={_onRefresh}
//           numColumns={3}
//           data={recommendPosts}
//           renderItem={({item, index}) => (
//             <RecommendItem {...{item, index, showClassMask: true}} />
//           )}
//           keyExtractor={item => `${item.uid}`}
//           onEndReached={_onScrollToEnd}
//           onEndReachedThreshold={0.5}
//         />
//       )}
//       {loading && (
//         <View
//           style={{
//             width: '100%',
//             height: '100%',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Animated.View
//             onLayout={_onAnimation}
//             style={{
//               ...styles.loadingIcon,
//               transform: [
//                 {
//                   rotate: _loadingAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: ['0deg', '360deg'],
//                     extrapolate: 'clamp',
//                   }),
//                 },
//               ],
//             }}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// export default RecommendPostList;

// const styles = StyleSheet.create({
//   container: {},
//   loadingIcon: {
//     borderRadius: 64,
//     height: 64,
//     width: 64,
//     borderColor: '#000',
//     borderWidth: 4,
//     borderStyle: 'dashed',
//   },
// });

// export async function getRecommendLabels(diffMonth) {
//   // const myUsername = `${store.getState().user.user.userInfo?.username}`
//   // const currentBlockedList = store.getState().user
//   //     .setting?.privacy?.blockedAccounts?.blockedAccounts || []
//   // const userRef = firestore().collection('users')
//   // const blockMe = await userRef
//   //     .where('privacySetting.blockedAccounts.blockedAccounts',
//   //         'array-contains', myUsername)
//   //     .get()
//   // const blockedMeList = blockMe.docs.map(x => x.data().username)
//   // const currentTime = new Date().getTime()
//   // const from = currentTime - 3600 * 1000 * 24 * diffMonth * 30
//   // const postRef = firestore().collection('posts')
//   // const posts = await postRef.where('create_at', '>=', new Date(from))
//   //     .where('likes', 'array-contains', myUsername)
//   //     .orderBy('create_at', 'desc').get()
//   // const reactedPosts = posts.docs.map(x => x.data() as Post)
//   //     .filter(x => currentBlockedList.indexOf(`${x.userId}`) < 0
//   //         && blockedMeList.indexOf(`${x.userId}`) < 0
//   //         && x.userId !== myUsername
//   //     )
//   // const posts2 = await postRef.where('create_at', '>=', new Date(from))
//   //     .where('commentList', 'array-contains', myUsername)
//   //     .orderBy('create_at', 'desc').get()
//   // posts2.docs.map(x => x.data() as Post)
//   //     .filter(x => currentBlockedList.indexOf(`${x.userId}`) < 0
//   //         && blockedMeList.indexOf(`${x.userId}`) < 0
//   //         && x.userId !== myUsername
//   //     ).map(post => {
//   //         if (!!!reactedPosts.find(x => x.uid === post.uid)) {
//   //             reactedPosts.push(post)
//   //         }
//   //     })
//   // const labels = []
//   // reactedPosts.map(post => {
//   //     post.labels?.map(label => labels.indexOf(label) < 0 && labels.push(label))
//   // })
//   // return {
//   //     reactedPostUids: reactedPosts.map(x => x.uid as number),
//   //     labels
//   // }
//   return {
//     reactedPostUids: [1, 2, 3, 4, 5, 6, 7],
//     labels: ['label1', 'label2', 'label3'],
//   };
// }
