import { Row } from "antd";
import { Flex, Icon } from "../../common";

export const Products = (props) => {
  const { products = [] } = props;
  return (
    <>
      <Row>
        {products.map((item, index) => {
          return (
            <Flex align="center" gap="4px" style={{ marginInlineEnd: 4 }} key={item.id}>
              <Icon
                icon={item?.icon || 'MdOutlineCircle'}
                styled
                iconProps={{ color: item?.iconProps?.color, iconContainerSize: '1.6em' }}
              />
              <div>
                {item?.name} ({item?.quantity}){index !== products.length - 1 && ', '}
              </div>
            </Flex>
          );
        })}
      </Row>
    </>
  );
};

