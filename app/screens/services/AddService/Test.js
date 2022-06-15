import {useIsFocused} from '@react-navigation/native';
import React, {useRef, useState, useMemo, useEffect} from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';

import CameraTaker from '../../../components/camera/cameraGallerySelector';

const StoryTaker = ({route, navigation, openGallery = false}) => {
  return (
    <CameraTaker cameraTakerStyle={styles.cameraTaker} openGallery={false} />
  );
};
export default StoryTaker;

const styles = StyleSheet.create({});
