import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { Feather } from '@expo/vector-icons';
import { api } from '../../services/api';
import { ModalPickerTable } from '../../components/ModalPicker';
import { TableProps } from '../Dashboard';
import { Footer } from '../../components/Footer';
import { Col, Row, Grid } from "react-native-easy-grid";

type RouteDetailParams = {
    TableCloseBill: {
        tables: TableProps[] | [];
    }
}

type ItemsProps = {
    id: string;
    amount: number;
    name: string;
    price: string;
}

type PaymentProps = {
    id: string;
}

type CloseBillProps = {
    itemsCloseBill: ItemsProps[];
    totalBill: number;
    payment: PaymentProps;
}

type TableRouteProps = RouteProp<RouteDetailParams, 'TableCloseBill'>;

export default function TableCloseBill() {
    const route = useRoute<TableRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
    const [tables, setTables] = useState<TableProps[] | []>(route.params.tables);
    const [tableSelected, setTableSelected] = useState<TableProps | undefined>();
    const [modalTableVisible, setModalTableVisible] = useState(false);
    const [searchTable, setSearchTable] = useState(true);
    const [itemsCloseBill, setItemsCloseBill] = useState<CloseBillProps>();
    const [visibleBill, setVisibleBill] = useState(false);
    const [money, setMoney] = useState('');
    const [pix, setPix] = useState('');
    const [debit, setDebit] = useState('');
    const [credit, setCredit] = useState('');

    setTimeout(async function () {
        if (tables.length === 0) {
            navigation.navigate('Options');
        }
    }, 50);

    async function handleCloseBill() {
        const response = await api.get('/payment', {
            params: {
                table_id: tableSelected?.id
            }
        });

        setItemsCloseBill(response.data);
        setVisibleBill(true);
    }

    useEffect(() => {
        async function getTablesNotification() {
            const response = await api.get('/tables/close_bill');
            setTables(response.data);
            setTableSelected(response.data[0]);
            navigation.reset;
        }
        getTablesNotification();
    }, [searchTable]);

    function handleChangeTable(item: TableProps) {
        setTableSelected(item);
    }

    async function handleDeletePayment() {
        await api.delete('/payment', {
            params: {
                payment_id: itemsCloseBill?.payment.id
            }
        });
        setItemsCloseBill(undefined);
        setVisibleBill(false);
        setSearchTable(!searchTable);
    }

    async function handleFinishPayment() {
        const totalPaid = Number(money) + Number(pix) + Number(debit) + Number(credit);
        if (totalPaid !== itemsCloseBill?.totalBill) {
            alert('Valor pago diferente do valor total da conta!');
            return;
        }
        await api.put('/payment', {
            payment_id: itemsCloseBill.payment.id,
            debit: debit,
            credit: credit,
            pix: pix,
            money: money
        });
        setSearchTable(!searchTable);
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                itemsCloseBill?.itemsCloseBill.length === undefined && (
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
                )
            }
            <ScrollView>
                <View style={styles.containerContent}>
                    <Text style={
                        itemsCloseBill?.itemsCloseBill.length === undefined && (
                            styles.title
                        ) || (
                            [styles.title, { marginTop: '16.9%' }]
                        )
                    }>Mesas</Text>
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
                    <TouchableOpacity
                        style={[styles.buttonEnabled, { opacity: itemsCloseBill?.itemsCloseBill.length !== undefined ? 0.3 : 1 }]}
                        disabled={visibleBill}
                        onPress={handleCloseBill}>
                        <Text style={styles.buttonText}>Gerar Conta</Text>
                    </TouchableOpacity>
                </View>
                {
                    itemsCloseBill?.itemsCloseBill.length !== undefined && (
                        <View style={styles.header}>
                            <Grid>
                                <Col size={10}>
                                    <Row>
                                        <Text style={styles.itemsTextHeader}>Item</Text>
                                    </Row>
                                </Col>
                                <Col size={2} style={{ alignItems: 'flex-end' }}>
                                    <Row>
                                        <Text style={styles.itemsTextHeader}>Qtd</Text>
                                    </Row>
                                </Col>
                                <Col size={6} style={{ alignItems: 'flex-end' }}>
                                    <Row>
                                        <Text style={styles.itemsTextHeader}>V.Un</Text>
                                    </Row>
                                </Col>
                                <Col size={6} style={{ alignItems: 'flex-end' }}>
                                    <Row>
                                        <Text style={styles.itemsTextHeader}>V.Total</Text>
                                    </Row>
                                </Col>
                            </Grid>
                        </View>
                    )
                }
                {
                    itemsCloseBill?.itemsCloseBill.length !== undefined && (
                        itemsCloseBill?.itemsCloseBill.map(item => {
                            return (
                                <View key={item.id} style={styles.header}>
                                    <Grid>
                                        <Col size={10}>
                                            <Row>
                                                <Text style={styles.itemsText}>{item.name}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={2} style={{ alignItems: 'flex-end' }}>
                                            <Row>
                                                <Text style={styles.itemsText}>{item.amount}</Text>
                                            </Row>
                                        </Col>
                                        <Col size={6} style={{ alignItems: 'flex-end' }}>
                                            <Row>
                                                <Text style={styles.itemsText}>R$ {item.price},00</Text>
                                            </Row>
                                        </Col>
                                        <Col size={6} style={{ alignItems: 'flex-end' }}>
                                            <Row>
                                                <Text style={styles.itemsText}>R$ {Number(item.price) * item.amount},00</Text>
                                            </Row>
                                        </Col>
                                    </Grid>
                                </View>
                            )
                        })
                    )
                }
                {
                    itemsCloseBill?.itemsCloseBill.length !== undefined && (
                        <View style={styles.header}>
                            <Grid>
                                <Col size={15} style={{ alignItems: 'flex-end' }} >
                                    <Row>
                                        <Text style={styles.itemsTextHeader}>Total:</Text>
                                    </Row>
                                </Col>
                                <Col size={10} style={{ alignItems: 'flex-end' }}>
                                    <Row>
                                        <Text style={styles.itemsTextHeader}>R$ {itemsCloseBill?.totalBill},00</Text>
                                    </Row>
                                </Col>
                            </Grid>
                        </View>
                    )
                }
                {
                    itemsCloseBill?.itemsCloseBill.length !== undefined && (
                        <View style={styles.payment}>
                            <View style={styles.paid}>
                                <Text style={styles.textPaid}>Dinheiro</Text>
                                <TextInput
                                    style={[styles.input, { width: '50%', fontSize: 16, marginTop: 16 }]}
                                    placeholderTextColor="#F0F0F0"
                                    placeholder='Valor Dinheiro'
                                    keyboardType="numeric"
                                    value={money}
                                    onChangeText={setMoney} />
                            </View>
                            <View style={styles.paid}>
                                <Text style={styles.textPaid}>PIX</Text>
                                <TextInput
                                    style={[styles.input, { width: '50%', fontSize: 16, marginTop: 16 }]}
                                    placeholderTextColor="#F0F0F0"
                                    placeholder='Valor PIX'
                                    keyboardType="numeric"
                                    value={pix}
                                    onChangeText={setPix} />
                            </View>
                            <View style={styles.paid}>
                                <Text style={styles.textPaid}>Débito</Text>
                                <TextInput
                                    style={[styles.input, { width: '50%', fontSize: 16, marginTop: 16 }]}
                                    placeholderTextColor="#F0F0F0"
                                    placeholder='Valor Débito'
                                    keyboardType="numeric"
                                    value={debit}
                                    onChangeText={setDebit} />
                            </View>
                            <View style={styles.paid}>
                                <Text style={styles.textPaid}>Crédito</Text>
                                <TextInput
                                    style={[styles.input, { width: '50%', fontSize: 16, marginTop: 16 }]}
                                    placeholderTextColor="#F0F0F0"
                                    placeholder='Valor Crédito'
                                    keyboardType="numeric"
                                    value={credit}
                                    onChangeText={setCredit} />
                            </View>
                        </View>
                    )
                }
                {
                    itemsCloseBill?.itemsCloseBill.length !== undefined && (
                        <View style={styles.action}>
                            <TouchableOpacity
                                onPress={handleDeletePayment}
                                style={styles.buttonDelete}>
                                <Feather
                                    style={styles.delete}
                                    name='trash-2'
                                    size={35}
                                    title="Deletar"
                                    color="#FF3F4B"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleFinishPayment}
                                style={[styles.buttonCloseBill, { opacity: !money && !pix && !debit && !credit ? 0.3 : 1 }]}
                                disabled={!money && !pix && !debit && !credit}>
                                <Text style={styles.buttonText}>Registrar Pagamento</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
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

    delete: {
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
    },

    buttonEnabled: {
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
    },

    itemsTextHeader: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    itemsText: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center'
    },

    action: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: '5%',
        paddingHorizontal: '5%'
    },

    payment: {
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: '5%',
        paddingHorizontal: '5%'
    },


    buttonDelete: {

    },

    buttonCloseBill: {
        backgroundColor: '#3FFFA3',
        borderRadius: 10,
        height: 40,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%'
    },

    paid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    textPaid: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 15
    },

})