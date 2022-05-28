import React from 'react';

// import IcoMoon from 'react-icomoon';
// import iconSet from '../../assets/icomoon/selection.json';

// const Icon = props => <IcoMoon iconSet={iconSet} {...props} />;

// export default Icon;

import Icomoon from 'react-native-icomoon';
import json from '../../assets/icomoon/selection.json';

const Icon = ({name, ...restProps}) => (
  <Icomoon iconSet={json} name={name} {...restProps} />
);

export default Icon;
