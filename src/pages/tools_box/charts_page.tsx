import React, { useState } from "react"
import { ScrollView, StyleSheet, View } from 'react-native';
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";

const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]

const pieData = [
  {value: 54, color: '#177AD5', text: '54%'},
  {value: 40, color: '#79D2DE', text: '30%'},
  {value: 20, color: '#ED6665', text: '26%'},
];

const ChartsPage = () => {
  /**
   * React Native版本的Apache Echarts，基于react-native-svg和react-native-skia构建。这个出色的库相较于基于 WebView 的解决方案，性能有了显著提升。
   * https://github.com/wuba/react-native-echarts
   * */


  return (
    <ScrollView style={styles.container}>
      <BarChart
        noOfSections={3}
        barBorderRadius={4}
        // frontColor="lightgray"
        frontColor={'#177AD5'}
        barWidth={22}
        data = {data} />
      <LineChart
        color={'#177AD5'}
        dataPointsColor={'red'}
        data = {data} />
      <PieChart data = {pieData} />
      <PopulationPyramid data = {[{left:10,right:12}, {left:9,right:8}]} />
      <RadarChart data = {[50, 80, 90, 70]} />

      {/*// For Horizontal Bar chart, just add the prop horizontal to the <BarChart/> component*/}

      <BarChart data = {data} horizontal />

      {/*// For Area chart, just add the prop areaChart to the <LineChart/> component*/}

      <LineChart data = {data} areaChart />

      {/*// For Donut chart, just add the prop donut to the <PieChart/> component*/}

      <PieChart data = {data} donut />
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  },

})

export default ChartsPage
