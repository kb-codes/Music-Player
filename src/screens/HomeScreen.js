import React, {useRef, useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StatusBar,
} from 'react-native';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import LottieView from 'lottie-react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import songs from '../constants/songs';

const width = Dimensions.get('window').width;

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(songs);
};

const togglePlayBack = async playbackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack != null) {
    if (playbackState == State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};
const HomeScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const [songIndex, setSongIndex] = useState(0);

  const playbackState = usePlaybackState();
  const progress = useProgress();
  const songSlider = useRef(null);
  const spinValue = new Animated.Value(0);

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  const skipToPrev = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  useEffect(() => {
    setupPlayer();

    scrollX.addListener(({value}) => {
      const index = Math.round(value / width);
      skipTo(index);
      setSongIndex(index);
    });
    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();
  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderItem = ({item}) => {
    return (
      <Animated.View style={{width: width}}>
        <Animated.View
          style={{
            alignSelf: 'center',
          }}>
          <Image
            source={item.poster}
            style={{
              width: width - 60,
              height: width * 1.2,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#2a374d',
            }}
          />
        </Animated.View>
      </Animated.View>
    );
  };
  return (
    <ImageBackground
      source={songs[songIndex].poster}
      // colors={['#7221ff', '#219fff', '#a221ff']}
      // start={{x: 1, y: 0}}
      // end={{x: 0, y: 1}}
      style={styles.container}>
      <StatusBar hidden />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}>
        <View style={{alignItems: 'center', marginTop: 40}}>
          <View style={{height: width * 1.2}}>
            <Animated.FlatList
              ref={songSlider}
              data={songs}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              scrollEventThrottle={16}
              renderItem={renderItem}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {x: scrollX},
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
            />
          </View>

          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
              {songs[songIndex].title}
            </Text>
            <Text style={{fontSize: 15, color: '#bfd3f2'}}>
              {songs[songIndex].artist}
            </Text>
          </View>

          <View style={{marginHorizontal: 60}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 60,
              }}>
              <TouchableOpacity onPress={skipToPrev}>
                <AntDesign name="banckward" color="white" size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  togglePlayBack(playbackState);
                }}>
                <Entypo
                  name={
                    playbackState == State.Playing
                      ? 'controller-paus'
                      : 'controller-play'
                  }
                  color="white"
                  size={50}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={skipToNext}>
                <AntDesign name="forward" color="white" size={25} />
              </TouchableOpacity>
            </View>
            <Slider
              style={{
                width: width - 60,
                height: 40,
              }}
              minimumValue={0}
              maximumValue={progress.duration}
              minimumTrackTintColor="#FFF"
              maximumTrackTintColor="#FFF"
              thumbTintColor="#FFF"
              value={progress.position}
              onSlidingComplete={async value => {
                await TrackPlayer.seekTo(value);
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>
                {new Date(progress.position * 1000).toISOString().substr(14, 5)}
              </Text>
              <Text style={{color: 'white'}}>
                {new Date((progress.duration - progress.position) * 1000)
                  .toISOString()
                  .substr(14, 5)}
              </Text>
            </View>
            {playbackState == State.Playing && (
              <LottieView
                source={require('../constants/audio-playing.json')}
                autoPlay
                loop
                style={{height: 100, alignSelf: 'center'}}
              />
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    borderColor: '#1E7EB9',
    borderWidth: 1,
  },
  thumb: {
    width: 20,
    height: 25,
    borderRadius: 4,
    backgroundColor: '#22C2FF',
  },
});
