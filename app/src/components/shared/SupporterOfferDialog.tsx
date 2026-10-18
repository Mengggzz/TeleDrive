import type { SupporterPromptTrigger } from '../../services/supporterVisibility';

interface SupporterOfferDialogProps {
  trigger: SupporterPromptTrigger;
  presentation?: 'dialog' | 'bottom-sheet' | 'tv-dialog';
  onClose: () => void;
  onOpenSupporter: () => void;
}

export function SupporterOfferDialog(_props: SupporterOfferDialogProps) {
  return null;
}
