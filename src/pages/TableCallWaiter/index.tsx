import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';
import { ModalPickerTable } from '../../components/ModalPicker';
import { TableProps } from '../Dashboard';
import Switch from '../../components/Switch';
import { Footer } from '../../components/Footer';

type RouteDetailParams = {
    TableCallWaiter: {
        tables: TableProps[] | [];
    }
}

type TableRouteProps = RouteProp<RouteDetailParams, 'TableCallWaiter'>;

export default function TableCallWaiter() {
    const route = useRoute<TableRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [tables, setTables] = useState<TableProps[] | []>(route.params.tables);
    const [tableSelected, setTableSelected] = useState<TableProps | undefined>();
    const [modalTableVisible, setModalTableVisible] = useState(false);
    const [searchTable, setSearchTable] = useState(true);

    setTimeout(async function () {
        if (tables.length === 0) {
            navigation.navigate('Options');
        }
    }, 50);

    async function handleCallWaiter() {
        const data: TableProps = {
            id: tableSelected?.id,
            number: undefined,
            status: undefined,
            close_bill: undefined,
            call_waiter: !tableSelected?.call_waiter
        }

        setTableSelected(data);

        await api.put('/table/update', {
            table_id: tableSelected?.id,
            type: 'call_waiter',
            disable: tableSelected?.call_waiter
        });

        setSearchTable(!searchTable);
    }

    useEffect(() => {
        async function getTablesNotification() {
            const response = await api.get('/tables/call_waiter');
            setTables(response.data);
            setTableSelected(response.data[0]);
            navigation.reset;
        }
        getTablesNotification();
    }, [searchTable]);

    function handleChangeTable(item: TableProps) {
        setTableSelected(item);
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
                    <Text style={styles.title}>Mesas</Text>
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
                    <View style={styles.switch}>
                        <View style={styles.switchContentCallWaiter}>
                            <Text style={styles.switchContentText}>Liberar Garçom</Text>
                            <Switch value={tableSelected?.call_waiter} onChange={handleCallWaiter} />
                        </View>
                    </View>
                </View>
                <Modal
                    transparent={true}
                    visible={modalTableVisible}
                    animationType="fade">
                    <ModalPickerTable
                        handleCloseModal={() => setModalTableVisible(false)}
                        options={tables}
                        selectedItem={handleChangeTable} />
                </Modal>
            </ScrollView>
            <Footer />
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
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
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

    switch: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    switchContentCallWaiter: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 50,
        padding: 10
    },

    switchContentCloseBill: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 50,
        padding: 10
    },

    switchContentText: {
        fontSize: 25,
        color: '#FFF'
    }
})