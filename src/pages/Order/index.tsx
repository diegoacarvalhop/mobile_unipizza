import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, Modal, FlatList, ScrollView } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { Footer } from "../../components/Footer";

type RouteDetailParams = {
    Order: {
        table: string | undefined;
        order_id: string;
    }
}

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export type CategoryProps = {
    id: string;
    name: string
}

export type ProductProps = {
    id: string;
    name: string;
}

type ItemProps = {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

export default function Order() {
    const [categories, setCategories] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
    const [modalProductVisible, setModalProductVisible] = useState(false);
    const [amount, setAmount] = useState('1');
    const [items, setItems] = useState<ItemProps[]>([]);

    useEffect(() => {
        async function getCategories() {
            const response = await api.get('/categories', {
                params: {
                    disable: '1'
                }
            });
            setCategories(response.data);
            setCategorySelected(response.data[0]);
        }

        getCategories();
    }, []);

    useEffect(() => {
        async function getProducts() {
            const response = await api.get('/product/bycategory', {
                params: {
                    category_id: categorySelected?.id
                }
            });
            setProducts(response.data);
            setProductSelected(response.data[0]);
        }

        getProducts();
    }, [categorySelected]);

    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    async function handleDeleteOrder() {
        await api.delete('/order', {
            params: {
                order_id: route.params?.order_id
            }
        }).then(() => {
            navigation.goBack();
        }).catch((error) => {
            const regex = new RegExp("('(.*?)')");
            const resultado = regex.exec(error.response.data.error) || [];
            Alert.alert('Erro', resultado[0]?.replaceAll("'", ""));
        });
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item);
    }

    function handleChangeProduct(item: ProductProps) {
        setProductSelected(item);
    }

    async function handleAddItem() {
        const response = await api.post('/order/add', {
            order_id: route.params.order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        });
        let data = {
            id: response.data.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }
        setItems(oldArray => [...oldArray, data]);
    }

    async function handleRemoveItem(item_id: string) {
        await api.delete('/order/remove', {
            params: {
                item_id: item_id
            }
        });
        let removeItem = items.filter(item => {
            return (item.id !== item_id)
        });
        setItems(removeItem);
    }

    function handleFinishOrder() {
        navigation.navigate('FinishOrder', {
            table: route.params.table,
            order_id: route.params.order_id
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.headerTable}>
                        <Text style={styles.title}>Mesa {route.params.table}</Text>
                        {
                            items.length === 0 && (
                                <TouchableOpacity
                                    onPress={handleDeleteOrder}>
                                    <Feather name="trash-2" size={28} color="#FF3F4B" />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    {
                        categories.length !== 0 && (
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setModalCategoryVisible(true)}>
                                <View style={styles.inputContent}>
                                    <Text style={{ color: '#FFF', marginTop: '1%', fontSize: 16 }}>
                                        {categorySelected?.name}
                                    </Text>
                                    <Feather name="chevron-down" size={28} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    {
                        products.length !== 0 && (
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setModalProductVisible(true)}>
                                <View style={styles.inputContent}>
                                    <Text style={{ color: '#FFF', marginTop: '1%', fontSize: 16 }}>
                                        {productSelected?.name}
                                    </Text>
                                    <Feather name="chevron-down" size={28} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    <View style={styles.qtdContainer}>
                        <Text style={styles.qtdText}>Quantidade</Text>
                        <TextInput
                            style={[styles.input, { width: '60%', textAlign: 'center', fontSize: 16 }]}
                            placeholderTextColor="#F0F0F0"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount} />
                    </View>
                    <View style={styles.action}>
                        <TouchableOpacity
                            onPress={handleAddItem}
                            style={styles.buttonAdd}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleFinishOrder}
                            disabled={items.length === 0}
                            style={[styles.buttonNext, { opacity: items.length === 0 ? 0.3 : 1 }]}>
                            <Text style={styles.buttonText}>Avançar</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1, marginTop: 24 }}
                        data={items}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) =>
                            <ListItem data={item} deleteItem={handleRemoveItem} />
                        }
                    />
                    <Modal
                        transparent={true}
                        visible={modalCategoryVisible}
                        animationType="fade">
                        <ModalPicker
                            handleCloseModal={() => setModalCategoryVisible(false)}
                            options={categories}
                            selectedItem={handleChangeCategory} />
                    </Modal>
                    <Modal
                        transparent={true}
                        visible={modalProductVisible}
                        animationType="fade">
                        <ModalPicker
                            handleCloseModal={() => setModalProductVisible(false)}
                            options={products}
                            selectedItem={handleChangeProduct} />
                    </Modal>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '5%'
    },

    container: {
        flex: 1,
        backgroundColor: '#1D1D2D',
    },

    headerTable: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 14
    },

    input: {
        backgroundColor: '#101026',
        borderRadius: 10,
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        alignContent: 'center',
        paddingHorizontal: 8,
        color: '#FFF',
        fontSize: 20,
    },

    inputContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    qtdText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF'
    },

    action: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },

    buttonAdd: {
        width: '20%',
        backgroundColor: '#3FD1FF',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold'
    },

    buttonNext: {
        backgroundColor: '#3FFFA3',
        borderRadius: 10,
        height: 40,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center'

    }
})