import axiosInstance from "../middlewares/axiosInstance";

class DasboardService {
    async getPerfromers(eventId) {
        // Get all performers
        try {
            const response = await axiosInstance.get('events/' + eventId + '/performers',
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            );
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getEvents() {
        // Get all events
        try {
            const response = await axiosInstance.get('events', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async toggleAcceptVoting(eventId) {
        try {
            const response = await axiosInstance.get('events/' + eventId + '/toggle-voting',
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            );
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async submitJudgeScore(eventId, performerId, score) {
        try {
            const response = await axiosInstance.post('events/' + eventId + '/submit-judge-score/',
                {
                    score: score,
                    performerId: performerId
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            );
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async publishResults(eventId) {
        try {
            const response = await axiosInstance.post('events/' + eventId + '/publish-result',
                {},
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            );
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default new DasboardService();