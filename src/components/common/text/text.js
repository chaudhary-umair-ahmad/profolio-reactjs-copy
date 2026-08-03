import { Typography } from 'antd';

const Text = (props) => {
  const { children, block = false, className, ...rest } = props;
  const { Text } = Typography;
  const renderComponent = () => {
    return (
      <Text className={className} style={{ '--typography-color': rest.color, ...rest.style }} {...rest}>
        {children}
      </Text>
    );
  };

  return block ? <div>{renderComponent()}</div> : renderComponent();
};

export default Text;
