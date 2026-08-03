import { Group, Tag, Icon, Popover } from "../../common";
import tenantTheme from '@theme';

export const OrderStatus = (props) => {
  const { state, disposition } = props;
  return (
    <Group gap="8px" template="auto" align="center">
      <div>
        <Tag color={state?.color} shape="round">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          {state?.label}
          {disposition?.slug === 'user-activation-pending' && (
            <Popover
              content={disposition?.name}
              placement="top"
            >
              <span style={{ display: 'inline-flex'}}>
                <Icon 
                  icon="MdInfoOutline" 
                  color={tenantTheme['gray500']} 
                  size={'14px'} 
                  style={{ cursor: 'pointer' }} 
                />
              </span>
            </Popover>
          )}
          </div>
        </Tag>
      </div>
    </Group>
  );
};

