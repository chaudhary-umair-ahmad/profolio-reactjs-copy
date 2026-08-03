import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import { FiX } from 'react-icons/fi';
import { BottomSheetDrawer } from '../../../components/common/drawerPopover/styled';
import { IconCriteriaMapping } from './Utils';
import {
  ModalHeaderWrapper,
  ModalTitle,
  ModalCloseButton,
  ModalInfoBanner,
  TasksGrid,
  TaskCard,
  TaskIconWrapper,
  TaskPoints,
  TaskTitle,
} from './styled';
import { InfoIconLeaderboard } from '../../../components/svg';

const TruPoints = ({ visible, onClose, t, isMobile = false, tasks = null }) => {
  const { locale } = useSelector((state) => state.app.AppConfig);
  const displayTasks = tasks && tasks.length > 0 ? tasks : [];
  const bottomSheetRef = useRef();

  useEffect(() => {
    if (isMobile && visible && bottomSheetRef.current) {
      bottomSheetRef.current.openDrawer();
    } else if (isMobile && !visible && bottomSheetRef.current && bottomSheetRef.current.isOpen()) {
      bottomSheetRef.current.closeDrawer();
    }
  }, [visible, isMobile]);

  const content = (
    <>
      {!isMobile && (
        <ModalHeaderWrapper $isMobile={isMobile}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <ModalTitle>{t('Get More Visibility with TruPoints')}</ModalTitle>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#626262', margin: 0 }}>
              {t('Earn TruPoints to boost your rank and stand out among other agents')}
            </p>
          </div>
          {!isMobile && (
            <div style={{ cursor: 'pointer' }} onClick={onClose}>
              <FiX size={20} color="#A3A3A3" />
            </div>
          )}
        </ModalHeaderWrapper>
      )}

      <ModalInfoBanner $isMobile={isMobile}>
        <InfoIconLeaderboard />
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#4f4f4f' }}>
          {t('Trupoints expire after every 90 days')}
        </span>
      </ModalInfoBanner>

      <TasksGrid $isMobile={isMobile}>
        {displayTasks.map((task, idx) => {
          const iconConfig = IconCriteriaMapping(task.slug || task.type);

          return (
            <TaskCard key={task.id} $isMobile={isMobile}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {iconConfig.icon}
                <TaskPoints>+{task.points} Points</TaskPoints>
              </div>
              <TaskTitle $isMobile={isMobile}>
                {locale === 'ar' && task.title_l1 ? task.title_l1 : task.title || ''}
              </TaskTitle>
            </TaskCard>
          );
        })}
      </TasksGrid>
    </>
  );

  return isMobile ? (
    <BottomSheetDrawer
      ref={bottomSheetRef}
      rootClassName="bottom-sheet"
      placement="bottom"
      onCloseDrawer={onClose}
      className="drawer-container"
      height="90vh"
      title={t('Get More Visibility with TruPoints')}
      bodyStyle={{ padding: 0 }}
      footer={null}
    >
      {content}
    </BottomSheetDrawer>
  ) : (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={816}
      centered
      title={null}
      closable={false}
      styles={{
        header: { display: 'none' },
        body: { padding: 0 },
        content: { borderRadius: 12, overflow: 'hidden', padding: 0 },
      }}
    >
      {content}
    </Modal>
  );
};

export default TruPoints;
