export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

const STORAGE_KEY = "clients";

export function getClients(): Client[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function saveClient(client: Client) {
  const clients = getClients();

  clients.push(client);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function deleteClient(id: string) {
  const clients = getClients().filter(
    client => client.id !== id
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}