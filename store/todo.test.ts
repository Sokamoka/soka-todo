import { setActivePinia, createPinia } from "pinia";
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { useTodoStore } from "./todo";

beforeAll(() => {
  setActivePinia(createPinia());
});

describe("runs", () => {
  test("It works", () => {
    expect(true).toBe(true);
  });
});

describe("useTodoStore", () => {
  let store: ReturnType<typeof useTodoStore>;

  beforeEach(() => {
    store = useTodoStore();
  });

  afterEach(() => {
    store.$reset();
  });

  test("create a store", () => {
    expect(store).toBeDefined();
  });

  test("initializes with empty items", () => {
    expect(store.items).toStrictEqual([]);
  });

  test("create a todo", () => {
    store.add({ title: "Test my code!" });
    expect(store.items[0]).toBeDefined();
    expect(store.items[0].title).toBe("Test my code!");
  });

  test("gets by id", () => {
    store.add({ title: "Test" });

    const item = store.items[0];
    const todo = store.getById(item.id);

    expect(todo).toStrictEqual(item);
  });

  test("get get orderes todos without mutating state", () => {
    const items = [
      {
        createdAt: new Date(2021, 2, 24),
      },
      {
        createdAt: new Date(2019, 2, 24),
      },
      {
        createdAt: new Date(2020, 2, 24),
      },
    ];
    // @ts-ignore
    store.items = items;
    const orderedTodos = store.getOrderedTodos;

    expect(orderedTodos[0].createdAt.getFullYear()).toBe(2019);
    expect(orderedTodos[1].createdAt.getFullYear()).toBe(2020);
    expect(orderedTodos[2].createdAt.getFullYear()).toBe(2021);
    expect(store.items[0].createdAt.getFullYear()).toBe(2021);
  });

  test("removes a todo", () => {
    store.add({ title: "Test" });
    const todo = store.items[0];
    store.remove(todo.id);
    expect(store.items).toStrictEqual([]);
  });

  test("update todo", () => {
    store.add({ title: "Test" });
    const todo = store.items[0];
    store.update(todo.id, { done: true });
    const updated = store.items[0];
    expect(updated.done).toBe(true);
  });

  test("update todo title", () => {
    store.add({ title: "Test title" });
    const todo = store.items[0];
    store.update(todo.id, { title: "New test title" });
    const updated = store.items[0];
    expect(updated.title).toBe("New test title");
  });
});
