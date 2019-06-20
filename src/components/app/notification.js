export const notify = (callFunction, type, message) => {
    console.log(callFunction, "callFunction")
    if (!!callFunction) {
        callFunction.current.addNotification({
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

