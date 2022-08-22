// import dependencies
import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {t} from 'i18next';
import {debounce} from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Skeleton} from '@rneui/themed';
import Icon from 'react-native-vector-icons/dist/Ionicons';

// import components
import NavigationBar from '../../components/NavigationBar';

// api
import {searchAddress} from '../../store/actions/user';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import Divider from '../../components/divider/Divider';
import {element} from 'prop-types';

const MIN_CHARS = 3;
var timeout;
const AddressList = props => {
  const {onSelect, onClose} = props;

  const navigation = useNavigation();

  const searchComponent = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState();
  const [cities, setCities] = useState([]);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  useEffect(() => {
    if (search?.length > MIN_CHARS) {
      setIsLoading(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleChange(search);
      }, 500);
    }
  }, [search]);

  async function handleChange(_search) {
    const addresses = await props.searchAddress(_search);
    setCities(addresses);
    setIsLoading(false);
  }

  const renderSkeleton = useMemo(() => {
    const randomWidth = () => {
      return Math.round(Math.random() * 200) + 80;
    };
    const elements = [];
    for (let i = 1; i <= 15; i++) {
      elements.push(
        <View key={i}>
          <Skeleton
            animation="wave"
            width={randomWidth()}
            height={20}
            style={styles.skeleton}
            skeletonStyle={styles.skeletonStyle}
          />
          <Divider />
        </View>,
      );
    }
    return elements;
  }, []);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar title={t('select_city_title')} />
      <View style={styles.inputContainer}>
        <TextInput
          ref={searchComponent}
          onSubmitEditing={() => {}}
          value={search}
          placeholder={t('input_search_city_placeholder', {chars: MIN_CHARS})}
          onChangeText={setSearch}
          returnKeyType={'next'}
          style={styles.inputField}
        />
        <TouchableOpacity
          onPress={() => {
            setSearch('');
            setCities([]);
          }}
          style={{position: 'absolute', right: 30, top: 13}}>
          <Icon name={'close-circle'} size={20} color={Colors.gray} />
        </TouchableOpacity>
      </View>
      {isLoading == true && renderSkeleton}
      {!isLoading && cities?.length > 0 && (
        <FlatList
          keyExtractor={keyExtractor}
          // style={{}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() =>
                  navigateTo('Address', {city: item?.searchField})
                }>
                <Text>{`${item?.searchField}`}</Text>
              </TouchableOpacity>
            );
          }}
          data={cities}
        />
      )}
      {!isLoading && cities?.length == 0 && search?.length > MIN_CHARS && (
        <View
          style={{
            height: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 16}}>{t('cities_not_found')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    margin: 15,
    backgroundColor: Colors.lightGray,
  },
  skeletonStyle: {
    backgroundColor: Colors.lighterGray,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  address: {},
  inputContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
  inputField: {
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  listItemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      searchAddress,
    },
    dispatch,
  );

export default memo(connect(null, mapDispatchToProps)(AddressList));
