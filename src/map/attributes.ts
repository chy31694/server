export const AttributeSystemNamespaceId = 999;

export enum AttributeId {
    Controller                  = 500,
    Rules                       = 1000,
    IsPremadeGame               = 1001,
    PartiesPrivate              = 2000,
    PartiesPremade              = 2001,
    PartiesPremade1V1           = 2002,
    PartiesPremade2V2           = 2003,
    PartiesPremade3V3           = 2004,
    PartiesPremade4V4           = 2005,
    PartiesPremadeFFA           = 2006,
    PartiesPremade5V5           = 2007,
    PartiesPremade6V6           = 2008,
    PartiesPrivateOne           = 2010,
    PartiesPrivateTwo           = 2011,
    PartiesPrivateThree         = 2012,
    PartiesPrivateFour          = 2013,
    PartiesPrivateFive          = 2014,
    PartiesPrivateSix           = 2015,
    PartiesPrivateSeven         = 2016,
    PartiesPrivateFFA           = 2017,
    PartiesPrivateCustom        = 2018,
    PartiesPrivateEight         = 2019,
    PartiesPrivateNine          = 2020,
    PartiesPrivateTen           = 2021,
    PartiesPrivateEleven        = 2022,
    PartiesPrivateFFATandem     = 2023,
    PartiesPrivateCustomTandem  = 2024,
    GameSpeed                   = 3000,
    Race                        = 3001,
    PartyColor                  = 3002,
    Handicap                    = 3003,
    AISkill                     = 3004,
    AIRace                      = 3005,
    LobbyDelay                  = 3006,
    ParticipantRole             = 3007,
    WatcherType                 = 3008,
    GameMode                    = 3009,
    LockedAlliances             = 3010,
    PlayerLogo                  = 3011,
    TandemLeader                = 3012,
    Commander                   = 3013,
    CommanderLevel              = 3014,
    GameDuration                = 3015,
    CommanderMasteryLevel       = 3016,
    AIBuildFirst                = 3100,
    AIBuildLast                 = 3300,
    PrivacyOption               = 4000,
    UsingCustomObserverUi       = 4001,
    CanReady                    = 4009,
    LobbyMode                   = 4010,
    ReadyOrderDeprecated        = 4011,
    ActiveTeam                  = 4012,
    LobbyPhase                  = 4015,
    ReadyingCountDeprecated     = 4016,
    ActiveRound                 = 4017,
    ReadyMode                   = 4018,
    ReadyRequirements           = 4019,
    FirstActiveTeam             = 4020,
    CommanderMasteryTalentFirst = 5000,
    CommanderMasteryTalentLast  = 5005,
}

export const lobbyDelayValues = [
    '3',
    '5',
    '7',
    '10',
    '15',
    '20',
    '25',
    '30',
];