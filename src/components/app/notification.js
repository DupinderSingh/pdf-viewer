import React from 'react';

export const notify = (type, message) => {
    if (React.createRef().current) {
        React.createRef().current.addNotification({
            title: "",
            message,
            type,
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {duration: 2000},
            dismissable: {click: true}
        });
    }
};