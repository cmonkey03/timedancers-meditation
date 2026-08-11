/**
 * AsyncStorage wrapper service
 * Provides a centralized interface for all storage operations
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AsyncStorageKey } from '@/types';

class StorageService {
  /**
   * Get a value from AsyncStorage
   */
  async get<T = string>(key: AsyncStorageKey): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value as T | null;
    } catch (error) {
      console.error(`StorageService.get error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set a value in AsyncStorage
   */
  async set(key: AsyncStorageKey, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`StorageService.set error for key "${key}":`, error);
    }
  }

  /**
   * Remove a value from AsyncStorage
   */
  async remove(key: AsyncStorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`StorageService.remove error for key "${key}":`, error);
    }
  }

  /**
   * Remove multiple values from AsyncStorage
   */
  async multiRemove(keys: AsyncStorageKey[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('StorageService.multiRemove error:', error);
    }
  }

  /**
   * Get multiple values from AsyncStorage
   */
  async multiGet(keys: AsyncStorageKey[]): Promise<[string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('StorageService.multiGet error:', error);
      return keys.map(key => [key, null]);
    }
  }

  /**
   * Set multiple values in AsyncStorage
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('StorageService.multiSet error:', error);
    }
  }

  /**
   * Clear all values from AsyncStorage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('StorageService.clear error:', error);
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('StorageService.getAllKeys error:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();