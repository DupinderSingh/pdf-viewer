import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function createNotification (type, msg) {
    switch (type) {
        case 'success':
            return NotificationManager.success(msg, 'Success', 350000, () => {return false}, true);
        case 'error':
            return NotificationManager.error(msg, 'Fail', 500000, () => {return false}, true);
        default:
            console.log("nothing found")
    }
}
export default createNotification