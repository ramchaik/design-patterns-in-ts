interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

interface BaseRecord {
  id: string;
}

interface VDatabase<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;

  visit(visitor: (item: T) => void): void;
}

class InMemoryDatabaseWithVisitor<T extends BaseRecord>
  implements VDatabase<T>
{
  private db: Record<string, T> = {};

  set(newValue: T): void {
    this.db[newValue.id] = newValue;
  }

  get(id: string): T | undefined {
    return this.db[id];
  }

  visit(visitor: (item: T) => void): void {
    Object.values(this.db).forEach(visitor);
  }
}

const p = new InMemoryDatabaseWithVisitor<Pokemon>();

p.set({
  id: 'test-1',
  attack: 10,
  defense: 10,
});

p.set({
  id: 'test-2',
  attack: 10,
  defense: 10,
});

p.visit((item) => {
  console.log('visiting :>> ', item)
})