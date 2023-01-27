import { useLoginMutation } from '@camp/data-layer';
import { Alert } from '@camp/design';
import { createResolver, toClientErrorMessage, userSchema } from '@camp/domain';
import { messages } from '@camp/messages';
import { AppRoute, useNavigate } from '@camp/router';
import {
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormInputs {
  username: string;
  password: string;
}

const resolver = createResolver<FormInputs>({
  username: userSchema.email(),
  password: userSchema.password(),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [login, mutationResult] = useLoginMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver,
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async ({ username, password }: FormInputs) => {
    try {
      setError(undefined);
      await login({ variables: { input: { username, password } } });
      navigate({ to: AppRoute.families, replace: true });
    } catch (err) {
      const clientError = toClientErrorMessage(err);
      setError(clientError);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={30} sx={{ width: 300 }}>
        <Stack spacing={10}>
          <Title order={3} color="fgMuted">
            {messages.login.loginFrom.title}
          </Title>
          <Text size="xs" color="fgMuted">
            {messages.login.loginFrom.description}
          </Text>
        </Stack>
        <Stack spacing={20}>
          <TextInput
            type="email"
            placeholder={messages.login.loginFrom.emailInput.placeholder}
            label={messages.login.loginFrom.emailInput.label}
            error={errors.username?.message}
            {...register('username')}
          />
          <PasswordInput
            placeholder={messages.login.loginFrom.passwordInput.placeholder}
            label={messages.login.loginFrom.passwordInput.label}
            error={errors.password?.message}
            {...register('password')}
          />
        </Stack>
        <Button type="submit" loading={mutationResult.loading}>
          {messages.login.loginFrom.submitButton.text}
        </Button>
        {error ? <Alert type="error" message={error} /> : null}
      </Stack>
    </form>
  );
};
