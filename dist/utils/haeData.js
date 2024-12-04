const apiUrl = "http://127.0.0.1:3000/api";
const fetchData = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Error ${response.status} occured`);
    }
    const json = response.json();
    return json;
};
export { fetchData, apiUrl };
