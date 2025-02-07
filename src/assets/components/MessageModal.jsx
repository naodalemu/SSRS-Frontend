import classes from './MessageModal.module.css';
import Backdrop from './Backdrop';

function MessageModal({ isItError, message, closeMessageBackdrop }) {
    return (
        <Backdrop onCloseBackdrop={closeMessageBackdrop}>
            <div className={classes.MessageContainer} onClick={(e) => e.stopPropagation()}>
                { isItError ? 
                    <div style={{ color: 'brown' }}>{message}</div> : <div style={{ color: 'darkgreen' }}>{message}</div>
                }
            </div>
        </Backdrop>
    )
}

export default MessageModal;