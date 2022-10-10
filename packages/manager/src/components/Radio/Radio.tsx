/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import { css } from '@patternfly/react-styles';
import { RadioProps, Split, SplitItem, Radio } from '@patternfly/react-core';

import style from './radio.module.css';

type CustomRadioContainerProps = {
  children: ReactNode;
};

export const CustomRadioContainer = ({ children }: CustomRadioContainerProps): JSX.Element => (
  <Split className={style['radio-container']}>{children}</Split>
);

type CustomRadioBtnProps = {
  isSelected?: boolean;
} & RadioProps;

export const CustomRadio = ({ isSelected, ...props }: CustomRadioBtnProps): JSX.Element => (
  <SplitItem isFilled className={css(style['radio-selector'], { [style.selected]: isSelected })}>
    <Radio {...(props as any)} />
  </SplitItem>
);

CustomRadio.defaultProps = {
  isSelected: false
};
