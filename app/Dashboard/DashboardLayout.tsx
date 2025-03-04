import { Outlet } from '@camp/router';
import {
  AppShell as MantineAppShell,
  createStyles,
  MediaQuery,
  Stack,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { DashboardSidebar } from './_components/DashboardSidebar';

const useStyles = createStyles(theme => ({
  body: {
    height: '100vh',
  },
  main: {
    paddingTop: 30,
    paddingBottom: 0,
    paddingInline: 40,
    backgroundColor: theme.colors.bgCanvas[6],
    overflow: 'auto',
  },
}));

const outlet = <Outlet />;

export const DashboardLayout = ({ children = outlet }) => {
  const { classes } = useStyles();

  return (
    <ModalsProvider>
      <MantineAppShell
        classNames={{ body: classes.body, main: classes.main }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <DashboardSidebar />
          </MediaQuery>
        }
      >
        <Stack sx={{ gap: '40px', minHeight: '100%' }}>{children}</Stack>
        <Notifications limit={3} />
      </MantineAppShell>
    </ModalsProvider>
  );
};
