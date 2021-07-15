import fs from 'fs';

interface RecordHandler<T> {
  addRecord(record: T): void;
}

function loader<T>(fileName: string, recordHandler: RecordHandler<T>): void {
  const data: T[] = JSON.parse(fs.readFileSync(fileName).toString());
  data.forEach((record) => recordHandler.addRecord(record));
}

// --------------

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

class InMemoryDatabase<T extends BaseRecord> implements Database<T> {
  private db: Record<string, T> = {};

  set(newValue: T): void {
    this.db[newValue.id] = newValue;
  }

  get(id: string): T | undefined {
    return this.db[id];
  }
}

const pokemonDB = new InMemoryDatabase<Pokemon>();

class PokemonDBAdapter implements RecordHandler<Pokemon> {
  addRecord(record: Pokemon) {
    pokemonDB.set(record);
  }
}

loader(`${__dirname}/../data/index.json`, new PokemonDBAdapter());

console.log(pokemonDB.get('test-1'));
console.log(pokemonDB.get('test-2'));
