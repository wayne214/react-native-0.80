import React, { useState } from "react"
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from 'react-native-video';

const VideoPage = () => {

  const HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  const MP4 =
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_30MB.mp4';
  /**
   * 一些测试地址;
   * https://www.w3schools.com/html/mov_bbb.mp4
   * https://www.w3schools.com/html/movie.mp4
   * https://media.w3.org/2010/05/sintel/trailer.mp4
   * https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
   *
   * const HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
   *   const MP4 =
   *     'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_30MB.mp4';
   * */
  const player = useVideoPlayer(
    'https://www.w3schools.com/html/movie.mp4',
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
