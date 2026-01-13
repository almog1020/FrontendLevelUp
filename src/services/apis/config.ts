import axios from 'axios';

export const instance =  axios.create({
    baseURL: 'https://backend-level-up.vercel.app/',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});
export const instanceAuth =  axios.create({
    baseURL: 'https://backend-level-up.vercel.app/',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
    },
});

