export const storage = {
    get(key) {
        const value = window.localStorage.getItem(key);
        if(!value){
            return null;
        }
        return JSON.parse(value);
    },
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        window.localStorage.removeItem(key);
    },
    clear() {
        window.localStorage.clear();
    },
    getAPI_URL(){
        return 'https://pensi-admin-produccion.vercel.app/';

    }
    
}
export default storage;