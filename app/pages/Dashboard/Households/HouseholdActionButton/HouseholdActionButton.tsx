import { useDeleteHouseholdMutation } from '@camp/data-layer';
import { debug } from '@camp/debug';
import { showNotification } from '@camp/design';
import type { HouseholdKeys, HouseholdListItem } from '@camp/domain';
import { MenuIcon } from '@camp/icons';
import { messages } from '@camp/messages';
import type { AppRoute, PathParams } from '@camp/router';
import { Link } from '@camp/router';
import { createTestAttr } from '@camp/test';
import { isNull } from '@fullstacksjs/toolbox';
import { ActionIcon, Menu } from '@mantine/core';

import { openDeleteHouseholdModal } from '../DeleteHouseholdModal';
import { householdActionIds as ids } from './HouseholdActionButton.ids';

interface Props {
  to: AppRoute;
  household?: HouseholdKeys & HouseholdListItem;
  params?: PathParams<AppRoute>;
  menuId?: string;
  menuButtonId?: string;
}

export const HouseholdActionButton = ({
  menuId,
  menuButtonId,
  to,
  params,
  household,
}: Props) => {
  const [deleteHousehold] = useDeleteHouseholdMutation();
  const { id, name } = household!;
  const t = messages.households.list.delete.modal;

  const onDeleteHousehold = async () => {
    try {
      const { data } = await deleteHousehold({ variables: { id } });

      if (isNull(data)) throw Error('Assert: data is null');
      showNotification({
        title: t.notification.title,
        message: t.notification.success(data.household.name),
        type: 'success',
        ...createTestAttr(ids.notifications.delete.success),
      });
    } catch (err) {
      debug.error(err);
      showNotification({
        title: t.notification.title,
        message: t.notification.failed(name),
        type: 'failure',
        ...createTestAttr(ids.notifications.delete.failure),
      });
    }
  };

  const handleDeleteHousehold = () => {
    openDeleteHouseholdModal({ name, onDeleteHousehold });
  };

  return (
    <Menu width={100} shadow="md" withArrow>
      <Menu.Target {...createTestAttr(menuButtonId)}>
        <ActionIcon size="sm" onClick={e => e.stopPropagation()}>
          <MenuIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown {...createTestAttr(menuId)}>
        <Menu.Item to={to} params={params} component={Link}>
          {messages.actions.open}
        </Menu.Item>
        <Menu.Item
          color="red"
          onClick={e => {
            e.stopPropagation();
            handleDeleteHousehold();
          }}
        >
          {messages.actions.delete}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
