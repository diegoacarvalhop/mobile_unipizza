import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export function Footer() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Copyright &copy; {new Date().toISOString().substring(0, 4)} - Uni Pizza | Todos os direitos reservados</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },

    text: {
        color: '#FFF',
        fontSize: 14
    }
})