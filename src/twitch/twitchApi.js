export async function twitchApiRegister (twitchApiInstance, currentUser, serverAndClient) {

  // Bits
  serverAndClient.addMethod('bitsGetLeaderboard', (data) => twitchApiInstance?.bits.getLeaderboard(data))
  serverAndClient.addMethod('bitsGetCheermotes', ({ channel }) => twitchApiInstance?.bits.getCheermotes(channel))

  // Channel
  serverAndClient.addMethod('channelGetChannelEditors', () => twitchApiInstance?.channels.getChannelEditors(currentUser.userId))
  serverAndClient.addMethod('channelUpdateTitle', ({ title }) => twitchApiInstance?.channels.updateChannelInfo(currentUser.userId, { title }))
  serverAndClient.addMethod('channelUpdateGame', async ({ game }) => {
    const gameObj = await twitchApiInstance.games.getGameByName(game)
    return await twitchApiInstance.channels.updateChannelInfo(
      currentUser.userId,
      {
        gameId: gameObj?.id || game
      }
    )
  })
  serverAndClient.addMethod('channelUpdateLanguage', ({ language }) => twitchApiInstance?.channels.updateChannelInfo(currentUser.userId, { language }))
  serverAndClient.addMethod('channelStartCommercial', ({ duration }) => twitchApiInstance?.channels.startChannelCommercial(currentUser.userId, duration))

  // ChannelPointsApi
  serverAndClient.addMethod('channelPointsGetCustomRewards', ({ onlyManageable }) => twitchApiInstance?.channelPoints.getCustomRewards(currentUser.userId, onlyManageable))
  serverAndClient.addMethod('channelPointsGetCustomRewardsByIds', ({ rewardIds }) => twitchApiInstance?.channelPoints.getCustomRewardsByIds(currentUser.userId, rewardIds))
  serverAndClient.addMethod('channelPointsGetCustomRewardById', ({ rewardId }) => twitchApiInstance?.channelPoints.getCustomRewardById(currentUser.userId, rewardId))
  serverAndClient.addMethod('channelPointsCreateCustomReward', ({ rewardData }) => twitchApiInstance?.channelPoints.createCustomReward(currentUser.userId, rewardData))
  serverAndClient.addMethod('channelPointsUpdateCustomReward', ({
    rewardId,
    rewardData
  }) => twitchApiInstance?.channelPoints.updateCustomReward(currentUser.userId, rewardId, rewardData))
  serverAndClient.addMethod('channelPointsDeleteCustomReward', ({ rewardId }) => twitchApiInstance?.channelPoints.deleteCustomReward(currentUser.userId, rewardId))
  serverAndClient.addMethod('channelPointsGetRedemptionsByIds', ({
    rewardId,
    redemptionIds
  }) => twitchApiInstance?.channelPoints.getRedemptionsByIds(currentUser.userId, rewardId, redemptionIds))
  serverAndClient.addMethod('channelPointsGetRedemptionById', ({
    rewardId,
    redemptionIds
  }) => twitchApiInstance?.channelPoints.getRedemptionById(currentUser.userId, rewardId, redemptionIds))
  serverAndClient.addMethod('channelPointsGetRedemptionsForBroadcaster', ({
    rewardId,
    status,
    filter
  }) => twitchApiInstance?.channelPoints.getRedemptionsForBroadcaster(currentUser.userId, rewardId, status, filter))
  serverAndClient.addMethod('channelPointsGetRedemptionsForBroadcasterPaginated', ({
    rewardId,
    status,
    filter
  }) => twitchApiInstance?.channelPoints.getRedemptionsForBroadcasterPaginated(currentUser.userId, rewardId, status, filter))
  serverAndClient.addMethod('channelPointsUpdateRedemptionStatusByIds', ({
    rewardId,
    redemptionIds,
    status
  }) => twitchApiInstance?.channelPoints.updateRedemptionStatusByIds(currentUser.userId, rewardId, redemptionIds, status))

  // CLip
  serverAndClient.addMethod('clipGetClipsForBroadcaster', ({ filter }) => twitchApiInstance?.clips.getClipsForBroadcaster(currentUser.userId, filter))
  serverAndClient.addMethod('getClipsForBroadcasterPaginated', ({ filter }) => twitchApiInstance?.clips.getClipsForBroadcasterPaginated(currentUser.userId, filter))
  serverAndClient.addMethod('getClipsForGame', ({
    gameId,
    filter
  }) => twitchApiInstance?.clips.getClipsForGame(gameId, filter))
  serverAndClient.addMethod('getClipsForGamePaginated', ({
    gameId,
    filter
  }) => twitchApiInstance?.clips.getClipsForGamePaginated(gameId, filter))
  serverAndClient.addMethod('getClipsByIds', ({ ids }) => twitchApiInstance?.clips.getClipsByIds(ids))
  serverAndClient.addMethod('getClipById', ({ id }) => twitchApiInstance?.clips.getClipById(id))
  serverAndClient.addMethod('createClip', ({ createAfterDelay }) => twitchApiInstance?.clips.createClip({
    channelId: currentUser.userId,
    createAfterDelay
  }))

  // Users
  serverAndClient.addMethod('usersGetUserByName', async ({ user }) => {
    const data = await twitchApiInstance.users.getUserByName(user)
    return {
      broadcasterType: data.broadcasterType,
      creationDate: data.creationDate,
      description: data.description,
      displayName: data.displayName,
      id: data.id,
      name: data.name,
      offlinePlaceholderUrl: data.offlinePlaceholderUrl,
      profilePictureUrl: data.profilePictureUrl,
      type: data.type,
      views: data.views
    }
  })

}