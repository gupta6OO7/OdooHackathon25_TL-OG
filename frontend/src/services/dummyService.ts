import apiService from './api';

export interface DummyData {
  id: number;
  message: string;
  timestamp: string;
  randomNumber: number;
  items: Array<{
    id: number;
    name: string;
    value: string;
  }>;
}

export interface DummyResponse {
  success: boolean;
  data: any;
  message: string;
}

export const dummyService = {
  // GET dummy data
  async getDummyData(): Promise<DummyResponse> {
    console.log("🌐 Frontend: Making GET request to /api/dummy");
    
    try {
      const response = await apiService.get('/dummy');
      console.log("✅ Frontend: GET request successful");
      console.log("📥 Frontend: Received data:", response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("❌ Frontend: GET request failed:", error);
      console.error("📥 Frontend: Error details:", error.response?.data || error.message);
      throw error;
    }
  },

  // POST dummy data
  async createDummyData(data: any): Promise<DummyResponse> {
    console.log("🌐 Frontend: Making POST request to /api/dummy");
    console.log("📤 Frontend: Sending data:", data);
    
    try {
      const response = await apiService.post('/dummy', data);
      console.log("✅ Frontend: POST request successful");
      console.log("📥 Frontend: Received response:", response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("❌ Frontend: POST request failed:", error);
      console.error("📥 Frontend: Error details:", error.response?.data || error.message);
      throw error;
    }
  },

  // PUT dummy data
  async updateDummyData(id: number, data: any): Promise<DummyResponse> {
    console.log(`🌐 Frontend: Making PUT request to /api/dummy/${id}`);
    console.log("📤 Frontend: Sending data:", data);
    
    try {
      const response = await apiService.put(`/dummy/${id}`, data);
      console.log("✅ Frontend: PUT request successful");
      console.log("📥 Frontend: Received response:", response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("❌ Frontend: PUT request failed:", error);
      console.error("📥 Frontend: Error details:", error.response?.data || error.message);
      throw error;
    }
  },

  // DELETE dummy data
  async deleteDummyData(id: number): Promise<DummyResponse> {
    console.log(`🌐 Frontend: Making DELETE request to /api/dummy/${id}`);
    
    try {
      const response = await apiService.delete(`/dummy/${id}`);
      console.log("✅ Frontend: DELETE request successful");
      console.log("📥 Frontend: Received response:", response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("❌ Frontend: DELETE request failed:", error);
      console.error("📥 Frontend: Error details:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default dummyService;
