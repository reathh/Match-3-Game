var levelWithTiles = {
    columns: 8,
    rows: 8,
    hardCodedTiles: [
        {
            row: 0,
            col: 0,
            type: 'red',
            colors: [255, 128, 128]
        }
    ],
    tileTypes: [
        {
            type: "red",
            colors: [255, 128, 128]
        },
        {
            type: "green",
            colors: [128, 255, 128]
        },
        {
            type: "darkBlue",
            colors: [128, 128, 255]
        },
        {
            type: "yellow",
            colors: [255, 255, 128]
        },
        {
            type: "purple",
            colors: [255, 128, 255]
        },
        {
            type: "lightBlue",
            colors: [128, 255, 255]
        },
        {
            type: "white",
            colors: [255, 255, 255]
        }
    ]
};

var levelWithBarbies = {
    columns: 6,
    rows: 6,
    hardCodedTiles: [
    ],
    tileTypes: [
        {
            type: "Barbie",
            imageSource: "tile_1.png"
        },
        {
            type: "BarbieHead",
            imageSource: "tile_2.jpg"
        },
        {
            type: 'BarbieMd',
            imageSource: "tile_3.jpg"
        },
        {
            type: "MyLittlePony",
            imageSource: "tile_4.png"
        },
        {
            type: "LipStick",
            imageSource: "tile_5.jpg"
        },
        {
            type: "MinnieMouse",
            imageSource: "tile_6.gif"
        }
    ]
};

var levelWithMartivi = {
    columns: 5,
    rows: 5,
    hardCodedTiles: [
    ],
    tileTypes: [
        {
            type: "BeachMartivi",
            imageSource: "beachmartivi.jpg"
        },
        {
            type: "SpainMartivi",
            imageSource: "spainmartivi.jpg"
        },
        {
            type: 'ClassroomMartivi',
            imageSource: "classroommartivi.jpg"
        },
        {
            type: "ParkMartivi",
            imageSource: "parkmartivi.jpg"
        },
        // {
        //     type: "MoneyMartivi",
        //     imageSource: "moneymartivi.jpg"
        // },
        {
            type: "BedroomMartivi",
            imageSource: "bedroommartivi.jpg"
        },
        {
            type: "PromMartivi",
            imageSource: "prommartivi.jpg"
        },
        {
            type: "SchoolMartivi",
            imageSource: "schoolmartivi.jpg"
        },
        {
            type: "AtvMartivi",
            imageSource: "atvmartivi.jpg"
        },
        {
            type: "SofiaMartivi",
            imageSource: "sofiamartivi.jpg"
        },
        {
            type: "BirthdayMartivi",
            imageSource: "birthdaymartivi.jpg"
        },
        {
            type: "LickingMartivi",
            imageSource: "lickingmartivi.jpg"
        },
        {
            type: "KissingInSpainMartivi",
            imageSource: "kissinginspainmartivi.jpg"
        },
        {
            type: "KissingInSpain2Martivi",
            imageSource: "kissinginspain2martivi.jpg"
        },
        {
            type: "SeaMartivi",
            imageSource: "seamartivi.jpg"
        },
        {
            type: "Beachmartivi2",
            imageSource: "beachmartivi2.jpg"
        },
        {
            type: "SeasideMartivi",
            imageSource: "seasidemartivi.jpg"
        },
        {
            type: "Nadejdabeachmartivi",
            imageSource: "nadejdabeachmartivi.jpg"
        },
        {
            type: "NeofitMartivi",
            imageSource: "neofitmartivi.jpg"
        },
        {
            type: "Neofit2Martivi",
            imageSource: "neofit2martivi.jpg"
        },
        {
            type: "TatooMartivi",
            imageSource: "tatoomartivi.jpg"
        },
        {
            type: "CityMartivi",
            imageSource: "citymartivi.jpg"
        },
        {
            type: "BmwMartivi",
            imageSource: "bmwmartivi.jpg"
        },
        {
            type: "School2Martivi",
            imageSource: "school2martivi.jpg"
        },
        {
            type: "ZalojnaMartivi",
            imageSource: "zalojnamartivi.jpg"
        },
        {
            type: "Prom2Martivi",
            imageSource: "prom2martivi.jpg"
        },
        {
            type: "AirplaneMartivi",
            imageSource: "airplanemartivi.jpg"
        },
        {
            type: "Airplane2Martivi",
            imageSource: "airplane2martivi.jpg"
        },
        {
            type: "Spain2Martivi",
            imageSource: "spain2martivi.jpg"
        },
        {
            type: "MiddleSpainMartivi",
            imageSource: "midddlespainmartivi.jpg"
        },
        {
            type: "Spain3Martivi",
            imageSource: "spain3martivi.jpg"
        },
        {
            type: "Spain4Martivi",
            imageSource: "spain4martivi.jpg"
        },
        {
            type: "HoldingSpainMartivi",
            imageSource: "holdingspainmartivi.jpg"
        },
        {
            type: "PlaneMartivi",
            imageSource: "planemartivi.jpg"
        },
        {
            type: "HouseSpainMartivi",
            imageSource: "housespainmartivi.jpg"
        },
        {
            type: "BsMartivi",
            imageSource: "bsmartivi.jpg"
        },
        {
            type: "NadejdaBeach2Martivi",
            imageSource: "nadejdabeach2martivi.jpg"
        },
        {
            type: "MercariMartivi",
            imageSource: "mercarimartivi.jpg"
        },
        {
            type: "BdayMartivi",
            imageSource: "bdaymartivi.jpg"
        }
    ]
};

var gameEngine = new Engine($("#grid"));
gameEngine.createLevel(levelWithMartivi);
