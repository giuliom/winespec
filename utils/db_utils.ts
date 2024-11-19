// Define interface for objects with ID
export interface WithId {
    id: string | number;
}

// Improved function with proper typing
export function removeIdField<T extends WithId>(obj: T): Omit<T, 'id'> {
    return removeField(obj, "id");
}

  // Generic function to remove any field from an object
export function removeField<T extends object, K extends keyof T>(
    obj: T, 
    fieldName: K
): Omit<T, K> {
    const { [fieldName]: _removed, ...filtered } = obj;
    return filtered;
}

// Remove multiple fields from an object
export function removeFields<T extends object, K extends keyof T>(
    obj: T,
    fieldNames: K[]
): Omit<T, K> {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !fieldNames.includes(key as K))
    ) as Omit<T, K>;
}
