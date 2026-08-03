import Styled from 'styled-components';

const GmapWraper = Styled.div`
    width: ${props => props.width}; 
    height: ${props => props.height};
    position: relative;
    .leaflet-container {
        wieth: ${props => props.width}; 
        height: ${props => props.height};
    }
`;

const Mapbox = Styled.div`
    // height: 180px;
    // @media only screen and (min-width: 992px){
        height: 450px;

        // padding-inline-start: 50px;
    // }

    &.mapbox-container{
        max-width: 590px;
        height: 140px;
        margin-inline-start: auto;
         @media only screen and (max-width: 700px){
            margin-inline-start: 50px;
    
         
         }

        .mapboxgl-canvas{
            border-radius : 12px !important;
            max-width: 590px;
            width: 100% !important;
        }
        .mapboxgl-ctrl{
            display: none !important;
        }
        .location-map-btn{
            position: absolute;
            inset-block-end: 10px;
            inset-inline-start: 10px;
            box-shadow: 0px 2px 4px 0px #00000026;


        }
    }
`;

export { GmapWraper, Mapbox };
