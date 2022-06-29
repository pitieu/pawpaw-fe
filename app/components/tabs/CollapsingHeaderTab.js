import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// api
import {listServices} from '../../store/actions/service';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import config from '../../config';

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

const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 0;

const OVERLAY_VISIBILITY_OFFSET = 0;

const Tab = createMaterialTopTabNavigator();

const Profile = props => {
  const {Header, Overlay, route} = props;
  const {bottom} = useSafeAreaInsets();
  const top = 0;
  //   console.log(top);
  const {height: screenHeight} = useWindowDimensions();

  const marketplaceRef = useRef(null);
  const petServicesRef = useRef(null);
  const socialFeedRef = useRef(null);

  const [petServices, setPetServices] = useState([]);
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

  useEffect(() => {
    if (tabIndex === 2) {
      //load pet services
      props.listServices().then(services => {
        const serv = [];
        services.forEach(service => {
          const primaryPhoto = service.photos?.find(
            photo => photo.primary === true,
          );
          console.log(
            config.api_address + 'services/images/' + primaryPhoto?.filename,
          );
          serv.push({
            id: service._id,
            name: service.name,
            photo: primaryPhoto?.filename
              ? config.api_address + 'services/images/' + primaryPhoto?.filename
              : '',
            price: service.products[0].price,
          });
        });
        // console.log('services', JSON.stringify(services));
        setPetServices(serv);
      });
    }
    // console.log('tabIndex', tabIndex);
  }, [tabIndex, route]);

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
        data={petServices}
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
        data={petServices}
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      listServices,
    },
    dispatch,
  );

export default memo(connect(null, mapDispatchToProps)(Profile));
