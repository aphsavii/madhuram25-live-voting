import axiosInstance from "../middlewares/axiosInstance";

class DasboardService {
    async getPerfromers(eventId) {
        // Get all performers
        try {
            const response = await axiosInstance.get('events/' + eventId + '/performers');
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getEvents() {
        // Get all events
        try {
            const response = await axiosInstance.get('events');
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default new DasboardService();