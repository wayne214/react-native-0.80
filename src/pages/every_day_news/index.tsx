import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView} from 'react-native-webview';
import axios from 'axios';
import ApiContants from '../../api/api_contants.ts';

function EveryDayNews (){
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    getNewsData()
  }, []);

  const getNewsData = () => {
    axios.get(ApiContants.every_day_news)
      .then(function (response) {
        // handle success
        console.log(response);
        if(response.data.code === 200) {
          if(response.data.data !== null) {
            setImageUrl(response.data.data.imageurl)
          }
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  return (
    <View style={styles.container}>
      <WebView source={{uri: imageUrl}} style={styles.webContainer}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1
  }
});

export default EveryDayNews;
