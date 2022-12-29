import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
  Pressable
} from "react-native";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewShot,{ captureRef} from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export default function App() {
  const ref = useRef();
  const [state, setState] = useState('"....... -Loading');
  const [isPressed, setPressed] = useState(false);
  const image = { uri: null };
  const [imageURL, setImageURL] = useState(image);
  const [favs, setFavs] = useState(new Array());
  const [modalVisible, setModalVisible] = useState(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  // ...rest of the code remains same

  if (status === null) {
    requestPermission();
  }

  useEffect(() => {
    GetQuote();
    GetImage();
  }, [isPressed]);

  const AddToFavs = async () => {
    try {
      await AsyncStorage.setItem("@Favs", JSON.stringify(favs));
    } catch (error) {
      Alert.alert("Favorites", error);  
    }
  }

  const SaveToCameraRoll = async () => {
    try {
      const localUri = await captureRef(ref, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        Alert.alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const shareData = async () => {
    try {
      const localUri = await captureRef(ref, {
        height: 440,
        quality: 1,
      });
      await Sharing.shareAsync(localUri)
    }
    catch (error)
    {
      console.log(error)
    }
    
  };

  const GetData = async () => {
    try
    {
      let res = await AsyncStorage.getItem("@Favs")
      if (res !== null)
      {
        setFavs(() => { return [...JSON.parse(res)] })
      }
    }
    catch(error)
    {
      Alert.alert("Error", error);
    }
  }

  const ShowData = () => {
    let temp = new Set(favs) 
    let res = new Array(temp)
      return favs.map((e) => { return <Text style={styles.modalText}>{e}</Text> })
    }

  function GetImage() {
    fetch(
      "https://random.imagecdn.app/v1/image?width=600&height=800&category=buildings&format=json"
    )
      .then((res) => res.json())
      .then((response) => setImageURL({ uri: response.url }))
      .catch((error) => console.log(error));
  }
  function GetQuote() {
    const options = {
      method: "POST",
      url: "https://motivational-quotes1.p.rapidapi.com/motivation",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "444eb183efmsh1098daddc12e592p13f705jsn7256a7f6fd57",
        "X-RapidAPI-Host": "motivational-quotes1.p.rapidapi.com",
      },
      data: '{"key1":"value","key2":"value"}',
    };

    axios
      .request(options)
      .then(function (response) {
        setState(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  let sec = new Date().getSeconds();
  return (
    <View style={styles.container}>
      <ViewShot
      ref={ref}
      options={{
      fileName: `${state.split("-")[state.split("-").length - 1]}_sec`, // screenshot image name
      format: 'jpg', // image extention
      quality: 0.9 // image quality
        }} >
        



      <View style={styles.top}>
      <Text style={styles.name}>
        {state.split("-")[state.split("-").length - 1] != "null"
          ? state.split("-")[state.split("-").length - 1]
          : "Unknown"}
      </Text>
          <TouchableOpacity>
          
          <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
                  {ShowData()}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
              onPress={() => { setModalVisible(true); GetData(); }}
      >
        <Text style={styles.textStyle}>Favorites</Text>
      </Pressable>
          
          </TouchableOpacity>

        </View>
        <TouchableHighlight>
      <View style={[
          styles.display,
          {
            shadowOffset: {
              width: 20,
              height: -30
            },
            shadowOpacity: 25,
            shadowRadius: 10,
            
          }
          ]}>
          <ImageBackground
            source={imageURL}
            resizeMode="cover"
              style={styles.image}
          >
            <Text style={[styles.mark, {textShadowColor: 'rgba(0, 0, 0, 1)',
                textShadowOffset: { width: 5, height: 1 },
                textShadowRadius: 10,}]}>{state.slice(0, 1)}</Text>
            <AutoSizeText
              fontSize={70}
              numberOfLines={7}
              mode={ResizeTextMode.max_lines}
              style={[styles.quote, {
                textShadowColor: 'rgba(0, 0, 0, 1)',
                textShadowOffset: { width: 5, height: 1 },
                textShadowRadius: 10,
              }]}
                onPress={() => {setPressed((prev) => !prev)}}
            >
              {state.slice(
                1,
                state.length -
                  state.split("-")[state.split("-").length - 1].length -
                  3
              )}
              </AutoSizeText>
              



            <View style={styles.refresh}>
              <Icon
              style={[styles.quote, {fontSize: 35}]}
              raised
              name='share-alt'
              type='font-awesome'
              color='white'
              onPress={shareData}  />
            </View>
            <View style={styles.screenshot}>
              <Icon
                style={[styles.quote, {fontSize:40}]}
              raised
              name='heart-o'
              type='font-awesome'
              color='#f50'
                  onPress={() => { setFavs((prev) => { return [...prev, state]; }); AddToFavs(); }} />
              </View>
              <View style={styles.share}>
              <Icon
                style={[styles.quote, {fontSize:35}]}
              raised
              name='cloud-download'
              type='font-awesome'
              color='#f50'
              onPress={SaveToCameraRoll} />
              </View>
              <StatusBar style="auto" />
            
          </ImageBackground>
        </View>
        </TouchableHighlight>


        </ViewShot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    maxWidth: "100%",
    minHeight: "100%",
    maxHeight: "100%",
  },
  display: {
    backgroundColor: "#fff",
    height: "80%",
    alignSelf: 'center',
    marginVertical: 20,
    minWidth: "95%",
    maxWidth: "95%",
    minHeight: "90%",
    maxHeight: "90%",
    shadowColor: "white",
    elevation: 20,
  },
  name: {
    color: "#fff",
    fontSize: 15,
    marginRight: 70,
  },
  top:
  {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    },
  image: {
    justifyContent: "center",
    height: "100%",
    minWidth: "100%",
    width: "100%",
  },
  refresh: {
    flexDirection: "row",
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 60,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  share: {
    flexDirection: "row",
    justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
    bottom: 40,
    right: 60,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  screenshot: {
    flexDirection: "row",
    justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
    bottom: 20,
    left: 145,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderRadius: 70,
    height: 75,
    textAlign: 'center',
  },
  quote: {
    fontSize: 50,
    color: "#fff",
    marginHorizontal: 20,
    alignSelf: "center",
  },
  mark: {
    fontSize: 150,
    color: "#fff",
    marginHorizontal: 20,
    alignSelf: "flex-start",
    position: "absolute", //Here is the trick
    top: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F00",
    marginEnd: 10,
  },
  buttonClose: {
    backgroundColor: "#F00",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  }
});
