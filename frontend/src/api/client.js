// import axios from 'axios';

// const client = axios.create({
//   baseURL: 'http://localhost:8000/',
//   headers: { 'Content-Type': 'multipart/form-data' }
// });

// export default client;
import axios from 'axios';

// Remove default content-type header so Axios can set proper boundaries
const client = axios.create({
  baseURL: 'http://localhost:8000/'
});

export default client;