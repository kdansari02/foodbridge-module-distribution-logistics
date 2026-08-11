// Mock API Client — Foodbridge Module Distribution Logistics
// Lets the frontend be built and tested fully independently of the backend.
// Must satisfy the exact same ApiClient interface as index.ts.

import type { ApiClient } from "./types";
import type { EntityName } from "@foodbridge-module-distribution-logistics/ssot/domain-model";

const fixtures: EntityName[] = [
  { id: "mock-1", field: "Example one" },
  { id: "mock-2", field: "Example two" },
];

export function createMockApiClient(): ApiClient {
  const data = [...fixtures];

  return {
    async listEntities() {
      return data;
    },
    async getEntity(id) {
      const found = data.find((e) => e.id === id);
      if (!found) throw new Error(`not found: ${id}`);
      return found;
    },
    async createEntity(input) {
      const entity: EntityName = { id: `mock-${data.length + 1}`, ...input };
      data.push(entity);
      return entity;
    },
  };
}
