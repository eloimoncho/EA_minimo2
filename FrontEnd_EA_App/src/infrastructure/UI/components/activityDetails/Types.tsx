import { Activity } from '../../../../domain/activity/activity.entity';

export interface ActivityDetailsModalProps {
    activity: Activity;
    onClose: () => void;
}