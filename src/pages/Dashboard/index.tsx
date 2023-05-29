import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';
import { ModalPickerTable } from '../../components/ModalPicker';
import { Footer } from '../../components/Footer';

export type TableProps = {
  id: string | undefined;
  number: string | undefined;
  status: boolean | undefined;
  close_bill: boolean | undefined;
  call_waiter: boolean | undefined;
}

export default function Dashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const [tables, setTables] = useState<TableProps[] | []>([]);
  const [tableSelected, setTableSelected] = useState<TableProps | undefined>();
  const [modalTableVisible, setModalTableVisible] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    async function getCategories() {
      const response = await api.get('/tables');
      response.data = response.data.filter((item: { status: boolean; }) => item.status === true);
      setTables(response.data);
      setTableSelected(response.data[0]);
    }

    getCategories();
  }, []);

  function handleChangeTable(item: TableProps) {
    setTableSelected(item);
  }

  async function openOrder() {

    await api.post('/order', {
      table_id: tableSelected?.id,
      name: name
    }).then((response) => {
      navigation.navigate('Order', { table: tableSelected?.number, order_id: response.data.id });
      setTableSelected(tables[0]);
      setName('');
    }).catch((error) => {
      const regex = new RegExp("('(.*?)')");
      const resultado = regex.exec(error.response.data.error) || [];
      Alert.alert('Erro', resultado[0]?.replaceAll("'", ""));
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Feather
          style={styles.goBack}
          name='arrow-left'
          size={35}
          onPress={() => navigation.goBack()}
          title="Voltar"
          color="#FF3F4B"
        />
      </View>
      <ScrollView>
        <View style={styles.containerContent}>
          <Text style={styles.title}>Novo pedido</Text>
          {
            tables.length !== 0 && (
              <TouchableOpacity
                style={styles.input}
                onPress={() => setModalTableVisible(true)}>
                <View style={styles.inputContent}>
                  <Text style={{ color: '#FFF', marginTop: '1%', fontSize: 16 }}>
                    Mesa {tableSelected?.number}
                  </Text>
                  <Feather name="chevron-down" size={28} color="#FFF" />
                </View>
              </TouchableOpacity>
            )
          }
          <TextInput
            style={[styles.input, { width: '90%', fontSize: 16, marginTop: 16 }]}
            placeholderTextColor="#F0F0F0"
            placeholder='Informe o nome do cliente'
            value={name}
            onChangeText={setName} />
          <TouchableOpacity
            style={styles.button}
            onPress={openOrder}>
            <Text style={styles.buttonText}>Abrir Mesa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
      <Modal
        transparent={true}
        visible={modalTableVisible}
        animationType="fade">
        <ModalPickerTable
          handleCloseModal={() => setModalTableVisible(false)}
          options={tables}
          selectedItem={handleChangeTable} />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '5%',
    alignItems: 'center'
  },

  goBack: {
    marginRight: '10%'
  },

  container: {
    flex: 1,
    backgroundColor: '#1d1d2e',
  },

  containerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '40%',
  },

  inputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginTop: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 24
  },

  input: {
    width: '90%',
    height: 40,
    backgroundColor: '#101026',
    borderRadius: 10,
    paddingHorizontal: 8,
    fontSize: 22,
    color: '#FFF'
  },

  button: {
    width: '90%',
    height: 40,
    backgroundColor: '#3FFFA3',
    borderRadius: 10,
    marginVertical: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    fontSize: 18,
    color: '#101026',
    fontWeight: 'bold'
  }
})