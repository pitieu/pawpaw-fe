import React, {forwardRef, memo, useCallback} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import ConnectionItem from './ConnectionItem';
import ConnectionImageItem from './ConnectionImageItem';

export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ConnectionList = forwardRef((props, ref) => {
  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const {typeList, dataType} = props;

  const renderItem = useCallback(
    ({item}) => <ConnectionItem connection={item} dataType={dataType} />,
    [],
  );

  const renderImageItem = useCallback(
    ({item}) => <ConnectionImageItem connection={item} dataType={dataType} />,
    [],
  );

  const render = () => {
    if (typeList == 'image_grid') {
      return {render: renderImageItem, style: styles.container2, cols: 3};
    }
    return {render: renderItem, style: styles.container, cols: 1};
  };

  return (
    <AnimatedFlatList
      ref={ref}
      style={render().style}
      numColumns={render().cols}
      renderItem={render().render}
      keyExtractor={keyExtractor}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
  },
  container2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    flex: 1,
  },
});

export default memo(ConnectionList);
