import {AsyncStorage} from 'react-native';
import database from '@react-native-firebase/database';
import Device from '../../models/device';
import User from '../../models/user';
import Location from '../../models/location';
export const DELETE_TRIP = 'DELETE_TRIP';
export const ADD_TRIP = 'ADD_TRIP';
export const UPDATE_TRIP = 'UPDATE_TRIP';
export const SET_ALL_INFOR = 'SET_ALL_INFOR';

export const fetchAllInfor = () => {
  return async (dispatch, getState) => {
    const userData = await AsyncStorage.getItem('userData');
    const transformedData = JSON.parse(userData);
    const {userId} = transformedData;
    const data1=await database().ref('/Device').once('value');
    const data2=await database().ref('/User').once('value');

    const getAllData=[ data1.val(),data2.val()];
    
    
    try {
      const resDataAll = await getAllData;

      const loadDevice = getArrDeviceInfo(resDataAll);
      const loadUsers = getArrUserInfo(resDataAll[1]);
      const curUser = getCurrentUser(loadUsers, userId);

      dispatch({
        type: SET_ALL_INFOR,
        devices: loadDevice,
        users: loadUsers,
        curUser: curUser,
        //vehicles: loadVehicle
      });
    } catch (err) {
      throw new Error();
    }
  };
};
const getOwnerUser = (ownerId, resDataUser) => {
  return getArrUserInfo(resDataUser).find(item => item.id === ownerId);
};
const getLocationDevice = location => {
  return new Location(location.lat, location.lng);
};
const getDeviceInfo = (device, id, resDataUser, resDataDevice) => {
  return new Device(
    id,
    device.DeviceName,
    getLocationDevice(device.Location),
    device.Type.Name,
    getOwnerUser(device.Type.Owner, resDataUser, resDataDevice),
    device.WaitingPermiss ? device.WaitingPermiss: []
  );
};

const getArrUserInfo = resDataUser => {
  const arrUser = [];
  for (const key in resDataUser) {
    arrUser.push(
      new User(
        key,
        resDataUser[key].Image,
        resDataUser[key].Permision,
        resDataUser[key].Name,
        resDataUser[key].UserId,
        resDataUser[key].DateOfBirth,
        resDataUser[key].MoreInfor,
        resDataUser[key].Phone,
        resDataUser[key].Email,
      ),
    );
  }
  return arrUser;
};
const getArrDeviceInfo = ([resDataDevice, resDataUser]) => {
  const arrDevice = [];

  for (const key in resDataDevice) {
    arrDevice.push(
      getDeviceInfo(resDataDevice[key], key, resDataUser, resDataDevice),
    );
  }
  return arrDevice;
};
const getCurrentUser = (arrDataUser, idAuth) => {
  return arrDataUser.find(item => item.idAuth === idAuth);
};

