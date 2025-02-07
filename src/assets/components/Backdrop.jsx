import classes from './Backdrop.module.css';

function Backdrop({ children, onCloseBackdrop }) {
    return (
        <div className={classes.backdrop} onClick={onCloseBackdrop}>
            {children}
        </div>
    )
}

export default Backdrop;