import tenantTheme from '@theme';
import { Flex } from '@/components/common';
import { CircularBorder, InnerCircle } from '@tenantComponents/layout/styled';
import tenantConstants from '@constants';

const PurposeRadioButtonRightComponent = ({ selected, price }) => {
  return (
    <Flex align={'center'} gap={'8px'} style={{ margin: '0px 0px 0px 20px' }}>
      <Flex align={'center'} gap={'4px'}>
        <span>{tenantConstants.CURRENCY_SYMBOL()}</span>
        <span>{price}</span>
      </Flex>
      <CircularBorder
        selected={selected}
        primaryColor={tenantTheme['primary-color']}
        grayColor={tenantTheme['gray400']}
      >
        {selected && <InnerCircle primaryColor={tenantTheme['primary-color']} />}
      </CircularBorder>
    </Flex>
  );
};

export default PurposeRadioButtonRightComponent;
