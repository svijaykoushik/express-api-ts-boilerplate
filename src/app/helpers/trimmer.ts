/**
 * Trims the string value
 */
export function Trim(): (target: any, propertyName: string | symbol) => void;

/**
 * Trims the string value.
 * @param isArray Flag to sanitize every element in an array if the property is an array
 */
export function Trim(
    isArray: boolean
): (target: any, propertyName: string | symbol) => void;
export function Trim(
    isArray?: boolean
): (target: any, propertyName: string | symbol) => void {
    return function (target: any, propertyName: string | symbol) {
        trimDataStore.addDataToTrim({
            target,
            propertyName,
            each: isArray
        });
    };
}

interface TrimData {
    /**
     * The target Class to be sanitized.
     */
    target: object;

    /**
     * The name of the property to be sanitized.
     */
    propertyName: string | symbol;

    /**
     * Flag to sanitize every element in an array if the property is an array
     */
    each: boolean;
}

/**
 * The Datastore that stores the metadata about the
 * Class instance and it's properties decorated with
 * 'Trim' decorator
 */
class TrimSanitizerDataStore {
    private dataStore: Map<object, TrimData[]>;

    public constructor() {
        this.dataStore = new Map();
    }

    public addDataToTrim(data: TrimData) {
        if (!this.dataStore.has(data.target)) {
            this.dataStore.set(data.target, []);
        }
        this.dataStore.get(data.target)!.push(data);
    }

    public getDataToTrim(target: object) {
        const targetPrototype = Object.getPrototypeOf(target);
        const targetData = this.dataStore.get(targetPrototype as object) || [];
        const parentPrototype = Object.getPrototypeOf(targetPrototype);
        const parentData = this.dataStore.get(parentPrototype as object) || [];
        return [...targetData, ...parentData];
    }
}

const trimDataStore = new TrimSanitizerDataStore();

/**
 * A sanitizer that sanitizes an instance of a class
 * by trimming the string properties decorated with a supported decorator.
 */
class TrimSanitizer {
    private trimDataStore: TrimSanitizerDataStore;
    public constructor(dataStore: TrimSanitizerDataStore) {
        this.trimDataStore = dataStore;
    }

    /**
     * Sanitizes a class instance by trimming the string properties that are decorated with
     * the 'Trim' decorator
     * @param classInstance Instance of the class to be sanitized
     */
    public sanitize(classInstance: object) {
        const trimData = this.trimDataStore.getDataToTrim(classInstance);
        trimData
            .filter((datum) => {
                return (
                    classInstance[datum.propertyName] !== null &&
                    classInstance[datum.propertyName] !== undefined
                );
            })
            .forEach((datum) => {
                if (datum.each) {
                    if (Array.isArray(classInstance[datum.propertyName])) {
                        (classInstance[datum.propertyName] as any[]).forEach(
                            (item, index, array) => {
                                if (
                                    item !== null &&
                                    item !== undefined &&
                                    typeof item === 'string'
                                ) {
                                    array[index] = item.trim();
                                }
                            }
                        );
                    }
                } else {
                    if (typeof classInstance[datum.propertyName] === 'string') {
                        classInstance[datum.propertyName] = (
                            classInstance[datum.propertyName] as string
                        ).trim();
                    }
                }
            });
    }
}

/**
 * A sanitizer that sanitizes an instance of a class
 * by trimming the string properties decorated with a decorator
 */
export const trimSanitizer = new TrimSanitizer(trimDataStore);
