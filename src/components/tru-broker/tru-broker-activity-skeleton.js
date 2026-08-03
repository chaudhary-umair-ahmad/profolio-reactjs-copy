import { Group, Skeleton } from "../common";

const TruBrokerActivityListSkeleton = () => {
  return (
    <Group template="repeat(5,minmax(100px, 250px))" gap="40px" className="justify-content-between">
      <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
      <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
      <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
      <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
      <Skeleton type="paragraph" paragraph={{ rows: 2 }} />
    </Group>
  );
};
export default TruBrokerActivityListSkeleton;
