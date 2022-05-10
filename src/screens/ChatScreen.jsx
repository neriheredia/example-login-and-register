import React, { useLayoutEffect, useState, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
import { Avatar } from "react-native-elements";
import { addNewColection, auth, db, getAllDocs } from "../settings/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const getAllDocs = async () => {
      try {
        const result = await getDocs(collection(db, "chat"));
        const resp = result.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }));
        setMessages(resp.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.log(error.message);
      }
    };
    getAllDocs();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, user, text, createdAt } = messages[0];
    addNewColection({ _id, user, text, createdAt });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 30,
          }}
          onPress={logout}
        >
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL,
      }}
    />
  );
};

export default ChatScreen;
