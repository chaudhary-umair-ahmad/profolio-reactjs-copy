import { Group, Icon } from "../../common";

export const Platform = (props) => {
  const { data = [] } = props || {};
  return (
    <Group gap="8px">
      {data?.map((item) => (
        <div key={item.slug} disabled={!item.posted ? 'disabled' : ''}>
          <Icon icon={item.icon} size="1.6em" />
        </div>
      ))}
    </Group>
  );
};

