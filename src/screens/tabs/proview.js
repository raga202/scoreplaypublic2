import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Circle, Rect, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { fetchMatchDetail } from '../../services/cricketapi';

const { width } = Dimensions.get('window');
const GROUND_SIZE = width - 40; 
const CENTER = GROUND_SIZE / 2;

export default function ProView({ matchId }) {
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the specific match data
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMatchDetail(matchId);
      setMatch(data);
      setIsLoading(false);
    };
    loadData();
  }, [matchId]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Fallback if data is missing
  if (!match || !match.batsmen) {
    return <Text style={{color:'#fff', textAlign:'center', marginTop: 20}}>Pro data unavailable.</Text>;
  }

  // Get the striker for display (usually the first one in the list)
  const striker = match.batsmen.find(b => b.isStriker) || match.batsmen[0];

  return (
    <ScrollView style={styles.container}>
      
      {/* 1. ANALYTICS CARD */}
      <View style={styles.card}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
            <Text style={styles.header}>LIVE WAGON WHEEL</Text>
            <View style={styles.liveBadge}>
               <Text style={styles.liveText}>● PRO LIVE</Text>
            </View>
        </View>
        
        {/* Dynamic Batsman Name */}
        <Text style={styles.subHeader}>
            {striker.name} ({striker.runs} off {striker.balls})
        </Text>
        
        {/* --- THE VISUAL FIELD ENGINE --- */}
        <View style={styles.groundContainer}>
          <Svg height={GROUND_SIZE} width={GROUND_SIZE}>
            
            {/* Field Layers */}
            <Circle cx={CENTER} cy={CENTER} r={CENTER - 5} fill="#1a3300" stroke={Colors.primary} strokeWidth="2" />
            <Circle cx={CENTER} cy={CENTER} r={CENTER * 0.55} fill="none" stroke="#ffffff55" strokeWidth="1" strokeDasharray="4,4" />
            <Rect x={CENTER - 6} y={CENTER - 30} width="12" height="60" fill="#d2b48c" />

            {/* Dynamic Shots based on Striker (Simulated Logic) */}
            {/* If striker has > 50 runs, we show more aggressive lines */}
            <Line x1={CENTER} y1={CENTER} x2={CENTER - 80} y2={CENTER - 60} stroke="yellow" strokeWidth="3" />
            <Line x1={CENTER} y1={CENTER} x2={20} y2={CENTER} stroke="white" strokeWidth="2" strokeDasharray="2,2" />
            <Line x1={CENTER} y1={CENTER} x2={CENTER} y2={CENTER - 120} stroke={Colors.primary} strokeWidth="3" />
            
            {/* Add extra shot for high scorers */}
            {parseInt(striker.runs) > 20 && (
                <Line x1={CENTER} y1={CENTER} x2={CENTER + 60} y2={CENTER + 80} stroke="yellow" strokeWidth="3" />
            )}

          </Svg>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
             <View style={[styles.dot, {backgroundColor: 'yellow'}]}/>
             <Text style={styles.legendText}>Boundary</Text>
          </View>
          <View style={styles.legendItem}>
             <View style={[styles.dot, {backgroundColor: 'white'}]}/>
             <Text style={styles.legendText}>Single</Text>
          </View>
        </View>
      </View>

      {/* 2. PREDICTION CARD (Gamification) */}
      <View style={styles.card}>
        <Text style={styles.header}>PREDICT NEXT BALL</Text>
        <Text style={{color:'#888', marginBottom:15, fontSize:12}}>Guess correctly to win Rewards Points</Text>
        
        <View style={styles.predictRow}>
          <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>DOT</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>1-3</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>4 / 6</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btn, {borderColor: '#ff4444', borderWidth:1, backgroundColor:'#2a0a0a'}]}>
             <Text style={[styles.btnText, {color:'#ff4444'}]}>WKT</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  card: { margin: 15, padding: 20, backgroundColor: '#111', borderRadius: 16, borderWidth: 1, borderColor: '#222' },
  header: { color: Colors.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 },
  subHeader: { color: '#ccc', fontSize: 14, marginBottom: 20 },
  
  liveBadge: { backgroundColor: 'rgba(255,0,0,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  liveText: { color: '#ff4444', fontWeight: 'bold', fontSize: 10 },

  groundContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  
  legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  dot: { width: 10, height: 10, marginRight: 5 },
  legendText: { color: '#ccc', fontSize: 12 },
  
  predictRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  btn: { backgroundColor: '#222', paddingVertical: 15, borderRadius: 8, width: '23%', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
}); 