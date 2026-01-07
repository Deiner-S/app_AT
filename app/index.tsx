import OsCard from '@/components/indexComponents/orderBox';
import useOrderController from '@/hooks/orderController';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
 
  const {workOrders} = useOrderController()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>      
          {workOrders.map(item => (
              <OsCard key={item.operation_code} item={item}/>
          ))}      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    backgroundColor: '#25292e',    
    paddingHorizontal: 16,
    paddingTop: 16,
  },  
});
