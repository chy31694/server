import * as fp from 'fastify-plugin';
import { S2GameLobby } from '../../../entity/S2GameLobby';
import { S2GameLobbySlotKind } from '../../../entity/S2GameLobbySlot';
import { GameLobbyStatus } from '../../../gametracker';
import { S2Map } from '../../../entity/S2Map';

export default fp(async (server, opts, next) => {
    server.get('/open-games', async (request, reply) => {
        const result = await server.conn.getRepository(S2GameLobby)
            .createQueryBuilder('lobby')
            .select([
                'lobby.bnetBucketId',
                'lobby.bnetRecordId',
                'lobby.createdAt',
                'lobby.closedAt',
                'lobby.status',
                'lobby.mapVariantIndex',
                'lobby.mapVariantMode',
                'lobby.lobbyTitle',
                'lobby.hostName',
                'lobby.slotsHumansTotal',
                'lobby.slotsHumansTaken',
                'lobby.mapMajorVersion',
                'lobby.mapMinorVersion',
                'lobby.multiModBnetId',
            ])
            .innerJoinAndSelect('lobby.region', 'region')
            .innerJoinAndMapOne('lobby.map', S2Map, 'map', 'map.regionId = lobby.regionId AND map.bnetId = lobby.mapBnetId')
            .leftJoinAndSelect('lobby.slots', 'slot')
            .leftJoinAndSelect('slot.joinInfo', 'joinInfo')
            .andWhere('slot.kind = :kind', { kind: S2GameLobbySlotKind.Human })
            .andWhere('lobby.status = :status OR lobby.closedAt >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 20 SECOND)', { status: GameLobbyStatus.Open })
            .addOrderBy('lobby.createdAt', 'ASC')
            .addOrderBy('slot.slotNumber', 'ASC')
            .getMany()
        ;

        result.map(s2lobby => {
            if (s2lobby.status === GameLobbyStatus.Abandoned) {
                (<any>s2lobby).status = 'disbanded';
            }
            (<any>s2lobby).mapDocumentVersion = {
                majorVersion: s2lobby.mapMajorVersion,
                minorVersion: s2lobby.mapMinorVersion,
                iconHash: s2lobby.map.iconHash,
                document: {
                    regionId: s2lobby.map.regionId,
                    bnetId: s2lobby.map.bnetId,
                    type: s2lobby.map.type,
                    isArcade: s2lobby.multiModBnetId === null,
                    name: s2lobby.map.name,
                    currentMajorVersion: s2lobby.mapMajorVersion,
                    currentMinorVersion: s2lobby.mapMinorVersion,
                    iconHash: s2lobby.map.iconHash,
                },
            };
            delete s2lobby.map;
            delete s2lobby.mapMajorVersion;
            delete s2lobby.mapMinorVersion;
            delete s2lobby.multiModBnetId;
            (<any>s2lobby).mapVariantCategory = 'Other';
            (<any>s2lobby).players = s2lobby.slots.map(s2slot => {
                if (s2slot.kind !== S2GameLobbySlotKind.Human) return;
                return {
                    joinedAt: s2slot.joinInfo?.joinedAt ?? s2lobby.createdAt,
                    leftAt: null,
                    name: s2slot.name,
                };
            }).filter(x => x !== void 0);
            delete s2lobby.slots;
        });

        reply.header('Cache-control', 'public, s-maxage=1');
        return reply.type('application/json').code(200).send(result);
    });
});