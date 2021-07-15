interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

interface BaseRecord {
  id: string;
}

interface SDatabase<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;

  selectBest(scoreStrategy: (item: T) => number): T | undefined;
}

class InMemoryDatabaseWithStrategy<T extends BaseRecord>
  implements SDatabase<T>
{
  private db: Record<string, T> = {};

  set(newValue: T): void {
    this.db[newValue.id] = newValue;
  }

  get(id: string): T | undefined {
    return this.db[id];
  }

  selectBest(scoreStrategy: (item: T) => number): T | undefined {
    const found: {
      max: number;
      item: T | undefined;
    } = {
      max: 0,
      item: undefined,
    };

    Object.values(this.db).reduce((f, item) => {
      const score = scoreStrategy(item);
      if (score > f.max) {
        f.max = score;
        f.item = item;
      }
      return f;
    }, found);

    return found.item;
  }
}

const sp = new InMemoryDatabaseWithStrategy<Pokemon>();

sp.set({
  id: 'test-1',
  attack: 100,
  defense: 10,
});

sp.set({
  id: 'test-2',
  attack: 10,
  defense: 100,
});

sp.set({
  id: 'test-3',
  attack: 999,
  defense: 100,
});

const bestInAttack = sp.selectBest(({ attack }) => attack);
const bestInDefense = sp.selectBest(({ defense }) => defense);

console.log({ bestInAttack, bestInDefense });
