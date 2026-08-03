import { Button, Group } from "../../common";

export const OrderActions = (props) => {
  const { actions = [] } = props;
  return (
    <Group gap="8px">
      {actions.map((item) =>
        item?.type === 'button' ? (
          <Button type="primary" size="small" transparented href={item?.link} key={item?.label}>
            {item?.label}
          </Button>
        ) : (
          ''
        ),
      )}
    </Group>
  );
};
