interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

function createDatabase<T extends BaseRecord>() {
  return class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    set(newValue: T): void {
      this.db[newValue.id] = newValue;
    }

    get(id: string): T | undefined {
      return this.db[id];
    }
  };
}

