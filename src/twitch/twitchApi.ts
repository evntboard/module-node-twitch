import {ApiClient} from "@twurple/api";
import {TokenInfo} from "@twurple/auth";
import {JSONRPCServerAndClient} from "json-rpc-2.0";

export async function twitchApiRegister(twitchApiInstance: ApiClient, currentUser: TokenInfo, serverAndClient: JSONRPCServerAndClient) {
  if (!currentUser?.userId) {
    throw new Error('Token have no userId set !')
  }

  // Bits
  serverAndClient.addMethod('bitsGetLeaderboard', (data) => twitchApiInstance?.bits.getLeaderboard(data))
  serverAndClient.addMethod('bitsGetCheermotes', ({channel}) => twitchApiInstance?.bits.getCheermotes(channel))

  // Channel
  serverAndClient.addMethod('channelGetChannelEditors', () => twitchApiInstance?.channels.getChannelEditors(currentUser.userId as string))
  serverAndClient.addMethod('channelUpdateTitle', ({title}) => twitchApiInstance?.channels.updateChannelInfo(currentUser.userId as string, {title}))
  serverAndClient.addMethod('channelUpdateGame', async ({game}) => {
    const gameObj = await twitchApiInstance.games.getGameByName(game)
    return await twitchApiInstance.channels.updateChannelInfo(
      currentUser.userId as string,
      {
        gameId: gameObj?.id || game
      }
    )
  })
  serverAndClient.addMethod('channelUpdateLanguage', ({language}) => twitchApiInstance?.channels.updateChannelInfo(currentUser.userId as string, {language}))
  serverAndClient.addMethod('channelStartCommercial', ({duration}) => twitchApiInstance?.channels.startChannelCommercial(currentUser.userId as string, duration))

  // ChannelPointsApi
  serverAndClient.addMethod('channelPointsGetCustomRewards', ({onlyManageable}) => twitchApiInstance?.channelPoints.getCustomRewards(currentUser.userId as string, onlyManageable))
  serverAndClient.addMethod('channelPointsGetCustomRewardsByIds', ({rewardIds}) => twitchApiInstance?.channelPoints.getCustomRewardsByIds(currentUser.userId as string, rewardIds))
  serverAndClient.addMethod('channelPointsGetCustomRewardById', ({rewardId}) => twitchApiInstance?.channelPoints.getCustomRewardById(currentUser.userId as string, rewardId))
  serverAndClient.addMethod('channelPointsCreateCustomReward', ({rewardData}) => twitchApiInstance?.channelPoints.createCustomReward(currentUser.userId as string, rewardData))
  serverAndClient.addMethod('channelPointsUpdateCustomReward', ({
                                                                  rewardId,
                                                                  rewardData
                                                                }) => twitchApiInstance?.channelPoints.updateCustomReward(currentUser.userId as string, rewardId, rewardData))
  serverAndClient.addMethod('channelPointsDeleteCustomReward', ({rewardId}) => twitchApiInstance?.channelPoints.deleteCustomReward(currentUser.userId as string, rewardId))
  serverAndClient.addMethod('channelPointsGetRedemptionsByIds', ({
                                                                   rewardId,
                                                                   redemptionIds
                                                                 }) => twitchApiInstance?.channelPoints.getRedemptionsByIds(currentUser.userId as string, rewardId, redemptionIds))
  serverAndClient.addMethod('channelPointsGetRedemptionById', ({
                                                                 rewardId,
                                                                 redemptionIds
                                                               }) => twitchApiInstance?.channelPoints.getRedemptionById(currentUser.userId as string, rewardId, redemptionIds))
  serverAndClient.addMethod('channelPointsGetRedemptionsForBroadcaster', ({
                                                                            rewardId,
                                                                            status,
                                                                            filter
                                                                          }) => twitchApiInstance?.channelPoints.getRedemptionsForBroadcaster(currentUser.userId as string, rewardId, status, filter))
  serverAndClient.addMethod('channelPointsGetRedemptionsForBroadcasterPaginated', ({
                                                                                     rewardId,
                                                                                     status,
                                                                                     filter
                                                                                   }) => twitchApiInstance?.channelPoints.getRedemptionsForBroadcasterPaginated(currentUser.userId as string, rewardId, status, filter))
  serverAndClient.addMethod('channelPointsUpdateRedemptionStatusByIds', ({
                                                                           rewardId,
                                                                           redemptionIds,
                                                                           status
                                                                         }) => twitchApiInstance?.channelPoints.updateRedemptionStatusByIds(currentUser.userId as string, rewardId, redemptionIds, status))

  // CLip
  serverAndClient.addMethod('clipGetClipsForBroadcaster', ({filter}) => twitchApiInstance?.clips.getClipsForBroadcaster(currentUser.userId as string, filter))
  serverAndClient.addMethod('getClipsForBroadcasterPaginated', ({filter}) => twitchApiInstance?.clips.getClipsForBroadcasterPaginated(currentUser.userId as string, filter))
  serverAndClient.addMethod('getClipsForGame', ({
                                                  gameId,
                                                  filter
                                                }) => twitchApiInstance?.clips.getClipsForGame(gameId, filter))
  serverAndClient.addMethod('getClipsForGamePaginated', ({
                                                           gameId,
                                                           filter
                                                         }) => twitchApiInstance?.clips.getClipsForGamePaginated(gameId, filter))
  serverAndClient.addMethod('getClipsByIds', ({ids}) => twitchApiInstance?.clips.getClipsByIds(ids))
  serverAndClient.addMethod('getClipById', ({id}) => twitchApiInstance?.clips.getClipById(id))
  serverAndClient.addMethod('createClip', ({createAfterDelay}) => twitchApiInstance?.clips.createClip({
    channel: currentUser.userId as string,
    createAfterDelay
  }))

  // Users
  serverAndClient.addMethod('usersGetUserByName', async ({user}) => {
    const data = await twitchApiInstance.users.getUserByName(user)

    if (!data) {
      throw new Error('UnknowUser')
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      broadcasterType: data.broadcasterType,
      creationDate: data.creationDate,
      description: data.description,
      displayName: data.displayName,
      offlinePlaceholderUrl: data.offlinePlaceholderUrl,
      profilePictureUrl: data.profilePictureUrl,
    }
  })

}