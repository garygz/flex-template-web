import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-helsinki',
    predictionPlace: {
      address: 'New York, USA',
      bounds: new LatLngBounds(new LatLng(46.63704981, -72.40922022), new LatLng(40.53187852,-80.26679704)),
    },
  },
  {
    id: 'default-turku',
    predictionPlace: {
      address: 'New Jersey, USA',
      bounds: new LatLngBounds(new LatLng(40.61586822, -73.60007516), new LatLng(38.99510404, -75.56449053)),
    },
  },
  {
    id: 'default-tampere',
    predictionPlace: {
      address: 'Massachuttes, USA',
      bounds: new LatLngBounds(new LatLng(42.94318836, -71.02279887), new LatLng(41.37931432, -72.98721424)),
    },
  },
  {
    id: 'default-oulu',
    predictionPlace: {
      address: 'Illinois, USA',
      bounds: new LatLngBounds(new LatLng(43.59559516, -84.83808182), new LatLng(37.17528237, -92.6957433)),
    },
  },
  {
    id: 'default-ruka',
    predictionPlace: {
      address: 'Virginia, USA',
      bounds: new LatLngBounds(new LatLng(41.73012935,-74.56716423), new LatLng(33.96521904, -83.73793524)),
    },
  },
];
