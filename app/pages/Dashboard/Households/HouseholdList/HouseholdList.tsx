import { useHouseholdListQuery } from '@camp/data-layer';
import {
  DashboardCard,
  DashboardTitle,
  FullPageLoader,
  showNotification,
  Table,
} from '@camp/design';
import {
  ApiHouseholdOrderBy,
  householdColumnHelper,
  InputMaybe,
} from '@camp/domain';
import { errorMessages, messages } from '@camp/messages';
import { AppRoute } from '@camp/router';
import { createTestAttr } from '@camp/test';
import { isEmpty, isNull } from '@fullstacksjs/toolbox';
import { Group } from '@mantine/core';
import type { SortingState } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { memo, useMemo, useState } from 'react';

import { InformationBadge, SeverityBadge } from '../../../../components';
import { CreateHouseholdButton } from '../CreateHousehold';
import {
  HouseholdActionButton,
  householdActionIds as actionIds,
} from '../HouseholdActionButton';
import { HouseholdEmptyState } from '../HouseholdEmptyState';
import * as ids from './HouseholdList.ids';
import { HouseholdTableColumn } from './HouseholdTableColumn';
import { HouseholdTableRow } from './HouseholdTableRow';

const t = messages.households.list;

export const HouseholdList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, loading, error } = useHouseholdListQuery({
    variables: { orderBy: sorting },
  });
  const households = data?.household;

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
      header: t.table.columns.status,
      cell: status => (
        <InformationBadge
          information={status.getValue() ? 'completed' : 'draft'}
        />
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
            household={props.row.original}
            menuButtonId={actionIds.actionButton}
            menuId={actionIds.actionMenu}
          />
        </Group>
      ),
    }),
  ];

  const table = useReactTable({
    data: households!,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
    getSortedRowModel: getSortedRowModel(),
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

  const householdRow = <HouseholdTableRow rows={table} />;

  const householdColumn = <HouseholdTableColumn col={table} />;

  return (
    <DashboardCard
      left={<CreateHouseholdButton />}
      right={<DashboardTitle>{t.title}</DashboardTitle>}
    >
      <Table
        id={ids.householdTableId}
        columns={householdColumn}
        rows={householdRow}
      />
    </DashboardCard>
  );
};
