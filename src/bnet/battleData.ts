import * as orm from 'typeorm';
import { BattleAPI, BattleUserInfo } from './battleAPI';
import { BnAccount } from '../entity/BnAccount';
import { profileHandle } from './common';
import { S2Profile } from '../entity/S2Profile';

export class BattleDataUpdater {
    protected bAPI = new BattleAPI();

    constructor (protected conn: orm.Connection) {
    }

    protected async updateAccountProfiles(bAccount: BnAccount) {
        const bProfiles = (await this.bAPI.sc2.getAccount(bAccount.id)).data;
        if (!bAccount.profiles) {
            bAccount.profiles = [];
        }
        for (const bCurrProfile of bProfiles) {
            let s2profile = bAccount.profiles.find(x => profileHandle(x) === profileHandle(bCurrProfile));
            if (!s2profile) {
                s2profile = await this.conn.getRepository(S2Profile).findOne({
                    where: {
                        regionId: bCurrProfile.regionId,
                        realmId: bCurrProfile.realmId,
                        profileId: bCurrProfile.profileId,
                    },
                });
                if (!s2profile) {
                    s2profile = new S2Profile();
                    s2profile.regionId = bCurrProfile.regionId;
                    s2profile.realmId = bCurrProfile.realmId;
                    s2profile.profileId = bCurrProfile.profileId;
                    s2profile.name = bCurrProfile.name;
                    s2profile.nameUpdatedAt = new Date();
                }

                const updatedData: Partial<S2Profile> = {};
                if (!s2profile.account || s2profile.account.id !== bAccount.id) {
                    updatedData.account = bAccount;
                }
                if (s2profile.avatarUrl !== bCurrProfile.avatarUrl) {
                    updatedData.avatarUrl = bCurrProfile.avatarUrl;
                }

                Object.assign(s2profile, updatedData);
                if (this.conn.getRepository(S2Profile).hasId(s2profile)) {
                    if (Object.keys(updatedData).length) {
                        await this.conn.getRepository(S2Profile).update(s2profile.id, updatedData);
                    }
                }
                else {
                    await this.conn.getRepository(S2Profile).save(s2profile);
                }
                bAccount.profiles.push(s2profile);
            }
            else {
                if (s2profile.avatarUrl !== bCurrProfile.avatarUrl) {
                    s2profile.avatarUrl = bCurrProfile.avatarUrl;
                    await this.conn.getRepository(S2Profile).update(s2profile.id, {
                        avatarUrl: bCurrProfile.avatarUrl,
                    });
                }
            }
        }

        if (bAccount.profiles.length > bProfiles.length) {
            const detachedProfiles = bAccount.profiles.filter(x => !bProfiles.find(y => profileHandle(x) === profileHandle(y)))
            for (const dItem of detachedProfiles) {
                dItem.account = null;
                bAccount.profiles.splice(bAccount.profiles.findIndex(x => x === dItem), 1);
                await this.conn.getRepository(S2Profile).update(dItem.id, { account: null });
            }
        }
    }

    async updateAccount(accountInfo: BattleUserInfo | number) {
        const accountId = typeof accountInfo === 'number' ? accountInfo : accountInfo.id;
        let bAccount = await this.conn.getRepository(BnAccount).findOne(accountId);
        if (!bAccount) {
            bAccount = new BnAccount();
            bAccount.id = accountId;
            await this.conn.getRepository(BnAccount).insert(bAccount);
        }
        await this.updateAccountProfiles(bAccount);
        if (typeof accountInfo === 'object') {
            bAccount.battleTag = accountInfo.battletag;
            bAccount.updatedAt = new Date();
            await this.conn.getRepository(BnAccount).save(bAccount);
        }
        return bAccount;
    }
}