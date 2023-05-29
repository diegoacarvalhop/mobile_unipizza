import React from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { CategoryProps, ProductProps } from "../../pages/Order";
import { TableProps } from "../../pages/Dashboard";

interface ModalPickerProps {
    options: CategoryProps[] | ProductProps[];
    handleCloseModal: () => void;
    selectedItem: (item: CategoryProps | ProductProps) => void;
}

interface ModalPickerTableProps {
    options: TableProps[];
    handleCloseModal: () => void;
    selectedItem: (item: TableProps) => void;
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export function ModalPicker({ options, handleCloseModal, selectedItem }: ModalPickerProps) {
    function onPressItem(item: CategoryProps | ProductProps) {
        selectedItem(item);
        handleCloseModal();
    }

    const categories = options.map((item, index) => (
        <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => onPressItem(item)}>
            <Text
                style={styles.item}>
                {item?.name}
            </Text>
        </TouchableOpacity>
    ))

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleCloseModal}>
            <SafeAreaView style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {categories}
                </ScrollView>
            </SafeAreaView>
        </TouchableOpacity>
    )
}

export function ModalPickerTable({ options, handleCloseModal, selectedItem }: ModalPickerTableProps) {

    function onPressItem(item: TableProps) {
        selectedItem(item);
        handleCloseModal();
    }

    const tables = options.map((item, index) => (
        <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => onPressItem(item)}>
            <Text
                style={styles.item}>
                Mesa {item?.number}
            </Text>
        </TouchableOpacity>
    ))

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleCloseModal}>
            <SafeAreaView style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {tables}
                </ScrollView>
            </SafeAreaView>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    content: {
        width: WIDTH - 20,
        height: HEIGHT / 2,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#8A8A8A',
        borderRadius: 10
    },

    option: {
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: '#8A8A8A'
    },

    item: {
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101026'
    }
})