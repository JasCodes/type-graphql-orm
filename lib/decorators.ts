import * as TypeORM from 'typeorm';
import * as TypeGQL from 'type-graphql';

import { ReturnTypeFunc, AdvancedOptions, TypeValue } from 'type-graphql/decorators/types';
import { RelationOptions, ObjectType, EntityOptions } from "typeorm";
import { ObjectOptions } from 'type-graphql/decorators/ObjectType';

export type GqlClassOptions = ObjectOptions | EntityOptions;
export function GqlClass(name?: string, options?: GqlClassOptions): ClassDecorator
{
    return (target) =>
    {
        name ?
            TypeGQL.ObjectType(name, options as ObjectOptions) :
            TypeGQL.ObjectType(options as ObjectOptions);
        TypeORM.Entity(name, options as EntityOptions)
    }
}

export function GqlProp(returnTypeFunc?: ReturnTypeFunc, options?: AdvancedOptions): PropertyDecorator
{
    options = { nullable: true, ...options }
    return (target, propertyKey) =>
    {
        TypeGQL.Field(returnTypeFunc, <AdvancedOptions>options)(target, propertyKey);
    };
}


export type GqlPropOption = RelationOptions & AdvancedOptions;

export function GqlPropOneToOne<T>(
    typeFunction: (type?: any) => ObjectType<T>,
    inverseSide: string | ((object: T) => any),
    options?: GqlPropOption
): PropertyDecorator
{
    options = { nullable: true, ...(options) };
    return (target, propertyKey) =>
    {
        TypeGQL.Field(typeFunction, options as AdvancedOptions)(target, propertyKey);
        TypeORM.OneToOne(typeFunction, inverseSide, options as RelationOptions)(target, propertyKey);
    };
}

export function GqlPropOneToMany<T>(
    typeFunction: (type?: any) => ObjectType<T>,
    inverseSide: string | ((object: T) => any),
    options?: GqlPropOption
): PropertyDecorator
{
    options = { nullable: true, ...(options) };
    return (target, propertyKey) =>
    {
        TypeGQL.Field(type => [typeFunction()], options as AdvancedOptions)
            (target, propertyKey);
        TypeORM.OneToMany(typeFunction, inverseSide, options as RelationOptions)
            (target, propertyKey);
    };
}


export function GqlPropManyToMany<T>(
    typeFunction: (type?: any) => ObjectType<T>,
    inverseSide: string | ((object: T) => any),
    options?: RelationOptions | AdvancedOptions
): PropertyDecorator
{
    options = { nullable: true, ...(options) };
    return (target, propertyKey) =>
    {
        TypeGQL.Field(type => [typeFunction()], options as AdvancedOptions)
            (target, propertyKey);
        TypeORM.ManyToMany(typeFunction, inverseSide, options as RelationOptions)
            (target, propertyKey);
    };
}
