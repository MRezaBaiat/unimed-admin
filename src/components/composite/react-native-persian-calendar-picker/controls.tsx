/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
import AppImageView from '../../base/app_image/AppImageView';

const React = require('react');

function Controls ({ styles, textStyles, label, onPressControl, icon }) {
  return (
    <div style={{ height: '100%' }} onClick={() => onPressControl()}>
      {/* <Text style={[styles, textStyles]}>{label}</Text> */}
      <AppImageView style={{ height: styles.height, width: styles.width }} src={icon} />
    </div>
  );
}

export default Controls;
