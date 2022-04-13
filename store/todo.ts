import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoState {
  items: Todo[] | undefined[];
}

export interface TodoAdd {
  title: string;
}

export interface TodoUpdate {
  title?: string;
  done?: boolean;
}

const state = (): TodoState => ({
  items: [],
});

const getters = {
  getById: (state: TodoState) => (id: string) => {
    return state.items.find((item: Todo) => item.id === id);
  },
  getOrderedTodos: (state: TodoState) =>
    [...state.items].sort(
      (a: Todo, b: Todo) => a.createdAt.getTime() - b.createdAt.getTime()
    ),
};

const actions = {
  async fetchTodos(data) {
    this.items = (data || []).map((item) => ({
      ...item.data,
      dbId: item.ref["@ref"].id,
      createdAt: new Date(item.data.createdAt),
      updatedAt: new Date(item.data.updatedAt),
    }));
  },
  async add(partialTodo: TodoAdd) {
    const id =  uuid();
    const todo: Todo = {
      id,
      ...partialTodo,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(todo);
    const { data } = await useFetch(`/.netlify/functions/todos-create`, {
      method: "post",
      body: todo,
    });
    todo.dbId = data.value.ref["@ref"].id;
  },
  remove(id: string) {
    this.items = this.items.filter((todo) => todo.dbId !== id);
    useFetch(`/.netlify/functions/todos-delete/${id}`, {
      method: "post",
    });
  },
  async update(id: string, update: TodoUpdate) {
    const index = this.items.findIndex((item) => item.dbId === id);
    this.items[index] = {
      ...this.items[index],
      ...update,
      updatedAt: new Date(),
    };
    await useFetch(`/.netlify/functions/todos-update/${id}`, {
      method: "post",
      body: update,
    });
  },
};

export const useTodoStore = defineStore("todoStore", {
  state,
  getters,
  actions,
});
