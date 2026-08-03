import { capitalizeFirstLetter } from '../../../utility/utility';
import { Flex, Group, Number, Skeleton } from '../../common';

export const Stats = (props) => {
  const { data = [], subKey, showLabel = false } = props;

  const keys = subKey.split(',');

  const renderStats = (label, stat, data) => {
    return (
      <Flex align="center" gap="8px">
        <div className="text-muted fz-12">{t(label)}</div>
        {stat === 'loading' ? <Skeleton size="small" /> : stat ? <Number value={stat} compact={false} /> : '0'}
      </Flex>
    );
  };
  return (
    <Group gap="8px">
      {data.map((item, i) => (
        <div key={item.slug}>
          {keys.map((e, i) => (
            <Group key={i} gap="8px">
              <Flex justify="space-between" gap="8px">
                {showLabel && <div className="text-muted fz-12">{capitalizeFirstLetter(e)}</div>}
                {item[e] === 'loading' ? (
                  <Skeleton size="small" />
                ) : item[e] ? (
                  <Number value={item[e]} compact={false} />
                ) : (
                  '-'
                )}
              </Flex>
            </Group>
          ))}
        </div>
      ))}
    </Group>
  );
};