/*
const getTripPlaceInfo = (resDataPlace) => {
    const tripPlace = {};

    try {
        tripPlace.name = resDataPlace.Name;
        tripPlace.address = new Address(
            resDataPlace.Address.Description,
            resDataPlace.Address.FormattedAddress,
            new Location(
                resDataPlace.Address.Location.lat,
                resDataPlace.Address.Location.lng,
            )
        )

    } catch (err) {
        return tripPlace;
    }
    return tripPlace;


}
const getTicket = (resDataTicket) => {
    console.log(resDataTicket)
    return resDataTicket.map((item, index) => {
        console.log('this is get tiick');
        if (index === 0)
            return null;
        return (new Ticket(
            index,
            item.PaymentCondition,
            item.PickupLocation,
            item.SeatNumber,
            item.UserId
        ))
    })
}
const getDateWithTicket = (trip, typeFrom, idTime) => {

    console.log('this is date');

    return (trip[typeFrom][idTime].DateWithTiket ? trip[typeFrom][idTime].DateWithTiket.map((item, index) => {
        console.log('this is date2');

        console.log(item);
        if (index === 0)
            return null;

        const date = new Date(
            item.Date.Year,
            item.Date.Month,
            item.Date.Day
        )
        console.log(index);


        return (new TripWithTicket(
            index,
            date,
            getTicket(item.Tiket)
        ));
    }) : null)

}
const seatLocationHandler = (resDataSeatLocation) => {
    const seatLocation = {};
    for (const key in resDataSeatLocation) {
        const arr = []
        for (const key2 in resDataSeatLocation[key])
            arr.push(resDataSeatLocation[key][key2]);
        seatLocation[key] = arr;
    }
    return seatLocation;
}
const objectToArrayVehicle = (resDataVehicle) => {
    const arrVehicle = [];
    for (const key in resDataVehicle) {
        arrVehicle.push(new Vehicle(
            key,
            resDataVehicle[key].BKS,
            resDataVehicle[key].Location ? new Location(resDataVehicle[key].Location.lat, resDataVehicle[key].Location.lng) : null,
            resDataVehicle[key].Seat,
            seatLocationHandler(resDataVehicle[key].SeatLocation)

        ));
    }
    return arrVehicle;
}
const getVehicleInfo = (resDataVehicle, idVehicle) => {
    const arrVehicle = objectToArrayVehicle(resDataVehicle);
    return arrVehicle.find(data => data.id === idVehicle);
}
const getTimeInfo = (resDataTime, idTime) => {
    const arrTime = [];
    for (const key in resDataTime) {
        arrTime.push(new Time(key, resDataTime[key]));
    }
    return arrTime.find(data => data.id === idTime);
}

const getFromPT_SG = (resDataTime, trip, typeFrom, resDataVehicle) => {
    arrFrom = []
    for (const key in trip[typeFrom]) {

        arrFrom.push({
            Time: getTimeInfo(resDataTime, key),
            Vehicle: getVehicleInfo(resDataVehicle, trip[typeFrom][key].Vehicle),
            DateWithTicket: getDateWithTicket(trip, typeFrom, key)
        })
    }
    return arrFrom;
}
const getTripInfo = (resDataTime, trip, idTrip, resDataVehicle) => {

    return new Trip(
        idTrip,
        getFromPT_SG(resDataTime, trip, "FromPT", resDataVehicle),
        getFromPT_SG(resDataTime, trip, "FromSG", resDataVehicle),
        trip.Title,
        trip.Image,
        trip.Description,
        trip.Price,
        getTripPlaceInfo(trip.Place1),
        getTripPlaceInfo(trip.Place2)
    )
}
const getAllTripInfo = ([resDataTime, resDataTrip, resDataVehicle]) => {
    const arrTrip = [];
    for (const key in resDataTrip) {

        arrTrip.push(getTripInfo(resDataTime, resDataTrip[key], key, resDataVehicle));
        console.log('this is inside loop');
        console.log(arrTrip);

    }
    return arrTrip;


}


*/

/*
export const deletetrip = pidId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        response = await fetch(`https://the-shop-app-1c242.firebaseio.com/trips/${pidId}.json?auth=${token}`, {
            method: 'DELETE',

        });
        dispatch({
            type: DELETE_TRIP,
            pidId: pidId

        })


    }




}

export const addtrip = (title, imageUrl, description, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId=getState().auth.userId;
        response = await fetch(`https://the-shop-app-1c242.firebaseio.com/trips.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                imageUrl,
                description,
                price,
                ownerId: userId


            })
        });
        const resData = await response.json();
        dispatch({
            type: ADD_TRIP,
            id: resData.name,
            title,
            imageUrl,
            description,
            price,
            ownerId:userId,


        })
    }
}
export const updatetrip = (id, title, imageUrl, description) => {

    return async (dispatch, getState) => {
        const token = getState().auth.token;
        response = await fetch(`https://the-shop-app-1c242.firebaseio.com/trips/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                imageUrl,
                description,
            })
        });
        if (!response.ok) {
            throw new Error('Some thing went wrong');
        }
        dispatch({
            type: UPDATE_TRIP,
            pidId: id,
            title,
            imageUrl,
            description,
        })
    }

}

*/
