import tenantTheme from '@theme';
import tenantUtils from '@utils';
import { t } from 'i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import { getBaseURL } from '../../../utility/env';
import { Flex, Image, Popover, TextWithIcon } from '../../common';
import { Thumbnail } from '../../styled';
import { PopoverListingContainer } from '../styled';
import { ListingPurpose } from './listing-purpose';
import { MorePropertiesPopover } from './more-properties-popover';

export const ListingDetailCompact = (props) => {
  const { interests_count, characterLimit = 30, leadId, isDashboard = false, showExternalLink, interest } = props;
  const isMobile = useSelector((state) => state.app.AppConfig.isMobile);
  const listingTitle = `${tenantUtils.getLocalisedString(props?.type, 'title')} ${t('for')} ${tenantUtils.getLocalisedString(props?.purpose, 'title')}`;
  const listingLocation = props?.location?.breadcrumb;

  const project = interest?.project;
  if (project?.id) {
    const projectTitle = tenantUtils.getLocalisedString(project, 'title');
    const projectLocation = project?.location?.breadcrumbs
      ?.map((e) => tenantUtils.getLocalisedString(e, 'title'))
      ?.join(', ');
    const totalUnits = project?.total_units;

    return (
      <PopoverListingContainer action={null} className={'listing-detail pointer'}>
        <Flex gap={isMobile ? '4px' : '10px'} vertical>
          <Flex gap="8px" align="center">
            <Thumbnail>
              <Image
                src={project?.images?.[0]?.sizes?.thumbnail}
                fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
                width={'36px'}
              />
            </Thumbnail>
            <div>
              <Flex gap="8px" align="center" style={{ marginBottom: '4px' }}>
                <TextWithIcon
                  justify="flex-end"
                  style={{ flexDirection: 'row-reverse' }}
                  textColor={tenantTheme.baseColor}
                  value={
                    characterLimit && characterLimit < projectTitle?.length
                      ? `${projectTitle?.slice(0, characterLimit)}...`
                      : projectTitle
                  }
                  textSize={isMobile && '12px'}
                />
                {project?.id && (
                  <span style={{ minWidth:'63px', minHeight:'18px', borderRadius:'4px', padding:'4px 4px', backgroundColor:' rgba(225, 242, 240, 1)' }}>
                    <span style={{color:'rgba(0, 97, 105, 1)'}}>{t('New Project')}</span>
                  </span>
                )}
              </Flex>

              {projectLocation && (
                <TextWithIcon
                  icon="IoLocationSharp"
                  iconProps={{ size: isMobile ? '10px' : '12px', color: tenantTheme.gray550 }}
                  textColor={tenantTheme.gray700}
                  gap="2px"
                  value={
                    characterLimit && characterLimit < projectLocation?.length
                      ? `${projectLocation?.slice(0, characterLimit)}...`
                      : projectLocation
                  }
                  textSize={isMobile ? '10px' : '12px'}
                />
              )}

              {totalUnits && (
                <TextWithIcon
                  icon="AreaUnitIcon"
                  iconProps={{ size: isMobile ? '10px' : '12px', color: tenantTheme.gray550 }}
                  textColor={tenantTheme.gray700}
                  gap="2px"
                  value={`${totalUnits} ${t('Units')}`}
                  textSize={isMobile ? '10px' : '12px'}
                  style={{ marginTop: '4px' }}
                />
              )}
            </div>
          </Flex>
          {interests_count > 1 && (
            <MorePropertiesPopover
              title={`+ ${interests_count - 1} ${t('more properties')}.`}
              count={interests_count}
              leadId={leadId}
              isDashboard={isDashboard}
            />
          )}
        </Flex>
      </PopoverListingContainer>
    );
  }

  
  return (
    <PopoverListingContainer action={null} className={'listing-detail pointer'}>
      <Flex gap={isMobile ? '4px' : '10px'} vertical>
        <Flex gap="8px" align="center">
          <Thumbnail style={props?.thumbnailStyles}>
            <Image
              src={props?.image}
              fallback={`${getBaseURL()}/profolio-assets/images/ph-listings.svg`}
              width={'36px'}
            />
          </Thumbnail>
          <div>
            {props?.type?.title && props?.purpose?.title && (
              <Flex gap="8px" align="center" style={{ marginBottom: '4px' }}>
                <Popover
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  content={
                    <ListingPurpose
                      {...props}
                      disableDetailDrawer
                      hideHealthPopover
                      showExternalLink={showExternalLink}
                    />
                  }
                  action="hover"
                  getPopupContainer={() => document.body}
                >
                  <TextWithIcon
                    justify="flex-end"
                    style={{ flexDirection: 'row-reverse' }}
                    icon="BsFillInfoCircleFill"
                    iconProps={{ size: '12px', color: tenantTheme.gray500 }}
                    textColor={tenantTheme.baseColor}
                    value={
                      characterLimit && characterLimit < listingTitle?.length
                        ? `${listingTitle?.slice(0, characterLimit)}...`
                        : listingTitle
                    }
                    textSize={isMobile && '12px'}
                  />
                </Popover>
                {interest?.project?.id && (
                  <span style={{ minWidth:'63px', minHeight:'18px', borderRadius:'4px', padding:'4px 4px', backgroundColor:' rgba(225, 242, 240, 1)' }}>
                    <span style={{color:'rgba(0, 97, 105, 1)'}}>{t('New Project')}</span>
                  </span>
                )}
              </Flex>
            )}

            <TextWithIcon
              icon="IoLocationSharp"
              iconProps={{ size: isMobile ? '10px' : '12px', color: tenantTheme.gray550 }}
              textColor={tenantTheme.gray700}
              gap="2px"
              value={
                characterLimit && characterLimit < listingLocation?.length
                  ? `${listingLocation?.slice(0, characterLimit)}...`
                  : listingLocation
              }
              textSize={isMobile ? '10px' : '12px'}
            />
          </div>
        </Flex>
        {interests_count > 1 && (
          <MorePropertiesPopover
            title={`+ ${interests_count - 1} ${t('more properties')}.`}
            count={interests_count}
            leadId={leadId}
            isDashboard={isDashboard}
          />
        )}
      </Flex>
    </PopoverListingContainer>
  );
};
