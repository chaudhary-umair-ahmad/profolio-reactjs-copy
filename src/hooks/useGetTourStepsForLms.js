import tenantData from '@data';
import { useMemo } from 'react';
import useElementObserver from './useElementObserver';
import { t } from 'i18next';

const useGetTourStepsForLms = (isMobile, data, sectionKey) => {
  const { element } = useElementObserver(`#${tenantData.tourElementIds.leads_dashboard_first_row}`);
  const tapTargets = JSON.parse(localStorage.getItem('tapTargets'));

  const leadsDashboardSteps = useMemo(
    () => [
      ...(element
        ? [
            {
              title: <br />,
              placement: 'top',
              description: t(
                'As you receive new leads, they will appear here with their latest interactions, interested listings, and assigned tasks for streamlined tracking and follow-ups.',
              ),
              target: () => element,
            },
          ]
        : []),
      {
        title: <br />,
        placement: 'left',
        description: t('Access a comprehensive list of all your leads.'),
        target: () => document.getElementById(tenantData.tourElementIds.leads_dashboard_view_all_link),
        btxText: t('Finish'),
      },
    ],
    [data, element],
  );
  const leadsManagementSteps = useMemo(
    () => [
      ...(data?.length
        ? [
            {
              title: <br />,
              placement: 'top',
              description: t(
                'See all your leads with their status, details, and interaction history for easier follow-up.',
              ),
              target: () => document.getElementById(tenantData.tourElementIds.leads_management_table),
              scrollIntoViewOptions: { block: 'end' },
              btxText: t('Finish'),
            },
          ]
        : []),
    ],
    [data],
  );
  const leadDetailDrawerSteps = useMemo(
    () => [
      {
        title: <br />,
        placement: 'topLeft',
        description: t('Review all interactions for this lead, including lead sources, interested listings and date.'),
        target: () => document.getElementById(tenantData.tourElementIds.lead_detail_all_interests),
        scrollIntoViewOptions: { block: isMobile ? 'start' : 'end' },
      },
      {
        title: <br />,
        placement: isMobile ? 'top' : 'left',
        description: t('Create a task against each lead to ensure timely follow-ups and effective lead management.'),
        target: () => document.getElementById(tenantData.tourElementIds.lead_detail_add_tasks),
        scrollIntoViewOptions: false,
      },
      {
        title: <br />,
        description: t('Access and manage all tasks associated with your leads'),
        target: () => document.getElementById(tenantData.tourElementIds.lead_detail_all_tasks_tab),
        scrollIntoViewOptions: false,
        btxText: t('Finish'),
      },
    ],
    [data, isMobile],
  );

  const stepsKeyMappings = {
    dashboard: leadsDashboardSteps,
    management: leadsManagementSteps,
    lead_detail: leadDetailDrawerSteps,
  };

  const getShowTour = () => {
    return !tapTargets?.lms?.[sectionKey]?.hide;
  };
  const onCloseTour = () => {
    localStorage.setItem(
      'tapTargets',
      JSON.stringify({
        ...(tapTargets && tapTargets),
        lms: {
          ...(tapTargets?.lms && tapTargets?.lms),
          [sectionKey]: {
            hide: true,
          },
        },
      }),
    );
  };

  return {
    steps: stepsKeyMappings?.[sectionKey].map((item) => ({
      ...item,
      prevButtonProps: {
        children: <>{t('Previous')}</>,
      },
      nextButtonProps: {
        children: <>{t(item?.btxText || t('Next'))}</>,
      },
    })),
    SHOW_TOUR: getShowTour(),
    onCloseTour: onCloseTour,
  };
};

export default useGetTourStepsForLms;
