import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [kategori, setKategori] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      // console.log(obj);

      // alert(obj.notification.title)



      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'mountaincoffee', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });

    getDataKategori();

    if (isFocused) {
      __getDataUserInfo();
    }
    return unsubscribe;
  }, [isFocused]);


  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_barang.php').then(res => {
      console.log('barang', res.data);

      setKategori(res.data);
    })
  }


  const __getDataUserInfo = () => {
    getData('user').then(users => {
      console.log(users);
      setUser(users);
      axios.post(urlAPI + '/1_cart.php', {
        fid_user: users.id
      }).then(res => {
        console.log('cart', res.data);

        setCart(parseFloat(res.data))
      })
      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;


  const __renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Pinjam', item);
      }}
      style={{
        flex: 1,
        margin: 5,

      }}>
      <Image source={{
        uri: item.image
      }} style={{
        alignSelf: 'center',
        // resizeMode: 'contain',
        width: '100%',
        borderRadius: 10,
        height: 200,

      }} />

      {item.diskon > 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.black,
            textAlign: 'right',
            marginRight: 2,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>
          Rp. {new Intl.NumberFormat().format(item.harga_dasar)}
        </Text>
      }
      {item.diskon > 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.white,
          backgroundColor: colors.tertiary,
          fontFamily: fonts.secondary[600],
        }}>
        Disc {new Intl.NumberFormat().format(item.diskon)}%
      </Text>}



      {item.diskon == 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.zavalabs,
            textAlign: 'right',
            marginLeft: 5,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>

        </Text>
      }
      {item.diskon == 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.primary,

          fontFamily: fonts.secondary[600],
        }}>

      </Text>}



      <Text
        style={{
          paddingLeft: 5,
          fontSize: windowWidth / 25,
          color: colors.primary,
          fontFamily: fonts.secondary[600],
        }}>
        Rp. {new Intl.NumberFormat().format(item.harga_barang)}
      </Text>
      {/* <Text
        style={{
          padding: 5,
          backgroundColor: colors.primary,
          fontSize: windowWidth / 35,
          color: colors.white, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_kategori}
      </Text> */}
      <Text
        style={{
          padding: 5,
          height: 50,
          fontSize: windowWidth / 30,
          color: colors.black, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_barang}
      </Text>






    </TouchableOpacity>
  );


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>

      <View
        style={{
          height: windowHeight / 10,
          padding: 10,
          backgroundColor: colors.primary,
        }}>


        <View style={{
          flexDirection: 'row'
        }}>
          <TouchableOpacity onPress={() => navigation.navigate('Barang', {
            key: 0,
            id_user: user.id
          })} style={{
            flex: 1,
            height: 40,
            flexDirection: 'row',
            backgroundColor: colors.white,
            borderRadius: 5,

          }}>

            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
              <Icon type='ionicon' name="search-outline" color={colors.border} size={windowWidth / 30} />
            </View>
            <View style={{
              paddingLeft: 5,
              flex: 1,
              justifyContent: 'center'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                color: colors.border,
                fontSize: windowWidth / 30
              }}>Search Product</Text>
            </View>

          </TouchableOpacity>



          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{
              position: 'relative',
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'


            }}>
            <Icon type='ionicon' name="cart-outline" color={colors.white} />
            <Text style={{
              position: 'absolute', top: 2, right: 2, bottom: 5, backgroundColor: colors.black, width: 18,
              textAlign: 'center',
              height: 18, borderRadius: 10, color: colors.white
            }} >{cart}</Text>

          </TouchableOpacity>
        </View>


      </View>

      <ScrollView>
        <MyGap jarak={10} />
        <MyCarouser />


        <View style={{
          flexDirection: 'row',
          flex: 1,
          paddingHorizontal: 10,
          padding: 10,
          alignItems: 'center'
        }}>
          <Icon type='ionicon' name="grid" color={colors.black} />
          <Text style={{
            left: 10,
            color: colors.black,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 25,
          }}>Varian Mountain Coffee</Text>
        </View>
        <View style={{
          flex: 1
        }}>
          <FlatList numColumns={2} data={kategori} renderItem={__renderItem} />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
