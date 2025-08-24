import { and, desc, eq } from 'drizzle-orm';

import { LobeChatDatabase } from '../type';
import { generateApiKey, isApiKeyExpired, validateApiKeyFormat } from '@/utils/apiKey';

import { ApiKeyItem, NewApiKeyItem, apiKeys } from '../schemas';

type EncryptAPIKeyVaults = (keyVaults: string) => Promise<string>;
type DecryptAPIKeyVaults = (keyVaults: string) => Promise<{ plaintext: string }>;

const defaultSerialize = (s: string) => s;

export class ApiKeyModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  create = async (
    params: Omit<NewApiKeyItem, 'userId' | 'id' | 'key'>,
    encryptor?: EncryptAPIKeyVaults,
  ) => {
    const key = generateApiKey();

    const encrypt = encryptor || defaultSerialize;

    const encryptedKey = await encrypt(key);

    const [result] = await this.db
      .insert(apiKeys)
      .values({ ...params, key: encryptedKey, userId: this.userId })
      .returning();

    return result;
  };

  delete = async (id: number) => {
    return this.db.delete(apiKeys).where(and(eq(apiKeys.id, id), eq(apiKeys.userId, this.userId)));
  };

  deleteAll = async () => {
    return this.db.delete(apiKeys).where(eq(apiKeys.userId, this.userId));
  };

  query = async (decryptor?: DecryptAPIKeyVaults) => {
    const results = await this.db.query.apiKeys.findMany({
      orderBy: [desc(apiKeys.updatedAt)],
      where: eq(apiKeys.userId, this.userId),
    });

    // 如果没有提供解密器，直接返回原始结果
    if (!decryptor) {
      return results;
    }

    // 对每个 API Key 的 key 字段进行解密
    const decryptedResults = await Promise.all(
      results.map(async (apiKey) => {
        const decryptedKey = await decryptor(apiKey.key);
        return {
          ...apiKey,
          key: decryptedKey.plaintext,
        };
      }),
    );

    return decryptedResults;
  };

  findByKey = async (key: string, encryptor?: EncryptAPIKeyVaults) => {
    if (!validateApiKeyFormat(key)) {
      return null;
    }

    const encrypt = encryptor || defaultSerialize;

    const encryptedKey = await encrypt(key);

    return this.db.query.apiKeys.findFirst({
      where: eq(apiKeys.key, encryptedKey),
    });
  };

  validateKey = async (key: string) => {
    const apiKey = await this.findByKey(key);

    if (!apiKey) return false;
    if (!apiKey.enabled) return false;
    if (isApiKeyExpired(apiKey.expiresAt)) return false;

    return true;
  };

  update = async (id: number, value: Partial<ApiKeyItem>) => {
    return this.db
      .update(apiKeys)
      .set({ ...value, updatedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, this.userId)));
  };

  findById = async (id: number) => {
    return this.db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.id, id), eq(apiKeys.userId, this.userId)),
    });
  };

  updateLastUsed = async (id: number) => {
    return this.db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, this.userId)));
  };
}
