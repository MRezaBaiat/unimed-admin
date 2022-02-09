// @ts-nocheck
/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

import React from 'react';
import Utils from './utils';
import Controls from './controls';
import { leftArrowIcon, rightArrowIcon } from '../../../assets/images';
import AppTextView from '../../base/app_text/AppTextView';

function HeaderControls (props) {
  const {
    styles,
    currentMonth,
    currentYear,
    onPressNext,
    onPressPrevious,
    months,
    previousTitle,
    nextTitle,
    textStyle,
    headingLevel
  } = props;
  const MONTHS = months || Utils.MONTHS; // English Month Array
  // getMonth() call below will return the month number, we will use it as the
  // index for month array in english
  const previous = previousTitle || '>';
  const next = nextTitle || '<';
  const month = MONTHS[currentMonth];
  const year = currentYear;

  /* const accessibilityProps = { accessibilityRole: 'header' };
  accessibilityProps['aria-level'] = headingLevel; */

  return (
    <div style={{
      alignItems: 'center',
      flexDirection: 'row-reverse',
      alignSelf: 'center',

      justifyContent: 'space-between',
      width: '88%'
    }}>
      <Controls
        // label={previous}
        icon={rightArrowIcon}
        onPressControl={onPressPrevious}
        styles={{ ...styles.monthSelector, ...styles.prev, marginBottom: 10, width: 25, height: 25 }}
        textStyles={textStyle}
      />

      <div>
        <AppTextView
          text={`${month} ${year}`}
          style={{ ...styles.monthLabel, ...{ fontSize: 15, color: '#38488A' } }}/>
      </div>

      <Controls
        // label={next}
        icon={leftArrowIcon}
        onPressControl={onPressNext}
        styles={{ ...styles.monthSelector, ...styles.next, marginBottom: 10, width: 25, height: 25 }}
        textStyles={textStyle}
      />
    </div>
  );
}

export default HeaderControls;
