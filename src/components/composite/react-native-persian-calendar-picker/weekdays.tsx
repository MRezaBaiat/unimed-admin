// @ts-nocheck
/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

import React from 'react';
import Utils from './utils';
import AppTextView from '../../base/app_text/AppTextView';

function Weekdays (props) {
  const { styles, startFromMonday, weekdays, textStyle } = props;
  let wd = weekdays;
  if (!wd) {
    wd = startFromMonday ? Utils.WEEKDAYS_MON : Utils.WEEKDAYS; // English Week days Array
  }

  return (
    <div style={styles.dayLabelsWrapper}>
      {wd.map((day, key) => {
        return (
          <AppTextView key={key} style={{ ...styles.dayLabels, ...{ fontSize: 15, color: '#38488A', textAlign: 'center' } }} text={day}/>
        );
      })
      }
    </div>
  );
}

export default Weekdays;
