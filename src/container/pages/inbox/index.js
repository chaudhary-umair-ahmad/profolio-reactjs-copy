import { EmailContent } from '../../../components/inbox';
import { lazy } from 'react';

const MailDetailViewPage = lazy(() => import('./mail-detail-view'));

export default {
  InboxPage: EmailContent,
  SentPage: EmailContent,
  TrashPage: EmailContent,
  FolderPage: EmailContent,
  MailDetailViewPage,
};
