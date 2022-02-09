// @ts-nocheck
import React from 'react';

interface Props{
  text?: string,
  textColor?: string,
  type?: 'big' | 'medium' | 'small',
  fontSize?: number,
  innerHtml?: string,
  english?: boolean
}
function AppTextView (props: Props) {
  if (Array.isArray(props.style)) {
    throw new Error('style can not be array');
  }
  const { text, textColor, type, fontSize, style, innerHtml, english } = props;
  return (
    <text {...props} style={Object.assign({ color: textColor, fontSize: modeToFontsize(type, fontSize), fontFamily: !english && 'subtitle-font' }, style) } dangerouslySetInnerHTML={innerHtml}>
      {
        !innerHtml && text
      }
    </text>
  );
}

function modeToFontsize (type: 'big' | 'medium' | 'small', fontSize) {
  if (fontSize) {
    return fontSize;
  }
  switch (type) {
    case 'big':
      return 30;
    case 'medium':
      return 25;
    case 'small':
      return 20;
  }
}

AppTextView.defaultProps = {
  mode: 'small'
};

export default React.memo(AppTextView);
