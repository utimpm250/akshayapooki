import { WorkItem } from "./types";

const STORAGE_KEY = "work_status_items";

export function getWorks(): WorkItem[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveWorks(items: WorkItem[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items)
  );
}

export function addWork(item: WorkItem) {
  const items = getWorks();

  items.unshift(item);

  saveWorks(items);
}

export function deleteWork(id: string) {
  const items = getWorks().filter(
    (x) => x.id !== id
  );

  saveWorks(items);
}

export function updateWork(item: WorkItem) {
  const items = getWorks().map((x) =>
    x.id === item.id ? item : x
  );

  saveWorks(items);
}