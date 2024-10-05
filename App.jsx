import { StatusBar } from 'expo-status-bar';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import app from './firebaseConfig';

export default function App() {

  const [todoList, setTodoList] = useState([]);
  const [inputText, setInputText] = useState('');

  const db = getFirestore(app);

  const fetchTasks = () => {
    const ref = collection(db, 'tasks');
    getDocs(ref).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(data);
      setTodoList(data);
      // setLoading(false);
    });
  }

  const addNewTask = async () => {
    const newTask = { text: inputText, completed: false };
    setInputText('');
    // setTodoList([...todoList, newTask]);

    const ref = collection(db, 'tasks');
    const res = await addDoc(ref, newTask);
    console.log(res);

    fetchTasks();

    Keyboard.dismiss();
  }

  useEffect(() => {
    fetchTasks();
  }, [])


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TextInput mode="outlined" onChangeText={setInputText} value={inputText} />
      <Button onPress={addNewTask} style={{ marginTop: 10 }} mode="contained">Add</Button>
      <Button onPress={fetchTasks} style={{ marginTop: 10 }} mode="outlined">Refresh</Button>

      <ScrollView>
        {
          todoList.map((item, index) => {
            return <View key={index} style={styles.taskCard}>
              <Checkbox checked={item.completed} />
              <Text style={styles.taskText}>{item.text}</Text>
            </View>
          })
        }
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 50,
  },
  taskCard: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
