import React, { useState } from "react"
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from 'react-native-video';

const VideoPage = () => {
  const player = useVideoPlayer(
    'https://www.w3schools.com/html/mov_bbb.mp4',
    (_player) => {
      _player.play();
    }
  );
  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.videoContainer}
        controls
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9
  }
})

export default VideoPage
