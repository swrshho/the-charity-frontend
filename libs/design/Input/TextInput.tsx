import type { TextInputProps } from '@mantine/core';
import { createStyles, TextInput as MantineTextInput } from '@mantine/core';
import { forwardRef } from 'react';

import { useReadonlyInputStyles } from './useReadonlyInputStyles';

const useStyles = createStyles(_ => ({
  textInput: {
    input: {
      ':placeholder-shown': {
        cursor: 'default',
      },
      '::placeholder': {
        opacity: 0,
      },
    },
  },
}));

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', ...rest }: TextInputProps, ref) => {
    const { classes } = useStyles();
    const {
      classes: { readonlyInput: readonlyInputClass },
    } = useReadonlyInputStyles();

    return (
      <MantineTextInput
        ref={ref}
        {...rest}
        className={`${readonlyInputClass} ${classes.textInput} ${className}`}
      />
    );
  },
);
