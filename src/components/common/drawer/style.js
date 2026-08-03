import Styled from 'styled-components';
import { Drawer } from 'antd';

const DrawerStyle = Styled(Drawer)`
.ant-drawer-title{
--ant-font-size-lg: 20px;
 @media only screen and (max-width: 767px){
 --ant-font-size-lg: 16px;
 }
}
`;

export { DrawerStyle };
