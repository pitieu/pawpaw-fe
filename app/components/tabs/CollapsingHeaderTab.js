import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {memo, useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, useWindowDimensions, Dimensions} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import TabBar from './TabBar';
import ConnectionList from './ConnectionList';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

var {width, height} = Dimensions.get('window');

const SOCIAL_FEED = [
  {
    id: 1,
    photo: '',
  },
  {
    id: 2,
    photo: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    photo: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 4,
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 5,
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: 6,
    photo: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 7,
    photo: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: 8,
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: 9,
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  {
    id: 10,
    photo: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: 11,
    photo: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: 12,
    photo: 'https://randomuser.me/api/portraits/men/7.jpg',
  },
  {
    id: 13,
    photo: 'https://randomuser.me/api/portraits/women/8.jpg',
  },
  {
    id: 14,
    photo: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: 15,
    photo: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: 16,
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: 17,
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
];
const PET_SERVICES = [
  {
    id: 1,
    name: 'Charlotte Jones',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    price: 100000,
    rating: 4.2,
    ratings: 88,
  },
  {
    id: 2,
    name: 'Oliver Brown',
    photo: '',
    price: 60000,
    rating: 3.2,
    ratings: 22,
  },
  {
    id: 3,
    name: 'Jessica Miller',
    photo: 'https://randomuser.me/api/portraits/women/3.jpg',
    price: 120000,
    rating: 4.5,
    ratings: 11,
  },
  {
    id: 4,
    name: 'Samuel Johnson',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    price: 100000,
    rating: 4.3,
    ratings: 44,
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    price: 30000,
    rating: 4.8,
    ratings: 3,
  },
  {
    id: 6,
    name: 'Joshua Miller',
    photo: 'https://randomuser.me/api/portraits/men/4.jpg',
    price: 1000000,
    rating: 5,
    ratings: 2,
  },
  {
    id: 7,
    name: 'Katie Williams',
    photo: 'https://randomuser.me/api/portraits/women/5.jpg',
    price: 50000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 8,
    name: 'Jack Jones',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    price: 50000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 9,
    name: 'Amy Johnson',
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
    price: 50000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 10,
    name: 'Thomas Williams',
    photo: 'https://randomuser.me/api/portraits/men/6.jpg',
    price: 50000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 11,
    name: 'Abigail Hernandez',
    photo: 'https://randomuser.me/api/portraits/women/7.jpg',
    price: 76000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 12,
    name: 'Matthew Taylor',
    photo: 'https://randomuser.me/api/portraits/men/7.jpg',
    price: 60000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 13,
    name: 'Poppy Jackson',
    photo: 'https://randomuser.me/api/portraits/women/8.jpg',
    price: 80000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 14,
    name: 'Mohammed Lopez',
    photo: 'https://randomuser.me/api/portraits/men/8.jpg',
    price: 50000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 15,
    name: 'Katie Williams',
    photo: 'https://randomuser.me/api/portraits/women/5.jpg',
    price: 70000,
    rating: 0,
    ratings: 0,
  },
  {
    id: 16,
    name: 'Jack Jones',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    price: 10000,
    rating: 3,
    ratings: 1,
  },
  {
    id: 17,
    name: 'Amy Johnson',
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
    price: 80000,
    rating: 0,
    ratings: 0,
  },
];

const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 0;

const OVERLAY_VISIBILITY_OFFSET = 0;

const Tab = createMaterialTopTabNavigator();

const Profile = ({Header, Overlay}) => {
  const {bottom} = useSafeAreaInsets();
  const top = 0;
  //   console.log(top);
  const {height: screenHeight} = useWindowDimensions();

  const marketplaceRef = useRef(null);
  const petServicesRef = useRef(null);
  const socialFeedRef = useRef(null);

  const [tabIndex, setTabIndex] = useState(0);

  const [headerHeight, setHeaderHeight] = useState(0);

  const defaultHeaderHeight = top + HEADER_HEIGHT;

  const headerConfig = useMemo(
    () => ({
      heightCollapsed: 0, // defaultHeaderHeight,
      heightExpanded: headerHeight,
    }),
    [defaultHeaderHeight, headerHeight],
  );

  const {heightCollapsed, heightExpanded} = headerConfig;

  const headerDiff = heightExpanded - heightCollapsed;

  const rendered = headerHeight > 0;

  const useScrollSync = (scrollPairs, headerConfig) => {
    const sync = event => {
      const {y} = event.nativeEvent.contentOffset;

      const {heightCollapsed, heightExpanded} = headerConfig;

      const headerDiff = heightExpanded - heightCollapsed;

      for (const {list, position} of scrollPairs) {
        const scrollPosition = position.value ?? 0;

        if (scrollPosition > headerDiff && y > headerDiff) {
          continue;
        }

        list.current?.scrollToOffset({
          offset: Math.min(y, headerDiff),
          animated: true,
        });
      }
    };

    return {sync};
  };
  const handleHeaderLayout = useCallback(
    event => setHeaderHeight(event.nativeEvent.layout.height),
    [],
  );

  const socialFeedScrollValue = useSharedValue(0);
  const socialFeedScrollHandler = useAnimatedScrollHandler(
    event => (socialFeedScrollValue.value = event.contentOffset.y),
  );

  const marketplaceScrollValue = useSharedValue(0);
  const marketplaceScrollHandler = useAnimatedScrollHandler(
    event => (marketplaceScrollValue.value = event.contentOffset.y),
  );

  const petServicesScrollValue = useSharedValue(0);
  const petServicesScrollHandler = useAnimatedScrollHandler(
    event => (petServicesScrollValue.value = event.contentOffset.y),
  );

  const scrollPairs = useMemo(
    () => [
      {list: socialFeedRef, position: socialFeedScrollValue},
      {list: marketplaceRef, position: marketplaceScrollValue},
      {list: petServicesRef, position: petServicesScrollValue},
    ],
    [
      marketplaceRef,
      marketplaceScrollValue,
      socialFeedRef,
      socialFeedScrollValue,
      petServicesRef,
      petServicesScrollValue,
    ],
  );

  const {sync} = useScrollSync(scrollPairs, headerConfig);

  const currentScrollValue = useDerivedValue(
    () =>
      tabIndex === 0
        ? marketplaceScrollValue.value
        : petServicesScrollValue.value,
    [tabIndex, marketplaceScrollValue, petServicesScrollValue],
  );

  const translateY = useDerivedValue(
    () => -Math.min(currentScrollValue.value, headerDiff),
  );

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    // opacity: interpolate(translateY.value, [-headerDiff, 0], [0, 1]),
  }));

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
      paddingBottom: bottom,
      flexDirection: 'column',
      width: '100%',
      minHeight: screenHeight + headerDiff,
    }),
    [rendered, headerHeight, bottom, screenHeight, headerDiff],
  );

  const sharedProps = useMemo(
    () => ({
      contentContainerStyle,
      onMomentumScrollEnd: sync,
      onScrollEndDrag: sync,
      scrollEventThrottle: 16,
      scrollIndicatorInsets: {top: heightExpanded},
    }),
    [contentContainerStyle, sync, heightExpanded],
  );

  const renderMarketplace = useCallback(
    () => (
      <ConnectionList
        ref={marketplaceRef}
        data={PET_SERVICES}
        dataType="marketplace"
        onScroll={marketplaceScrollHandler}
        {...sharedProps}
      />
    ),
    [marketplaceRef, marketplaceScrollHandler, sharedProps],
  );

  const renderSocialFeed = useCallback(
    () => (
      <ConnectionList
        ref={socialFeedRef}
        data={SOCIAL_FEED}
        typeList="image_grid"
        dataType="social_feed"
        onScroll={socialFeedScrollHandler}
        {...sharedProps}
      />
    ),
    [socialFeedRef, socialFeedScrollHandler, sharedProps],
  );

  const renderPerServices = useCallback(
    () => (
      <ConnectionList
        ref={petServicesRef}
        data={PET_SERVICES}
        dataType="pet_services"
        onScroll={petServicesScrollHandler}
        {...sharedProps}
      />
    ),
    [petServicesRef, petServicesScrollHandler, sharedProps],
  );

  const tabBarStyle = useMemo(
    () => [
      rendered ? styles.tabBarContainer : undefined,
      {top: rendered ? headerHeight : undefined},
      tabBarAnimatedStyle,
    ],
    [rendered, headerHeight, tabBarAnimatedStyle],
  );

  const renderTabBar = useCallback(
    props => (
      <Animated.View style={tabBarStyle}>
        <TabBar onIndexChange={setTabIndex} {...props} />
      </Animated.View>
    ),
    [tabBarStyle],
  );

  const headerContainerStyle = useMemo(
    () => [
      rendered ? styles.headerContainer : undefined,
      {
        paddingTop: top,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
      },
      headerAnimatedStyle,
    ],

    [rendered, top, headerAnimatedStyle],
  );

  const collapsedOverlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [-headerDiff, OVERLAY_VISIBILITY_OFFSET - headerDiff, 0],
      [1, 0, 0],
    ),
  }));

  const collapsedOverlayStyle = useMemo(
    () => [
      styles.collapsedOverlay,
      collapsedOverlayAnimatedStyle,
      {height: heightCollapsed, paddingTop: top},
    ],
    [collapsedOverlayAnimatedStyle, heightCollapsed, top],
  );

  return (
    <View style={styles.container}>
      <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
        {Header}
      </Animated.View>
      <Animated.View style={collapsedOverlayStyle}>{Overlay}</Animated.View>
      <Tab.Navigator tabBar={renderTabBar}>
        <Tab.Screen name="Social Feed">{renderSocialFeed}</Tab.Screen>
        <Tab.Screen name="Marketplace">{renderMarketplace}</Tab.Screen>
        <Tab.Screen name="Pet Services">{renderPerServices}</Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  tabBarContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 1,
  },
  overlayName: {
    fontSize: 24,
  },
  collapsedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    zIndex: 2,
  },
  headerContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 1,
  },
});

export default memo(Profile);
