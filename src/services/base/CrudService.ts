/**
 * Interfaz genérica para servicios CRUD
 */
export interface ICrudService<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | undefined>;
  create(item: Omit<T, "id">): Promise<T>;
  update(id: number, item: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

/**
 * Clase base abstracta que implementa persistencia en LocalStorage
 * y simula latencia de red.
 */
export abstract class LocalStorageService<T extends { id: number }>
  implements ICrudService<T>
{
  private storageKey: string;
  private initialData: T[];
  private simulatedDelay: number = 500; // ms

  constructor(storageKey: string, initialData: T[] = []) {
    this.storageKey = storageKey;
    this.initialData = initialData;
    this.initialize();
  }

  /**
   * Inicializa el storage con datos mock si está vacío
   */
  private initialize(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.initialData));
    }
  }

  /**
   * Helper para simular delay de red
   */
  protected async delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.simulatedDelay));
  }

  /**
   * Obtiene todos los registros
   */
  async getAll(): Promise<T[]> {
    await this.delay();
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene un registro por ID
   */
  async getById(id: number): Promise<T | undefined> {
    await this.delay();
    const items = await this.getAll();
    return items.find((item) => item.id === id);
  }

  /**
   * Crea un nuevo registro
   */
  async create(item: Omit<T, "id">): Promise<T> {
    await this.delay();
    const items = await this.getAll();
    
    // Generar nuevo ID (max + 1)
    const maxId = items.length > 0 ? Math.max(...items.map((i) => i.id)) : 0;
    const newItem = { ...item, id: maxId + 1 } as T;
    
    items.push(newItem);
    this.save(items);
    
    return newItem;
  }

  /**
   * Actualiza un registro existente
   */
  async update(id: number, changes: Partial<T>): Promise<T> {
    await this.delay();
    const items = await this.getAll();
    const index = items.findIndex((i) => i.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    const updatedItem = { ...items[index], ...changes } as T;
    items[index] = updatedItem;
    this.save(items);
    
    return updatedItem;
  }

  /**
   * Elimina un registro
   */
  async delete(id: number): Promise<void> {
    await this.delay();
    const items = await this.getAll();
    const filtered = items.filter((i) => i.id !== id);
    this.save(filtered);
  }

  /**
   * Guarda el estado actual en localStorage
   */
  private save(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
