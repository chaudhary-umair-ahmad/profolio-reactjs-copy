import React from 'react';
import { Card, Heading } from '../common';
import { NoImage } from '../svg';

const NoImagesAvailable = () => {
  return (
    <Card className="text-center p-16">
      <NoImage />
      <Heading as="h3" className="mb-4" style={{ fontSize: '1rem' }}>
        No Images Available
      </Heading>
      <p className="color-gray-dark mb-20">At least one image is required to post a story ad!</p>
      {/* <Button type="primary" style={{ paddingInline: 20 }}>
        Add Images <HiPlus style={{ marginLeft: 5 }} />
      </Button> */}
    </Card>
  );
};

export default NoImagesAvailable;
