import React, {memo, useState, useCallback} from 'react';
import {withTranslation} from 'react-i18next';
import {Text, StyleSheet, View} from 'react-native';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const ViewMoreText = ({t, lines = 4, text}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= lines); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : lines}
        style={{lineHeight: 21}}>
        {text}
      </Text>

      {lengthMore ? (
        <Text onPress={toggleNumberOfLines} style={styles.viewMoreText}>
          {textShown ? t('read_less') : t('read_more')}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  viewMoreText: {
    lineHeight: 21,
    marginTop: 10,
    color: Colors.primaryColor,
  },
  productDetailSection: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderTopColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  title: {
    paddingBottom: Layout.SMALL_PADDING,
  },
});

export default memo(withTranslation()(ViewMoreText));
