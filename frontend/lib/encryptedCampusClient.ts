export class EncryptedCampusClient {
  constructor(readonly contract: EncryptedCampusState, readonly signer: any) {}

  async getMembership(groupId: string, user: string) { ... }
  async setMembership(groupId: string, user: string, isActive: boolean) { ... }

  async getReputation(groupId: string, user: string) { ... }
  async addReputationEncrypted(groupId, user, clearDelta: number) { ... }

  async castVoteEncrypted(pollId, clearOption) { ... }

  async getTally(pollId, option) { ... }
  
  async getMetric(metricId) { ... }
  async incrementMetricEncrypted(metricId, clearDelta) { ... }
}
