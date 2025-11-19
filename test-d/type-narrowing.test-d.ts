/**
 * Type Narrowing and Edge Case Tests
 * Testing advanced TypeScript type system features
 */

import { expectType, expectAssignable, expectNotAssignable } from 'tsd';
import { iter, IterFlow } from '../src/index.js';
import * as fn from '../src/fn/index.js';

// =============================================================================
// Type Guards and Narrowing
// =============================================================================

// Type guard function
function isString(value: string | number): value is string {
  return typeof value === 'string';
}

function isNumber(value: string | number): value is number {
  return typeof value === 'number';
}

// Using type guards with filter - IterFlow preserves the original type
const mixed1: (string | number)[] = [1, 'a', 2, 'b', 3, 'c'];
const strings = iter(mixed1).filter(isString);
expectType<IterFlow<string | number>>(strings);

const numbers = iter(mixed1).filter(isNumber);
expectType<IterFlow<string | number>>(numbers);

// Functional API with type guards - also preserves original type
const fnStrings = fn.filter(isString);
expectType<IterableIterator<string | number>>(fnStrings(mixed1));

const fnNumbers = fn.filter(isNumber);
expectType<IterableIterator<string | number>>(fnNumbers(mixed1));

// =============================================================================
// Discriminated Unions
// =============================================================================

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'square'; size: number };

const shapes: Shape[] = [
  { kind: 'circle', radius: 5 },
  { kind: 'rectangle', width: 10, height: 20 },
  { kind: 'square', size: 15 },
];

// Filter by discriminant - filter preserves original union type
const circles = iter(shapes).filter((s): s is Extract<Shape, { kind: 'circle' }> => s.kind === 'circle');
expectType<IterFlow<Shape>>(circles);

const rectangles = iter(shapes).filter((s): s is Extract<Shape, { kind: 'rectangle' }> => s.kind === 'rectangle');
expectType<IterFlow<Shape>>(rectangles);

// Map preserves discriminated union type
const shapesIter = iter(shapes).map(s => {
  if (s.kind === 'circle') {
    return { ...s, area: Math.PI * s.radius * s.radius };
  }
  if (s.kind === 'rectangle') {
    return { ...s, area: s.width * s.height };
  }
  return { ...s, area: s.size * s.size };
});
expectType<IterFlow<
  | { kind: 'circle'; radius: number; area: number }
  | { kind: 'rectangle'; width: number; height: number; area: number }
  | { kind: 'square'; size: number; area: number }
>>(shapesIter);

// =============================================================================
// Literal Types
// =============================================================================

// Const assertions
const literalArray = ['a', 'b', 'c'] as const;
expectType<IterFlow<'a' | 'b' | 'c'>>(iter(literalArray));

const literalNumbers = [1, 2, 3] as const;
expectType<IterFlow<1 | 2 | 3>>(iter(literalNumbers));

// Tuple types
const tuple: [number, string, boolean] = [1, 'hello', true];
expectType<IterFlow<number | string | boolean>>(iter(tuple));

// Mapped literal type transformation
const literalToString = iter(literalNumbers).map(n => n.toString());
expectType<IterFlow<string>>(literalToString);

// =============================================================================
// Generic Constraints
// =============================================================================

// Function that requires specific interface
interface Identifiable {
  id: number;
}

interface Product extends Identifiable {
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: 'Apple', price: 1.5 },
  { id: 2, name: 'Banana', price: 0.75 },
];

// Should work with types that extend Identifiable
expectType<IterFlow<Product>>(iter(products).distinctBy(p => p.id));

// GroupBy with complex key types
const groupedById = iter(products).groupBy(p => p.id);
expectType<Map<number, Product[]>>(groupedById);

const groupedByPrice = iter(products).groupBy(p => p.price > 1);
expectType<Map<boolean, Product[]>>(groupedByPrice);

// =============================================================================
// Conditional Types and Inference
// =============================================================================

// Conditional type helper
type ExtractNumberProperties<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

// Use in generic context
function sumProperty<T, K extends ExtractNumberProperties<T>>(
  items: Iterable<T>,
  key: K
): number {
  return iter(items)
    .map(item => item[key] as number)
    .sum();
}

const totalPrice = sumProperty(products, 'price');
expectType<number>(totalPrice);

// =============================================================================
// Readonly and Immutability
// =============================================================================

// Readonly arrays
const readonlyNumbers: readonly number[] = [1, 2, 3, 4, 5];
expectType<IterFlow<number>>(iter(readonlyNumbers));
expectType<number[]>(iter(readonlyNumbers).toArray());

