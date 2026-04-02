import {ReturnRequest} from '../types/ReturnRequest';

/**
 * Web-compatible storage using localStorage instead of AsyncStorage
 */
export class ReturnsStorage {
  private static STORAGE_KEY = 'ReturnsRunner:returns';

  /**
   * Save a return request
   */
  async saveReturn(returnRequest: ReturnRequest): Promise<void> {
    try {
      const allReturns = await this.getAllReturns();
      const existingIndex = allReturns.findIndex(r => r.id === returnRequest.id);

      if (existingIndex >= 0) {
        allReturns[existingIndex] = returnRequest;
      } else {
        allReturns.unshift(returnRequest);
      }

      localStorage.setItem(
        ReturnsStorage.STORAGE_KEY,
        JSON.stringify(allReturns),
      );
    } catch (error) {
      console.error('Error saving return:', error);
      throw error;
    }
  }

  /**
   * Get a specific return by ID
   */
  async getReturn(returnId: string): Promise<ReturnRequest | null> {
    try {
      const allReturns = await this.getAllReturns();
      return allReturns.find(r => r.id === returnId) || null;
    } catch (error) {
      console.error('Error getting return:', error);
      return null;
    }
  }

  /**
   * Get all returns
   */
  async getAllReturns(): Promise<ReturnRequest[]> {
    try {
      const data = localStorage.getItem(ReturnsStorage.STORAGE_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting all returns:', error);
      return [];
    }
  }

  /**
   * Delete a return
   */
  async deleteReturn(returnId: string): Promise<void> {
    try {
      const allReturns = await this.getAllReturns();
      const filtered = allReturns.filter(r => r.id !== returnId);
      localStorage.setItem(
        ReturnsStorage.STORAGE_KEY,
        JSON.stringify(filtered),
      );
    } catch (error) {
      console.error('Error deleting return:', error);
      throw error;
    }
  }

  /**
   * Clear all returns
   */
  async clearAllReturns(): Promise<void> {
    try {
      localStorage.removeItem(ReturnsStorage.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing returns:', error);
      throw error;
    }
  }

  /**
   * Get returns by status
   */
  async getReturnsByStatus(
    status: ReturnRequest['status'],
  ): Promise<ReturnRequest[]> {
    const allReturns = await this.getAllReturns();
    return allReturns.filter(r => r.status === status);
  }

  /**
   * Get returns by retailer
   */
  async getReturnsByRetailer(retailer: string): Promise<ReturnRequest[]> {
    const allReturns = await this.getAllReturns();
    return allReturns.filter(
      r => r.retailer.toLowerCase() === retailer.toLowerCase(),
    );
  }
}
