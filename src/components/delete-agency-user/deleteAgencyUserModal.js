import { useTranslation } from 'react-i18next';
import { useTableData } from '../../hooks';
import { ConfirmationModal, DataTable } from '../common';
import { useDeleteAgencyUserMutation } from '../../apis/agency';
import { confirmDeleteStaffClickEvent } from '../../services/analyticsService';
export const DeleteAgencyUserModal = ({ confirmationModalRef, deleteModalData, userId, agencyId, userName, user, refetchSeats }) => {
  const { t } = useTranslation();
  const [data, columns] = useTableData(deleteModalData?.list, deleteModalData?.table || [], []);
  const [deleteAgencyUser, { isLoading }] = useDeleteAgencyUserMutation();

  const handleOk = async () => {
    confirmationModalRef.current.setLoading(true);
    const res = await deleteAgencyUser({ agencyId, userId });
    confirmDeleteStaffClickEvent(user, userName, res?.error);
    confirmationModalRef.current.setLoading(false);
    if (res) {
      if (res.error) {
        confirmationModalRef.current.setError(res.error);
      } else {
        confirmationModalRef?.current && confirmationModalRef.current.hideModal();
        refetchSeats && refetchSeats();
      }
    }
  };

  return (
    <ConfirmationModal ref={confirmationModalRef} title={t('Delete User')} onSuccess={handleOk} loading={isLoading}>
      <p>{t('The following User will be deleted')}</p>
      <DataTable data={data} columns={columns} />
    </ConfirmationModal>
  );
};