// Readonly tuples
const readonlyTuple: readonly [number, string] = [1, 'hello'];
expectType<IterFlow<number | string>>(iter(readonlyTuple));

// ReadonlyArray type
const readonlyArray: ReadonlyArray<string> = ['a', 'b', 'c'];
expectType<IterFlow<string>>(iter(readonlyArray));

// Deeply readonly objects
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

const deepReadonly: DeepReadonly<Product>[] = products;
expectType<IterFlow<DeepReadonly<Product>>>(iter(deepReadonly));

// =============================================================================
// Optional and Nullable Types
// =============================================================================

// Optional properties
interface OptionalUser {
  name: string;
  age?: number;
  email?: string;
}

const optionalUsers: OptionalUser[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob' },
];

expectType<IterFlow<OptionalUser>>(iter(optionalUsers));

// Filter out undefined values - filter preserves union type
const definedAges = iter(optionalUsers)
  .map(u => u.age)
  .filter((age): age is number => age !== undefined);
expectType<IterFlow<number | undefined>>(definedAges);

// Nullable types - filter preserves union type
const nullableNumbers: (number | null)[] = [1, 2, null, 3, null, 4];
const nonNullNumbers = iter(nullableNumbers).filter((n): n is number => n !== null);
expectType<IterFlow<number | null>>(nonNullNumbers);

// =============================================================================
// Intersection Types
// =============================================================================

interface Named {
  name: string;
}

interface Aged {
  age: number;
}

type Person = Named & Aged;

const people: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

expectType<IterFlow<Person>>(iter(people));
expectType<IterFlow<Person>>(iter(people).filter(p => p.age > 20));

// Map to union with additional property
const addId = iter(people).map(p => ({ ...p, id: Math.random() }));
expectType<IterFlow<{ name: string; age: number; id: number }>>(addId);

// =============================================================================
// Union Types
// =============================================================================

// Union of different structures
type Result<T> = { success: true; value: T } | { success: false; error: string };

const results: Result<number>[] = [
  { success: true, value: 42 },
  { success: false, error: 'Failed' },
  { success: true, value: 100 },
];

expectType<IterFlow<Result<number>>>(iter(results));

// Filter to successful results only - filter preserves union type
const successful = iter(results).filter(
  (r): r is Extract<Result<number>, { success: true }> => r.success
);
expectType<IterFlow<Result<number>>>(successful);

// Extract values from successful results - need manual narrowing in map
const values = iter(results)
  .filter((r): r is Extract<Result<number>, { success: true }> => r.success)
  .map(r => 'value' in r ? r.value : 0);
expectType<IterFlow<number>>(values);

// =============================================================================
// Mapped Types
// =============================================================================

// Partial mapped type
type PartialProduct = Partial<Product>;
const partialProducts: PartialProduct[] = [
  { id: 1, name: 'Apple' },
  { id: 2, price: 0.75 },
];

expectType<IterFlow<PartialProduct>>(iter(partialProducts));

// Required mapped type
type RequiredOptionalUser = Required<OptionalUser>;
const requiredUsers: RequiredOptionalUser[] = [
  { name: 'Alice', age: 30, email: 'alice@example.com' },
];

expectType<IterFlow<RequiredOptionalUser>>(iter(requiredUsers));

// Pick mapped type
type ProductName = Pick<Product, 'name'>;
const productNames: ProductName[] = products.map(p => ({ name: p.name }));
expectType<IterFlow<ProductName>>(iter(productNames));

// =============================================================================
// Variance and Assignability
// =============================================================================

// IterFlow is covariant in T - Person is compatible with Named
expectType<IterFlow<Person>>(iter(people));

// =============================================================================
// Template Literal Types
// =============================================================================

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = `/${string}`;
type Route = `${HTTPMethod} ${Endpoint}`;

const routes: Route[] = ['GET /users', 'POST /users', 'DELETE /users/1'];
expectType<IterFlow<Route>>(iter(routes));

const getMethods = iter(routes).filter((r): r is `GET ${Endpoint}` => r.startsWith('GET'));
expectType<IterFlow<Route>>(getMethods);

// =============================================================================
// Branded Types
// =============================================================================

// Brand for compile-time type safety
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<number, 'UserId'>;
type ProductId = Brand<number, 'ProductId'>;

const userIds: UserId[] = [1 as UserId, 2 as UserId, 3 as UserId];
const productIds: ProductId[] = [10 as ProductId, 20 as ProductId];

expectType<IterFlow<UserId>>(iter(userIds));
expectType<IterFlow<ProductId>>(iter(productIds));

