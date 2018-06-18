// const TypeORM = require('typeorm');
// const TypeGQL = require('type-graphql');

import * as TypeORM from 'typeorm';
import * as TypeGQL from 'type-graphql';

export { TypeORM, TypeGQL };


import { ReturnTypeFunc, AdvancedOptions, TypeValue } from 'type-graphql/decorators/types';

import { RelationOptions, ObjectType } from "typeorm";


export function Field(returnTypeFunc?: ReturnTypeFunc, options?: AdvancedOptions): PropertyDecorator
{
    options = { nullable: true, ...options }
    return (target, propertyKey) =>
    {
        TypeGQL.Field(returnTypeFunc, <AdvancedOptions>options)(target, propertyKey);
    };
}

export function FieldOneToMany<T>(
    typeFunction: (type?: any) => ObjectType<T>,
    inverseSide: string | ((object: T) => any),
    options?: RelationOptions | AdvancedOptions
): PropertyDecorator
{
    options = { nullable: true, ...(options) };
    return (target, propertyKey) =>
    {
        TypeGQL.Field(typeFunction, options as AdvancedOptions)
            (target, propertyKey);
        TypeORM.OneToMany(typeFunction, inverseSide, options as RelationOptions);
    };
}