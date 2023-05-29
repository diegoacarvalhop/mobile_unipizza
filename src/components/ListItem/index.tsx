import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';

interface ItemProps {
    data: {
        id: string;
        product_id: string;
        name: string;
        amount: string | number;
    },
    deleteItem: (item_id: string) => void;
}

export function ListItem({ data, deleteItem }: ItemProps) {
    function handleRemoveItem() {
        deleteItem(data.id);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.item}>{data.amount} - {data.name}</Text>
            <TouchableOpacity onPress={handleRemoveItem}>
                <Feather name="trash-2" color="#FF3F4B" size={25} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#101026',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 0.3,
        borderRadius: 10,
        borderColor: '#8A8A8A',
    },

    item: {
        color: '#FFF',
        fontSize: 16,
    }
})