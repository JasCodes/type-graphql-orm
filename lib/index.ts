const TypeORM = require('typeorm');
const TypeGQL = require('type-graphql');
export { TypeORM, TypeGQL };

import { ReturnTypeFunc, AdvancedOptions, TypeValue } from 'type-graphql/decorators/types';



// const { ReturnTypeFunc, AdvancedOptions, TypeValue };

// const { ReturnTypeFunc, AdvancedOptions, TypeValue } = require('type-graphql/decorators/types')

export function Field(returnTypeFunc?: ReturnTypeFunc, options?: AdvancedOptions): PropertyDecorator
{
    options = { nullable: true, ...options }
    return (target, propertyKey) =>
    {
        TypeGQL.Field(returnTypeFunc, <AdvancedOptions>options)(target, propertyKey);
    };
}

// export function FieldOneToMany<T>(
//     typeFunction: (type?: any) => TORM.ObjectType<T>,
//     inverseSide: string | ((object: T) => any),
//     options?: Relation | AdvancedOptions
// ): PropertyDecorator
// {
//     options = { nullable: true, ...(options) };
//     return (target, propertyKey) =>
//     {
//         TGQL.Field(typeFunction, options as AdvancedOptions)
//             (target, propertyKey);
//         TORM.OneToMany(typeFunction, inverseSide, options as RelationOption);
//     };
// }