import cml from 'chameleon-api';
export default {
    showToast(store, text) {
        cml.showToast({
            message: text,
            duration: 2000
        })
    }
}