import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useFonts,
  Cairo_200ExtraLight,
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_800ExtraBold,
  Cairo_900Black,
} from "@expo-google-fonts/cairo";
import colors from "./colors";
import LottieView from "lottie-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRef, useMemo, useState, useEffect } from "react";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetFlashList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";
import { FlashList } from "@shopify/flash-list";

export default function App() {
  let [fontsLoaded] = useFonts({
    Cairo_200ExtraLight,
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    Cairo_900Black,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const initialSnapPoints = useMemo(() => ["30%", "60%"], []);
  const [SearchQuery, setSearchQuery] = useState();
  const [Data, SetData] = useState<[{ name: string; identifier: string }]>(
    require("./Quran_translated.json")
  );
  const [ReaderName, SetReaderName] = useState("ar.abdulbasitmujawwad");
  const [Reload, SetReload] = useState(false);

  async function GetReaderName() {
    const value =
      (await AsyncStorage.getItem("ReaderName")) || "ar.abdulbasitmujawwad";
    SetReaderName(value);
  }

  async function NewReaderName(Value: string) {
    SetReaderName(Value);
    await AsyncStorage.setItem("ReaderName", Value);
    SetReload(!Reload);
  }

  useEffect(() => {
    GetReaderName();
  }, []);

  const handleSearch = (char: any) => {
    setSearchQuery(char);
    const smallChar = char.toLowerCase();

    const filteredValues = require("./Quran_translated.json").filter(
      (value: { name: string }) => value.name.toLowerCase().includes(smallChar)
    );
    SetData(filteredValues);
    if (char.length == 0) {
      SetData(require("./Quran_translated.json"));
    }
  };

  function findObjectById(array: any[], id: any) {
    return array.find((item) => item.identifier === id);
  }

  function CreateArray() {
    let Array: {
      id: any;
      artist: any;
      url: string;
      title: string;
      artwork: string;
    }[] = [];
    const Data = require("./en.json");
    Data.forEach((element: { name: any; id: any }) => {
      Array.push({
        id: element.id,
        url: `https://cdn.islamic.network/quran/audio-surah/128/${ReaderName}/${element.id}.mp3`,
        title: element.name,
        artist: findObjectById(require("./Quran_translated.json"), ReaderName)
          .name,
        artwork: "https://i.ibb.co/d01zcSP5/icon.png",
      });
    });
    return Array;
  }

  const playAudioFromUrl = async (id: any) => {
    const surahs = CreateArray();
    try {
      await TrackPlayer.setupPlayer();
    } catch (error) {
      console.log(error);
    } finally {
      await TrackPlayer.reset(); // إزالة أي مقاطع صوتية سابقة

      await TrackPlayer.add(surahs); // تحميل جميع السور دفعة واحدة

      // 🔥 تحديد السورة التي سيتم البدء بها بناءً على ID
      const startIndex = surahs.findIndex((surah) => surah.id === id);
      if (startIndex !== -1) {
        await TrackPlayer.skip(startIndex); // الانتقال إلى السورة المطلوبة
      }

      await TrackPlayer.play(); // تشغيل الصوت
    }
  };

  const playRadio = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (error) {
      console.log(error);
    } finally {
      await TrackPlayer.reset(); // إزالة أي مقاطع صوتية سابقة

        // إضافة التراك من رابط البث المباشر
        await TrackPlayer.add([{
          id: 'quran',
          url: 'https://stream.radiojar.com/8s5u5tpdtwzuv', // رابط البث المباشر للإذاعة
          title: 'إذاعة القرآن الكريم',
          artist: 'القرآن الكريم',
          artwork: 'https://upload.wikimedia.org/wikipedia/ar/3/34/%D8%A5%D8%B0%D8%A7%D8%B9%D8%A9_%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86_%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85_%D9%85%D9%86_%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9.png', // صورة للأعمال الفنية
        }]);


      await TrackPlayer.play(); // تشغيل الصوت
    }
  };

  if (!fontsLoaded) {
    <View style={{ backgroundColor: colors.background }}>
      <LottieView
        speed={0.5}
        style={{ height: "50%", width: "50%" }}
        source={require("./assets/Json/1740565699490.json")}
        autoPlay
        loop
      />
    </View>;
  } else {
    return (
      <GestureHandlerRootView style={styles.container}>
        <FlashList
          extraData={!Reload}
          numColumns={2}
          ListHeaderComponent={
            <View style={{flexDirection : "row" , justifyContent : "space-around"}}><Pressable
            style={{
              width: "80%",
              height: 90,
              backgroundColor: colors.onBackground,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}
          >
            <View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontFamily: "Cairo_500Medium",
                  textAlign: "center",
                }}
              >
                {
                  findObjectById(
                    require("./Quran_translated.json"),
                    ReaderName
                  ).name
                }
              </Text>
              <Text
                style={{
                  color: colors.text + "80",
                  fontSize: 18,
                  fontFamily: "Cairo_300Light",
                  textAlign: "center",
                }}
              >
                اضغط لعرض قائمة القارئين.
              </Text>
            </View>
          </Pressable>
          <Pressable
              style={{
                width: "15%",
                height: 90,
                backgroundColor: colors.onBackground,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
              onPress={() => {
                playRadio();
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontFamily: "Cairo_500Medium",
                    textAlign: "center",
                  }}
                >
                  📻
                </Text>
                
              </View>
            </Pressable>
          
          
          </View>
          }
          data={require("./en.json")}
          renderItem={({ item }: any) => (
            <Pressable
              style={{
                width: "95%",
                height: 90,
                backgroundColor: colors.onBackground,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
              onPress={() => {
                playAudioFromUrl(item.id);
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontFamily: "Cairo_500Medium",
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </Pressable>
          )}
          estimatedItemSize={200}
        />

        <BottomSheetModalProvider>
          <BottomSheetModal
            containerStyle={{ backgroundColor: colors.text + "20" }}
            backgroundStyle={{ backgroundColor: colors.background }}
            snapPoints={initialSnapPoints}
            ref={bottomSheetModalRef}
            style={{ padding: 10 }}
          >
            <BottomSheetFlashList
              data={Data}
              extraData={!Reload}
              numColumns={2}
              ListHeaderComponent={
                <BottomSheetTextInput
                  style={{
                    backgroundColor: colors.onBackground,
                    padding: 12,
                    borderRadius: 12,
                    fontFamily: "Cairo_500Medium",
                    marginBottom: 8,
                    color: colors.text,
                  }}
                  placeholder="أبحث عن اسم القارئ المفضل لديك"
                  value={SearchQuery}
                  onChangeText={handleSearch}
                  placeholderTextColor={colors.text + "80"}
                />
              }
              renderItem={({ item }: any) => (
                <Pressable
                  style={{
                    width: "95%",
                    height: 90,
                    backgroundColor: colors.onBackground,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                    borderWidth: item.identifier == ReaderName ? 1 : 0,
                    borderBlockColor: "white",
                  }}
                  onPress={() => {
                    NewReaderName(item.identifier);
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 16,
                        fontFamily: "Cairo_500Medium",
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              )}
              estimatedItemSize={50}
            />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
