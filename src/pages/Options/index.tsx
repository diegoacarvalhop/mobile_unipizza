import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';
import { TableProps } from '../Dashboard';
import { Footer } from '../../components/Footer';

export default function Options() {
    const { user, signOut } = useContext(AuthContext);

    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [tablesCallWaiter, setTablesCallWaiter] = useState<TableProps[] | []>([]);
    const [tablesCloseBill, setTablesCloseBill] = useState<TableProps[] | []>([]);
    const [tablesCallWaiterNotification, setTablesCallWaiterNotification] = useState(true);
    const [tablesCloseBillNotification, setTablesCloseBillNotification] = useState(true);
    const [searchTable, setSearchTable] = useState(true);

    setTimeout(async function () {
        setSearchTable(!searchTable);
    }, 50);

    useEffect(() => {
        async function getTablesCallWaiterNotification() {
            const notification = await api.get('/tables/call_waiter');
            setTablesCallWaiter(notification.data);

            if (tablesCallWaiter.length === 0) {
                setTablesCallWaiterNotification(false);
            } else {
                setTablesCallWaiterNotification(true);
            }
        }

        getTablesCallWaiterNotification();

        async function getTablesCloseBillNotification() {
            const notification = await api.get('/tables/close_bill');
            setTablesCloseBill(notification.data);

            if (tablesCloseBill.length === 0) {
                setTablesCloseBillNotification(false);
            } else {
                setTablesCloseBillNotification(true);
            }
        }

        getTablesCloseBillNotification();
    }, [searchTable]);

    async function handleLogOut() {
        await signOut();
    }

    function openDashboard() {
        navigation.navigate('Dashboard');
    }

    function openTableCallWaiter() {
        navigation.navigate('TableCallWaiter', { tables: tablesCallWaiter });
    }

    function openTableCloseBill() {
        navigation.navigate('TableCloseBill', { tables: tablesCloseBill });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../assets/uni_pizza_logo.png')}
            />
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.user}>
                        <TouchableOpacity>
                            <Feather name="user" size={28} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.userText}>{user.name}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleLogOut}>
                        <Feather name="log-out" size={28} color="#FF3F4B" />
                    </TouchableOpacity>
                </View>
                <View style={styles.containerContent}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={openDashboard}>
                        <Text style={styles.buttonText}>Pedido</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { opacity: !tablesCallWaiterNotification ? 0.3 : 1 }]}
                        disabled={!tablesCallWaiterNotification}
                        onPress={() => {
                            tablesCallWaiterNotification === true && openTableCallWaiter()
                        }}>
                        <View style={styles.notification}>
                            <Text style={styles.buttonText}>Garçom</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { opacity: !tablesCloseBillNotification ? 0.3 : 1 }]}
                        disabled={!tablesCloseBillNotification}
                        onPress={() => {
                            tablesCloseBillNotification === true && openTableCloseBill()
                        }}>
                        <View style={styles.notification}>
                            <Text style={styles.buttonText}>Conta</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
    },

    logo: {
        width: '50%',
        height: '9%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '29%'
    },

    notification: {
        flexDirection: 'row',
        paddingHorizontal: '5%',
        alignItems: 'center'
    },

    header: {
        paddingTop: 30,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: '5%',
        alignItems: 'center'
    },

    user: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    userText: {
        color: '#FFF',
        fontSize: 28,
        marginLeft: '10%'
    },


    containerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '40%',
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