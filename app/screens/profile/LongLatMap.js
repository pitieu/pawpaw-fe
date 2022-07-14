import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {t} from 'i18next';
import {Skeleton} from '@rneui/themed';

// components
import Button from '../../components/buttons/Button';
import NavigationBar from '../../components/NavigationBar';

// import colors
import Colors from '../../theme/colors';

navigator.geolocation = Geolocation;

const LongLatMap = props => {
  const {route} = props;
  const navigation = useNavigation();

  const addressComponent = useRef(null);
  const mapComponent = useRef(null);
  const snapPointsAddress = useMemo(() => ['30%', '90%'], []);

  const [marker, setMarker] = useState({
    latitude: '-8.827726785118717',
    longitude: '115.15679810196161',
    longitudeDelta: '0.0121',
    latitudeDelta: '0.015',
  });

  const [inputFocused, setInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
        setIsLoading(false);
        setMarker({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
        // let camera = await mapComponent.current.getCamera();
        // camera.center.latitude = position.coords.latitude;
        // camera.center.longitude = position.coords.longitude;
        // camera.center.zoom = 14;
        // await mapComponent.current.animateCamera(camera);
        setTimeout(() => {
          mapComponent.current.animateToRegion({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            longitudeDelta: '0.0121',
            latitudeDelta: '0.015',
          });
        }, 10);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const showBottomSheet = useCallback(index => {
    addressComponent.current?.snapToIndex(index);
  }, []);

  const regionChange = useCallback(async region => {
    setMarker(() => ({
      latitude: region.latitude,
      longitude: region.longitude,
    }));
    let camera = await mapComponent.current.getCamera();
    camera.center.latitude = region.latitude;
    camera.center.longitude = region.longitude;
    await mapComponent.current.animateCamera(camera);
  }, []);

  const handleSheetChanges = useCallback(index => {
    if (index == 0) {
      Keyboard.dismiss();
    }
  }, []);

  const autocompletePressed = (data, details = null) => {
    showBottomSheet(0);
    if (details.geometry.location.lat && details.geometry.location.lng)
      regionChange({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        longitudeDelta: '0.0121',
        latitudeDelta: '0.015',
      });
  };

  const setLocation = useCallback(() => {
    // set location
    navigation.navigate(props.params.parentScreen, {
      params: {
        longitude: marker.longitude,
        latitude: marker.latitude,
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      {!isLoading && (
        <MapView
          ref={mapComponent}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            longitude: '115.15679810196161',
            latitude: '-8.827726785118717',
            longitudeDelta: '0.0121',
            latitudeDelta: '0.015',
          }}
          onPress={(coordinate, point) => {
            regionChange(coordinate.nativeEvent.coordinate);
          }}
          onPoiClick={(coordinate, point) => {
            regionChange(coordinate.nativeEvent.coordinate);
          }}
          loadingEnabled>
          <Marker coordinate={marker} />
        </MapView>
      )}
      <NavigationBar navigationStyle={{backgroundColor: 'transparent'}} />
      <BottomSheet
        style={styles.bottomSheet}
        ref={addressComponent}
        snapPoints={snapPointsAddress}
        onChange={handleSheetChanges}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        index={0}>
        <BottomSheetView style={{flex: 1}}>
          {isLoading && (
            <View style={{paddingHorizontal: 15}}>
              <Skeleton
                width={'100%'}
                height={30}
                animation="wave"
                style={[styles.skeleton, {marginTop: 10, marginBottom: 30}]}
                skeletonStyle={styles.skeletonStyle}
              />

              <Skeleton
                width={'100%'}
                height={50}
                animation="wave"
                style={styles.skeleton}
                skeletonStyle={styles.skeletonStyle}
              />
            </View>
          )}
          {!isLoading && (
            <View style={styles.autocompleteContainer}>
              <GooglePlacesAutocomplete
                placeholder={t('autocomplete_placeholder')}
                textInputProps={{
                  onFocus: () => {
                    setInputFocused(true);
                    showBottomSheet(1);
                  },
                  onBlur: () => {
                    setInputFocused(false);
                    showBottomSheet(0);
                    Keyboard.dismiss();
                  },
                }}
                fetchDetails={true}
                onPress={autocompletePressed}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                }}
                returnKeyType={'search'}
                query={{
                  key: 'AIzaSyAfmNOp-Rdw9v6y_1jaoGXwlVDuP3yyXY0',
                  language: 'en', // todo adjust language accordingly
                  components: 'country:id', // todo adjust country eventually accordingly
                  radius: 30000, // 30km radius
                  location: `${marker.latitude},${marker.longitude}`,
                }}
                renderDescription={row =>
                  row.description || row.structured_formatting || row.name
                }
                currentLocation={true}
                currentLocationLabel={t('current_location')}
                styles={styles.autocomplete}
                debounce={300}
              />
              {!inputFocused && (
                <Button
                  buttonStyle={{marginTop: 30, borderRadius: 5}}
                  color={Colors.primaryColor}
                  rounded
                  borderRadius
                  disabled={isLoading}
                  onPress={setLocation}
                  title={t('select_location').toUpperCase()}
                  titleColor={Colors.onPrimaryColor}
                />
              )}
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  autocompleteContainer: {
    flex: 1,
    padding: 15,
    flexDirection: 'column',
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,

    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  autocomplete: {
    container: {
      flex: 0,
      width: '100%',
      zIndex: 1,
    },
    textInput: {
      backgroundColor: Colors.lightGray,
    },
  },
  skeleton: {
    marginBottom: 10,
    backgroundColor: Colors.lightGray,
  },
  skeletonStyle: {
    backgroundColor: Colors.lighterGray,
  },
});

export default memo(LongLatMap);
