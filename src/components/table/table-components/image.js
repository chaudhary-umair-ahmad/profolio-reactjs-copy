export const Img = (props) => {
  const { imageUrl } = props;
  return <img src={imageUrl} style={{ width: '80px', height: 'auto' }} />;
};
