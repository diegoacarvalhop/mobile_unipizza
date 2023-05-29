import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Options from '../pages/Options';
import TableCallWaiter from '../pages/TableCallWaiter';
import TableCloseBill from '../pages/TableCloseBill';
import Dashboard, { TableProps } from '../pages/Dashboard';
import Order from '../pages/Order';
import FinishOrder from '../pages/FinishOrder';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export type StackParamsList = {
  Options: undefined;
  TableCallWaiter: {
    tables: TableProps[] | []
  };
  TableCloseBill: {
    tables: TableProps[] | []
  };
  Dashboard: undefined;
  Order: {
    table: string | undefined;
    order_id: string;
  };
  FinishOrder: {
    table: string | undefined;
    order_id: string
  }
}

const Stack = createNativeStackNavigator<StackParamsList>();

export default function AppRoutes() {

  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Options"
        component={Options}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="TableCallWaiter"
        component={TableCallWaiter}
        options={{ headerShown: false }} />
        <Stack.Screen
        name="TableCloseBill"
        component={TableCloseBill}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ headerShown: false }} />
      <Stack.Screen
        name="FinishOrder"
        component={FinishOrder}
        options={{
          title: 'Finalizando',
          headerTitleStyle: {
            fontSize: 25,
            color: '#FFF'
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#1D1D2E'
          },
          headerLeft: () => (
            <Feather
              name='arrow-left'
              size={35}
              onPress={() => navigation.goBack()}
              title="Voltar"
              color="#FF3F4B"
            />
          ),
        }} />
    </Stack.Navigator>
  )
}