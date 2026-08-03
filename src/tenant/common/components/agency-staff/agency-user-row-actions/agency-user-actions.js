import tenantTheme from '@theme';
import TenantComponents from '@components';
import tenantConstants from '@constants';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { DeleteAgencyUserModal } from '../../../../../components/delete-agency-user/deleteAgencyUserModal';
import { UserForm } from '../../../../../components/forms/AgencyUserForm';
import TableActions from '../../../../../components/table/table-actions/table-actions';
import { Button, Flex, Popover, Icon } from '../../../../../components/common';
import { editStaffClickEvent, deleteStaffClickEvent } from '../../../../../services/analyticsService';
import { useGetAgencySeatsSummaryQuery } from '../../../../../apis/agency';
export const AgencyUserRowActions = (props) => {
  const { userId, agencyId, isAdmin, isOwner, name, deleteModalData, quotaCredit, creditsAvailable, seatsFull, refetchSeats } = props;
  const { user } = useSelector((state) => state.app.loginUser);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showActivateUserForm, setShowActivateUserForm] = useState(false);
  const [showManageQuota, setShowManageQuota] = useState(false);
  const confirmationModalRef = useRef();
  const isPending = (props?.status?.slug === 'pending');
  const isNonActiveUser = (props?.disposition?.slug === 'user-activation-pending');
  const disableUserActions = tenantConstants?.DISABLE_PENDING_USER_CONTROLS && isPending;  
  const disableActivateUser = seatsFull;
  return (
    !isOwner &&
    userId != user.id && (
      <>
          <TableActions
            id={`${agencyId}-${userId}`}
            actionsList={[
            ...(isNonActiveUser
              ? [
              {
                iconType: 'activate-user',
                onClick: () => {
                  setShowActivateUserForm(true);
                },
                color: tenantTheme['primary-color'],
                disabled: disableActivateUser,
                tooltipLabel: disableActivateUser ? 'Upgrade package or delete existing users to activate this user' : undefined,
              }
            ] : []),
              {
                iconType: 'edit',
                onClick: () => {
                  editStaffClickEvent(user, name);
                  setShowUserForm(true);
                },
                color: tenantTheme['primary-color'],
                disabled: disableUserActions,
              },
              ...(tenantConstants.MANAGE_QUOTA_ENABLED
                ? [
                    {
                      iconType: 'manage-products',
                      onClick: () => {
                        setShowManageQuota(true);
                      },
                      disabled: disableUserActions,
                    },
                  ]
                : []),
              {
                iconType: 'delete',
                onClick: () => {
                  deleteStaffClickEvent(user, name);
                  confirmationModalRef?.current && confirmationModalRef.current.showModal();
                },
                color: tenantTheme['primary-color'],
                // disabled: disableUserActions,
              },
            ]}
          />
        
        <UserForm
          isVisible={showUserForm}
          setIsVisible={setShowUserForm}
          agencyId={agencyId}
          userId={userId}
          isAdmin={isAdmin}
          refetchSeats={refetchSeats}
        />

        <UserForm
          isVisible={showActivateUserForm}
          setIsVisible={setShowActivateUserForm}
          agencyId={agencyId}
          userId={userId}
          isAdmin={isAdmin}
          isActivationMode={true}
          refetchSeats={refetchSeats}
        />

        {TenantComponents.ManageQuota && (
          <TenantComponents.ManageQuota
            isVisible={showManageQuota}
            setIsVisible={setShowManageQuota}
            agencyId={agencyId}
            userId={userId}
            name={name}
            quotaCredit={quotaCredit}
          />
        )}

        <DeleteAgencyUserModal
          confirmationModalRef={confirmationModalRef}
          deleteModalData={deleteModalData}
          userId={userId}
          agencyId={agencyId}
          userName={name}
          user={user}
          refetchSeats={refetchSeats}
        />
      </>
    )
  );
};
