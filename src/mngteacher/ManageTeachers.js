import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../FirebaseConfig'
import { StackActions } from '@react-navigation/native'

const pushAction = (email) => StackActions.push('EditTeacher',
 {email: email})
 

const ManageTeachers = ({ navigation }) => {
  const [listStudents, setlistStudents] = useState([])

  const getStudents = async () => {
    const db = firebase.firestore()
    const studentRef = db.collection('users');
    const snapshot = await studentRef.where('role','==',1).get();
    if (snapshot.empty) {
      console.log('No matching documents...');
      return;
    }
    const allStudent = snapshot.docs.map(doc => doc.data());
    
    setlistStudents(allStudent)
  }


  const deleteStudent = (studentName) => {
    const db = firebase.firestore()
    let docID = db.collection('class').where('name', '==', studentName).get()
      .then((snapshot) => {
        snapshot.forEach((doc) =>{
          docID = doc.id
          db.collection("class").doc(docID).delete().then(() => {
            console.log("Document successfully deleted!"+docID);
            alert("Class successfully deleted: "+studentName);
          }).catch((error) => {
            console.error("Error removing document: ", error);
          });
        })
      }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }
  useEffect(() => {
    getStudents();
  }, [])
  useEffect(() => {
    getStudents();
    
  })
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, margin: 10 }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Teachers</Text>
        <View style={{ flex: 1, borderWidth: 1 }}>
          <FlatList
            data={listStudents}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.item,
                ]}>
                <Text style={styles.itemname}>{item.email}</Text>
                <TouchableOpacity
                  style={styles.itemTouchableOpacicty}
                  onPress={() => navigation.dispatch(pushAction(item.email))}
                  >
                  <Image source={require('../../assets/icon/edit.png')}
                    style={styles.itemTouchableOpacictyIcon} />

                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.itemTouchableOpacicty}
                  onPress={() => deleteStudent(item.email)}
                >
                  <Image source={require('../../assets/icon/bin.png')}
                    style={styles.itemTouchableOpacictyIcon} />

                </TouchableOpacity> */}
              </View>
            )}
          />
        </View>

      </View>
      
    </View>

  )
}

export default ManageTeachers

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'white',
    padding: 10,
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',

  },
  itemname: {
    flexGrow: 1,
    fontSize: 24
  },
  itemTouchableOpacicty: {
    flexShrink: 0,
    alignContent: 'flex-end',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  itemTouchableOpacictyIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  }
})