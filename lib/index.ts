import * as TypeOrm from 'typeorm';
import * as TypeGql from 'type-graphql';

export { TypeOrm, TypeGql };

import { ReturnTypeFunc, AdvancedOptions, TypeValue } from 'type-graphql/decorators/types';
import { RelationOptions, ObjectType, EntityOptions } from "typeorm";
import { ObjectOptions } from 'type-graphql/decorators/ObjectType';

export type GqlClassOptions = ObjectOptions | EntityOptions;
export function GqlClass(name?: string, options?: GqlClassOptions): ClassDecorator
{
    return (target) =>
    {
        name ?
            TypeGql.ObjectType(name, options as ObjectOptions)(target) :
            TypeGql.ObjectType(options as ObjectOptions)(target);
        TypeOrm.Entity(name, options as EntityOptions)(target)
    }
}

export function GqlProp(returnTypeFunc?: ReturnTypeFunc, options?: AdvancedOptions): PropertyDecorator
{
    options = { nullable: true, ...options }
    return (target, propertyKey) =>
    {
        TypeGql.Field(returnTypeFunc, <AdvancedOptions>options)(target, propertyKey);
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
        TypeGql.Field(typeFunction, options as AdvancedOptions)
        (target, propertyKey);
        TypeOrm.OneToOne(typeFunction, inverseSide, options as RelationOptions)
        (target, propertyKey);
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
        TypeGql.Field(type => [typeFunction()], options as AdvancedOptions)
            (target, propertyKey);
        TypeOrm.OneToMany(typeFunction, inverseSide, options as RelationOptions)
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
        TypeGql.Field(type => [typeFunction()], options as AdvancedOptions)
            (target, propertyKey);
        TypeOrm.ManyToMany(typeFunction, inverseSide, options as RelationOptions)
            (target, propertyKey);
    };
}