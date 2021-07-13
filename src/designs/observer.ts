type Listener<EventType> = (ev: EventType) => void;

function createObserver<EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event));
    },
  };
}

interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

interface AfterSetEvent<T> {
  value: T;
}

interface Pokemon {
  id: string;
  attack: number;
  defense: number;
}

interface BaseRecord {
  id: string;
}

interface ODatabase<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;
}

class InMemoryDatabaseWithObserver<T extends BaseRecord>
  implements ODatabase<T>
{
  private db: Record<string, T> = {};

  private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
  private afterAddListeners = createObserver<AfterSetEvent<T>>();

  set(newValue: T): void {
    this.beforeAddListeners.publish({
      newValue,
      value: this.db[newValue.id],
    });

    this.db[newValue.id] = newValue;

    this.afterAddListeners.publish({
      value: newValue,
    });
  }

  get(id: string): T | undefined {
    return this.db[id];
  }

  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
    return this.beforeAddListeners.subscribe(listener);
  }

  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
    return this.afterAddListeners.subscribe(listener);
  }
}

const pk = new InMemoryDatabaseWithObserver<Pokemon>();

const unsubscribeBeforeAdd = pk.onBeforeAdd(({ value, newValue }) => {
  console.log('before add: ', { value, newValue });
});

const unsubscribeAfterAdd = pk.onAfterAdd(({ value }) => {
  console.log('after add: ', { value });
});

pk.set({
  id: 'test',
  attack: 10,
  defense: 10,
});

unsubscribeAfterAdd();

pk.set({
  id: 'test-2',
  attack: 10,
  defense: 10,
});
console.log(pk.get('test'));

