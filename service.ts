import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  useTrackPlayerEvents,
  Event,
} from "react-native-track-player";
import {ToastAndroid} from "react-native"
export default async function () {
  TrackPlayer.updateOptions({
    // Media controls capabilities
    capabilities: [Capability.Play, Capability.Pause,  Capability.SeekTo ,Capability.SkipToNext , Capability.SkipToPrevious ],
    android: {
      // This is the default behavior
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
    },
  });


  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => TrackPlayer.seekTo(event.position));
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    ToastAndroid.show(`انت تقوم الأن بالأستماع الي سوره : ${event.track?.title}`, ToastAndroid.SHORT);
  });


}
