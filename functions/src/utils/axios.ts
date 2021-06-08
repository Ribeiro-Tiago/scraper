import Axios from "axios";

const axios = Axios.create({
	headers: { "Content-Type": "application/json" },
});

axios.interceptors.response.use(
	({ data }) => data,
	(err) => {
		if (!err.isAxiosError || !err.response) {
			throw err;
		}

		const { data, status } = err.response;
		throw { data, status };
	},
);

export default axios;
