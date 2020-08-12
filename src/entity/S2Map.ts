import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, Unique, JoinColumn } from 'typeorm';
import { S2Region } from './S2Region';
import { GameLocale } from '../common';
import { S2MapHeader } from './S2MapHeader';
import { S2MapCategory } from './S2MapCategory';

export enum S2MapType {
    Map = 'map',
    ExtensionMod = 'extension_mod',
    DependencyMod = 'dependency_mod',
}

@Entity()
@Unique('region_bnet_idx', ['region', 'bnetId'])
export class S2Map {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => S2Region, {
        nullable: false,
    })
    @Index('region_idx')
    region: S2Region;

    @Column({
        type: 'tinyint',
        unsigned: true,
    })
    regionId: number;

    @Column({
        type: 'mediumint',
        unsigned: true,
    })
    bnetId: number;

    @Column({
        type: 'enum',
        enum: S2MapType,
    })
    type: S2MapType;

    @ManyToOne(type => S2MapHeader, {
        nullable: false,
    })
    @Index('current_version_idx')
    currentVersion: S2MapHeader;

    @Column({
        type: 'enum',
        enum: GameLocale,
    })
    mainLocale: GameLocale;

    @Column({
        type: 'char',
        length: 64,
    })
    mainLocaleHash: string;

    @Column({
        type: 'char',
        length: 64,
        nullable: true,
    })
    iconHash: string;

    @Column()
    @Index('name_idx')
    name: string;

    @Column({
        nullable: true,
        length: 2048,
    })
    description: string;

    @ManyToOne(type => S2MapCategory, {
        nullable: true,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    mainCategory: S2MapCategory;

    @Column()
    mainCategoryId: number;
}
