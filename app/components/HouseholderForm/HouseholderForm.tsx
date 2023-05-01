import {
  useHouseholderQuery,
  useUpsertHouseholderMutation,
} from '@camp/data-layer';
import {
  ControlledSelect,
  FullPageLoader,
  showNotification,
  TextInput,
} from '@camp/design';
import type {
  City,
  Gender,
  Householder,
  Nationality,
  Religion,
} from '@camp/domain';
import {
  cities,
  createResolver,
  genders,
  householderSchema,
  nationalities,
  religions,
} from '@camp/domain';
import { CalendarIcon, CheckIcon } from '@camp/icons';
import { messages } from '@camp/messages';
import { createTestAttr } from '@camp/test';
import { isNull } from '@fullstacksjs/toolbox';
import {
  Button,
  createStyles,
  Group,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core';
import { DateInput } from 'mantine-datepicker-jalali';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { householderFormIds as ids } from './HouseholderForm.ids';

interface Props {
  initialHouseholder?: Householder;
  familyId: string;
}

interface FormSchema {
  name: string;
  surname: string;
  fatherName: string;
  nationalId: string;
  dob: Date;
  gender: Gender;
  nationality: Nationality;
  religion: Religion;
  cityOfBirth: City;
  issuedAt: City;
}

const resolver = createResolver<FormSchema>({
  name: householderSchema.name(),
  surname: householderSchema.surname(),
  fatherName: householderSchema.fatherName(),
  nationalId: householderSchema.nationalId(),
  gender: householderSchema.gender(),
  nationality: householderSchema.nationality(),
  religion: householderSchema.religion(),
  cityOfBirth: householderSchema.cityOfBirth(),
  issuedAt: householderSchema.issuedAt(),
  dob: householderSchema.dob(),
});

const useStyles = createStyles(theme => ({
  dateInput: {
    label: {
      color: theme.colors.fgSubtle[6],
    },
  },
}));

// eslint-disable-next-line max-lines-per-function
export const HouseholderForm = ({ initialHouseholder, familyId }: Props) => {
  const t = messages.householder.form;
  const { classes } = useStyles();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid, isDirty },
    control,
  } = useForm<FormSchema>({
    resolver,
    defaultValues: initialHouseholder,
    mode: 'onChange',
  });

  const isReadOnly = initialHouseholder?.status === 'completed';

  const [upsertHouseholder] = useUpsertHouseholderMutation();

  const onSubmit = handleSubmit(formData => {
    upsertHouseholder({
      variables: { ...formData, familyId },
    })
      .then(({ data: d }) => {
        if (!isNull(d)) reset(d.householder);
        showNotification({
          title: t.title,
          message: t.notification.successfulUpdate(d?.householder.name ?? ''),
          type: 'success',
          ...createTestAttr(ids.notification.success),
        });
      })
      .catch(() =>
        showNotification({
          title: t.title,
          message: t.notification.failedUpdate(formData.name),
          type: 'failure',
          ...createTestAttr(ids.notification.failure),
        }),
      );
  });

  return (
    <form onSubmit={onSubmit} {...createTestAttr(ids.form)}>
      <Stack spacing={25}>
        <Group position="apart" mih="100%">
          <Title order={4} color="fgMuted" weight="bold">
            {t.title}
          </Title>
          <Group spacing={20}>
            <Button
              {...createTestAttr(ids.undoBtn)}
              size="sm"
              variant="outline"
              color="red"
              disabled={!isDirty}
              onClick={() => reset()}
            >
              {t.undoBtn}
            </Button>
            <Button
              {...createTestAttr(ids.submitBtn)}
              type="submit"
              size="sm"
              leftIcon={<CheckIcon size={16} />}
              disabled={!isValid || !isDirty}
            >
              {t.submitBtn}
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={3} spacing="lg" verticalSpacing={20}>
          <TextInput
            readOnly={isReadOnly}
            wrapperProps={createTestAttr(ids.firstNameInput)}
            {...register('name')}
            label={`${t.nameInput.label}:`}
            placeholder={t.nameInput.placeholder}
            error={errors.name?.message}
          />
          <TextInput
            readOnly={isReadOnly}
            wrapperProps={createTestAttr(ids.lastNameInput)}
            {...register('surname')}
            label={`${t.lastNameInput.label}:`}
            error={errors.surname?.message}
            placeholder={t.lastNameInput.placeholder}
          />
          <TextInput
            readOnly={isReadOnly}
            wrapperProps={createTestAttr(ids.fatherNameInput)}
            {...register('fatherName')}
            label={`${t.fatherNameInput.label}:`}
            placeholder={t.fatherNameInput.placeholder}
            error={errors.fatherName?.message}
          />
          <ControlledSelect
            readOnly={isReadOnly}
            name="nationality"
            control={control}
            clearable
            wrapperProps={createTestAttr(ids.nationalityInput)}
            data={nationalities.map(v => ({
              value: v,
              label: messages.nationalities[v],
            }))}
            placeholder={t.selectInputs.placeholder}
            label={`${t.nationalityInput.label}:`}
          />
          <TextInput
            readOnly={isReadOnly}
            wrapperProps={createTestAttr(ids.nationalIdInput)}
            error={errors.nationalId?.message}
            {...register('nationalId')}
            placeholder={t.nationalIdInput.placeholder}
            label={`${t.nationalIdInput.label}:`}
          />

          <ControlledSelect
            readOnly={isReadOnly}
            name="gender"
            control={control}
            clearable
            wrapperProps={createTestAttr(ids.genderInput)}
            data={genders.map(v => ({
              value: v,
              label: messages.genders[v],
            }))}
            label={`${t.genderInput.label}:`}
            placeholder={t.selectInputs.placeholder}
          />

          <ControlledSelect
            readOnly={isReadOnly}
            name="issuedAt"
            control={control}
            clearable
            wrapperProps={createTestAttr(ids.issuedAtInput)}
            data={cities.map(v => ({
              value: v,
              label: messages.cities[v],
            }))}
            placeholder={t.selectInputs.placeholder}
            label={`${t.issuedAtInput.label}:`}
          />

          <ControlledSelect
            readOnly={isReadOnly}
            name="religion"
            control={control}
            clearable
            wrapperProps={createTestAttr(ids.religionInput)}
            data={religions.map(v => ({
              value: v,
              label: messages.religions[v],
            }))}
            placeholder={t.selectInputs.placeholder}
            label={`${t.religionInput.label}:`}
          />

          <ControlledSelect
            readOnly={isReadOnly}
            name="cityOfBirth"
            control={control}
            clearable
            wrapperProps={createTestAttr(ids.cityOfBirthInput)}
            data={cities.map(v => ({
              value: v,
              label: messages.cities[v],
            }))}
            placeholder={t.selectInputs.placeholder}
            label={`${t.cityOfBirthInput.label}:`}
          />

          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <DateInput
                clearable
                wrapperProps={createTestAttr(ids.dobInput)}
                className={classes.dateInput}
                rightSection={<CalendarIcon stroke="currentColor" size={16} />}
                label={`${t.dobInput.label}:`}
                sx={theme => ({
                  direction: 'ltr',
                  color: theme.colors.secondaryDefault[6],
                })}
                locale="fa"
                placeholder={t.selectInputs.placeholder}
                error={errors.dob?.message}
                {...field}
              />
            )}
          />
        </SimpleGrid>
      </Stack>
    </form>
  );
};
