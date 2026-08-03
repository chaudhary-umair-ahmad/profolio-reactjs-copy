import { Typography } from "antd"

const Title = props => {
  const { children, ...rest } = props
  const { Title } = Typography

  return <Title {...rest}>{children}</Title>
}

export default Title
