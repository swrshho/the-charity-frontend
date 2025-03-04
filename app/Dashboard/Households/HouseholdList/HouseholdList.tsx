import { useHouseholdListQuery } from '@camp/data-layer';
import {
  DashboardCard,
  DashboardTitle,
  FullPageLoader,
  showNotification,
} from '@camp/design';
import { householdColumnHelper } from '@camp/domain';
import { errorMessages, messages } from '@camp/messages';
import { AppRoute } from '@camp/router';
import { createTestAttr } from '@camp/test';
import { isEmpty, isNull } from '@fullstacksjs/toolbox';
import { Group } from '@mantine/core';
import type { SortingState } from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

import { InformationBadge } from '../../_components/InformationBadge';
import { SeverityBadge } from '../../_components/SeverityBadge';
import { CreateHouseholdButton } from '../_components/CreateHousehold';
import { HouseholdActionButton } from '../_components/HouseholdActionButton';
import { HouseholdEmptyState } from '../HouseholdEmptyState';
import * as ids from './HouseholdList.ids';
import { HouseholdTable } from './HouseholdTable';
import { householdActionIds as actionIds } from './HouseholdTableRow.ids';

const t = messages.households.list;

const columns = [
  householdColumnHelper.display({
    header: t.table.columns.order,
    cell: order => order.row.index + 1,
  }),
  householdColumnHelper.accessor('name', {
    header: t.table.columns.name,
    cell: name => name.getValue(),
  }),
  householdColumnHelper.accessor('isCompleted', {
    id: 'status',
    header: t.table.columns.status,
    cell: status => (
      <InformationBadge status={status.getValue() ? 'completed' : 'draft'} />
    ),
  }),
  householdColumnHelper.accessor('severity', {
    header: t.table.columns.severity,
    enableSorting: true,
    cell: props => (
      <Group position="apart">
        <SeverityBadge severity={props.getValue()} />
        <HouseholdActionButton
          to={AppRoute.householdDetail}
          params={{ id: props.row.original.id }}
          householdId={props.row.original.id}
          householdName={props.row.original.name}
          menuButtonId={actionIds.actionButton}
          menuId={actionIds.actionMenu}
        />
      </Group>
    ),
  }),
];

const empty: any[] = [];

export const HouseholdList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, loading, error } = useHouseholdListQuery({
    variables: { orderBy: sorting },
  });
  const households = data?.household ?? null;

  const table = useReactTable({
    data: households ?? empty,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    showNotification({
      type: 'failure',
      title: t.title,
      message: errorMessages.UNKNOWN_ERROR,
      ...createTestAttr(ids.householdListFailureNotification),
    });
    return null;
  }

  if (loading) return <FullPageLoader />;
  if (isNull(households)) return null;
  if (isEmpty(households)) return <HouseholdEmptyState />;

  return (
    <DashboardCard
      left={<CreateHouseholdButton />}
      right={<DashboardTitle>{t.title}</DashboardTitle>}
    >
      <HouseholdTable table={table} />
    </DashboardCard>
  );
};
