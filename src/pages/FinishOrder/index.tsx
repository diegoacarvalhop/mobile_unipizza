import React from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { Footer } from "../../components/Footer";

type RouteDetailParams = {
    FinishOrder: {
        table: string | undefined;
        order_id: string;
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>;

export default function FinishOrder() {
    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    async function handleFinish() {
        try {
            await api.put('/order/send', {
                order_id: route.params.order_id
            });
            await api.put('/table/busy', {
                number: route.params.table
            });
            navigation.popToTop();
        } catch (error) {
            console.log("Erro ao finalizar o pedido!");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <Text style={styles.alert}>Você deseja finalizar este pedido?</Text>
                    <Text style={styles.title}>Mesa {route.params.table}</Text>
                    <TouchableOpacity
                        onPress={handleFinish}
                        style={styles.button}>
                        <Text style={styles.textButton}>Finalizar pedido</Text>
                        <Feather name="shopping-cart" size={25} color="#1D1D2E" />
                    </TouchableOpacity>
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
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '70%'
    },

    container: {
        flex: 1,
        backgroundColor: '#1D1D2D',
    },


    alert: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 12
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12
    },

    button: {
        backgroundColor: '#3FFFA3',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },

    textButton: {
        fontSize: 16,
        marginRight: 8,
        fontWeight: 'bold',
        color: '#1D1D2E'
    }
})