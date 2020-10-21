import { Entity, OneToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BnAccount } from './BnAccount';

export type UserPrivacyPreferences = {
    profilePrivate: boolean | null;
    mapPubDownload: boolean | null;
    mapPrivDownload: boolean | null;
    mapPrivDetails: boolean | null;
    mapPrivListed: boolean | null;
};

export const defaultAccountSettings: Required<UserPrivacyPreferences> = {
    profilePrivate: false,
    mapPubDownload: true,
    mapPrivDownload: true,
    mapPrivDetails: true,
    mapPrivListed: true,
};

@Entity()
export class BnAccountSettings implements UserPrivacyPreferences {
    @OneToOne(type => BnAccount, account => account.settings, {
        primary: true,
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn()
    account: BnAccount;

    @Column({
        primary: true,
        unsigned: true,
        select: false,
    })
    accountId: number;

    @CreateDateColumn({
        select: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        select: false,
    })
    updatedAt: Date;

    @Column({
        nullable: true,
    })
    profilePrivate: boolean | null = null;

    @Column({
        nullable: true,
    })
    mapPubDownload: boolean | null = null;

    @Column({
        nullable: true,
    })
    mapPrivDownload: boolean | null = null;

    @Column({
        nullable: true,
    })
    mapPrivDetails: boolean | null = null;

    @Column({
        nullable: true,
    })
    mapPrivListed: boolean | null = null;
}
