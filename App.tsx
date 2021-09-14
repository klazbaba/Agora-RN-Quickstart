import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';

import requestCameraAndAudioPermission from './components/Permission';
import styles from './components/Style';
import { constants } from './constants';

interface Props {}

/**
 * @property peerIds Array for storing connected peers
 * @property appId
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 */
interface State {
  appId: string;
  token: string;
  channelName: string;
  joinSucceed: boolean;
  peerIds: number[];
}

export default function App() {
  let _engine: RtcEngine | undefined;
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([] as number[]);

  if (Platform.OS === 'android') {
    // Request required permissions from Android
    requestCameraAndAudioPermission().then(() => {
      console.log('requested!');
    });
  }

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    _engine = await RtcEngine.create(constants.APP_ID);
    await _engine.enableVideo();

    _engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    _engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    _engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        // Add peer ID to state array
        setPeerIds([...peerIds, uid]);
      }
    });

    _engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      // Remove peer ID from state array
      setPeerIds(peerIds.filter((id) => id !== uid));
    });

    // If Local user joins RTC channel
    _engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      setJoinSucceed(true);
    });
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  const startCall = async () => {
    // Join Channel using null token and channel name
    await _engine?.joinChannel(
      constants.TOKEN,
      constants.CHANNEL_NAME,
      null,
      0
    );
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  const endCall = async () => {
    await _engine?.leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
  };

  const _renderVideos = () => {
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={constants.CHANNEL_NAME}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  };

  const _renderRemoteVideos = () => {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal={true}
      >
        {peerIds.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={constants.CHANNEL_NAME}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={startCall} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        {_renderVideos()}
      </View>
    </View>
  );
}
