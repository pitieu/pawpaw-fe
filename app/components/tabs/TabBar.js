import {MaterialTopTabBar} from '@react-navigation/material-top-tabs';
import React, {useEffect} from 'react';

const TabBar = ({onIndexChange, ...props}) => {
  const {index} = props.state;

  useEffect(() => {
    onIndexChange?.(index);
  }, [onIndexChange, index]);

  return <MaterialTopTabBar {...props} />;
};

export default TabBar;
