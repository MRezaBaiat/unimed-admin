// @ts-nocheck
/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
import React from 'react';

function EmptyDay (props) {
  const { styles } = props;
  return (
    <div style={styles.dayWrapper}>
      <div style={styles.dayButton} />
    </div>
  );
}

export default EmptyDay;
