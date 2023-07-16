import type { Meta, StoryObj } from '@storybook/react';

import { Table } from './Table';

export default {
  component: Table,
} as Meta<typeof Table>;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: ({ ...args }) => <Table {...args} id="table" />,
};
