import 'dayjs/locale/fa';
import '../libs/monkeyPatchZod';
import { Notifications } from '@mantine/notifications';
import { Decorator, Parameters, Preview } from '@storybook/react';
import {
  createMemoryHistory,
  ReactLocation,
  Router,
} from '@tanstack/react-location';
import React from 'react';
import { ThemeProvider } from '../libs/design';
import { apolloMocks } from './apolloMocks';

const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: apolloMocks,
};

const decorators: Decorator[] = [
  (Story, { args }) => {
    const router = args.router as any;
    const { layout, ...routes } = args.router ?? {} as any;
    const Layout = layout ?? React.Fragment;
    const location = new ReactLocation({
      history: createMemoryHistory({ initialEntries: [router?.route ?? '/'] }),
    });

    return router ? (
      <Router routes={[routes]} location={location}>
        <Layout>
          <Story />
        </Layout>
      </Router>
    ) : (
      <Router routes={[]} location={location}>
        <Story />
      </Router>
    );
  },
  Story => (
    <ThemeProvider>
      <Notifications limit={3} />
      <Story />
    </ThemeProvider>
  ),
];

const preview: Preview = {
  parameters,
  decorators,
};

export default preview;
