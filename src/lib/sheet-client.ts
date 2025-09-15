// SheetApps API Client
// Auto-generated for: Test Contact Manager

export interface SheetRow {
  Name: string;
  Email: string;
  Status: string;
  Created Date: string;
  _id: string;
  _rowIndex: number;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}

export interface SearchQuery {
  field?: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan';
}

export interface UpdateOperation {
  identifier: string | number;
  field: string;
  newValue: any;
  oldValue?: any;
}

export class SheetClient {
  private baseUrl: string;
  private apiKey: string;
  private sheetId: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SHEETAPPS_API_URL || 'http://localhost:3000/api/v1';
    this.apiKey = process.env.NEXT_PUBLIC_SHEETAPPS_API_KEY || 'sk_test_123456789';
    this.sheetId = process.env.NEXT_PUBLIC_SHEET_ID || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';

    if (!this.apiKey || !this.sheetId) {
      throw new Error('SheetApps API key and Sheet ID are required');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('SheetClient API Error:', error.message);
      throw error;
    }
  }

  async getAllData(): Promise<SheetRow[]> {
    const cacheKey = 'allData';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await this.makeRequest(`/sheets/${this.sheetId}/data`);
      const data = this.transformData(response.data.values || []);

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error: any) {
      console.error('Failed to fetch sheet data:', error.message);
      throw error;
    }
  }

  async addRow(data: Record<string, any>): Promise<ApiResponse> {
    try {
      const headers = ['Name', 'Email', 'Status', 'Created Date'];
      const values = [headers.map(header => data[header] || '')];

      await this.makeRequest(`/sheets/${this.sheetId}/update`, {
        method: 'PUT',
        body: JSON.stringify({
          range: 'A1:Z1',
          values: values,
          valueInputOption: 'USER_ENTERED'
        })
      });

      this.cache.clear(); // Invalidate cache
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateField(params: UpdateOperation): Promise<ApiResponse> {
    try {
      const allData = await this.getAllData();
      const rowIndex = allData.findIndex(row =>
        row._id === params.identifier ||
        row[Object.keys(row)[0]] === params.identifier
      );

      if (rowIndex === -1) {
        return { success: false, error: 'Row not found' };
      }

      const actualRowIndex = rowIndex + 2; // +1 for header, +1 for 1-based indexing
      const columnIndex = ['Name', 'Email', 'Status', 'Created Date'].indexOf(params.field);

      if (columnIndex === -1) {
        return { success: false, error: 'Field not found' };
      }

      const columnLetter = String.fromCharCode(65 + columnIndex); // A, B, C, etc.
      const range = `${columnLetter}${actualRowIndex}`;

      await this.makeRequest(`/sheets/${this.sheetId}/update`, {
        method: 'POST',
        body: JSON.stringify({
          range: range,
          values: [[params.newValue]],
          valueInputOption: 'USER_ENTERED'
        })
      });

      this.cache.clear(); // Invalidate cache
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async search(query: SearchQuery): Promise<SheetRow[]> {
    try {
      const allData = await this.getAllData();

      return allData.filter(row => {
        const value = query.field ? row[query.field] : Object.values(row).some(val =>
          val?.toString().toLowerCase().includes(query.value?.toString().toLowerCase())
        );

        if (!query.field) return value;

        const fieldValue = row[query.field]?.toString().toLowerCase();
        const searchValue = query.value?.toString().toLowerCase();

        switch (query.operator) {
          case 'equals':
            return fieldValue === searchValue;
          case 'contains':
            return fieldValue?.includes(searchValue);
          case 'startsWith':
            return fieldValue?.startsWith(searchValue);
          case 'greaterThan':
            return Number(fieldValue) > Number(searchValue);
          case 'lessThan':
            return Number(fieldValue) < Number(searchValue);
          default:
            return fieldValue?.includes(searchValue);
        }
      });
    } catch (error: any) {
      console.error('Search failed:', error.message);
      return [];
    }
  }

  private transformData(values: string[][]): SheetRow[] {
    if (values.length === 0) return [];

    const headers = values[0];
    const dataRows = values.slice(1);

    return dataRows.map((row, index) => {
      const rowObj: any = {
        _id: `row_${index + 1}`,
        _rowIndex: index + 1
      };

      headers.forEach((header, colIndex) => {
        rowObj[header] = row[colIndex] || '';
      });

      return rowObj as SheetRow;
    });
  }
}