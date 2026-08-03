import Styled from 'styled-components';

const GroupStyled = Styled.div`
  display: grid;
  gap: var(--gap, 24px);
  grid-template-columns: var(--template, minmax(0, 1fr));
  grid-auto-rows: minmax(0, auto);

  ${(props) =>
    props.hasDividers &&
    `
      // > * + * {
      //   outline: 1px solid #f39;
      // }
    `}
`;

export default GroupStyled;