// Cannot mix branded types
expectNotAssignable<IterFlow<UserId>>(iter(productIds));
expectNotAssignable<IterFlow<ProductId>>(iter(userIds));

// =============================================================================
// Never Type
// =============================================================================

// Empty array infers never
const emptyArray: never[] = [];
expectType<IterFlow<never>>(iter(emptyArray));

// Filter that removes everything results in never
const alwaysFalse = iter([1, 2, 3]).filter((): false => false);
expectType<IterFlow<number>>(alwaysFalse); // Still number, just empty at runtime

// =============================================================================
// Unknown Type
// =============================================================================

// Working with unknown
const unknowns: unknown[] = [1, 'a', true, { x: 1 }];
expectType<IterFlow<unknown>>(iter(unknowns));

// Narrow unknown to specific type - filter preserves unknown
const unknownToNumber = iter(unknowns).filter((x): x is number => typeof x === 'number');
expectType<IterFlow<unknown>>(unknownToNumber);

// =============================================================================
// Recursive Types
// =============================================================================

// Tree structure
interface TreeNode<T> {
  value: T;
  children?: TreeNode<T>[];
}

const tree: TreeNode<number> = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3 },
  ],
};

// Flatten tree nodes
function* flattenTree<T>(node: TreeNode<T>): Generator<TreeNode<T>> {
  yield node;
  if (node.children) {
    for (const child of node.children) {
      yield* flattenTree(child);
    }
  }
}

expectType<IterFlow<TreeNode<number>>>(iter(flattenTree(tree)));

// Extract values from tree
const treeValues = iter(flattenTree(tree)).map(node => node.value);
expectType<IterFlow<number>>(treeValues);

// =============================================================================
// Higher-Kinded Types Simulation
// =============================================================================

// Simulate HKT with interface
interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>;
}

// IterFlow implements Functor
expectAssignable<Functor<number>>(iter([1, 2, 3]));
expectAssignable<Functor<string>>(iter(['a', 'b', 'c']));

// =============================================================================
// Complex Predicate Types
// =============================================================================

// Filter with literal types - filter preserves original literal union
const numbers2 = [1, 2, 0, -1, 3] as const;
const positives = iter(numbers2).filter((n): n is typeof n => n > 0);
expectType<IterFlow<1 | 2 | 0 | -1 | 3>>(positives);

// =============================================================================
// Contravariance in Function Parameters
// =============================================================================

// Function contravariance
interface Processor<T> {
  process(value: T): void;
}

const numberProcessor: Processor<number> = {
  process: (n: number) => console.log(n),
};

// Contravariant position
expectAssignable<Processor<1 | 2 | 3>>(numberProcessor);

// =============================================================================
// Symbol Types
// =============================================================================

const symbolKey = Symbol('key');
type WithSymbol = { [symbolKey]: number; name: string };

const withSymbols: WithSymbol[] = [
  { [symbolKey]: 1, name: 'first' },
  { [symbolKey]: 2, name: 'second' },
];

expectType<IterFlow<WithSymbol>>(iter(withSymbols));

// =============================================================================
// BigInt Support
// =============================================================================

const bigInts: bigint[] = [1n, 2n, 3n, 4n, 5n];
expectType<IterFlow<bigint>>(iter(bigInts));

// Map bigint to number
const bigIntToNumber = iter(bigInts).map(n => Number(n));
expectType<IterFlow<number>>(bigIntToNumber);

// =============================================================================
// Async Iterables (should not work)
// =============================================================================

// IterFlow does not support async iterables
async function* asyncGen(): AsyncGenerator<number> {
  yield 1;
  yield 2;
  yield 3;
}

// @ts-expect-error - async iterables not supported
iter(asyncGen());

// =============================================================================
// Error Cases - Compile-time Safety
// =============================================================================

// Statistical operations should only work on numbers
// @ts-expect-error
iter(['a', 'b', 'c']).sum();

// @ts-expect-error
iter(['a', 'b', 'c']).mean();

// @ts-expect-error
iter(['a', 'b', 'c']).median();

// @ts-expect-error
iter(['a', 'b', 'c']).variance();

// @ts-expect-error
iter(['a', 'b', 'c']).stdDev();

// sort without comparator should only work on number | string
// @ts-expect-error
iter([{ x: 1 }, { x: 2 }]).sort();

// Functional API errors
// @ts-expect-error
fn.sum(['a', 'b', 'c']);

// @ts-expect-error
fn.mean(['a', 'b', 'c']);

// @ts-expect-error
fn.median(['a', 'b', 'c']);
